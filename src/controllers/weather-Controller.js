const { 
  fetchCurrentWeather, 
  fetch7DayForecast, 
  fetchWeatherAlerts 
} = require('../services/weather-Service');

// Determine subscription tier based on API key
function getTierForApiKey(apiKey) {
  const premiumKeys = process.env.PREMIUM_API_KEYS ? process.env.PREMIUM_API_KEYS.split(',') : [];
  const enterpriseKeys = process.env.ENTERPRISE_API_KEYS ? process.env.ENTERPRISE_API_KEYS.split(',') : [];
  
  if (enterpriseKeys.includes(apiKey)) return 'enterprise';
  if (premiumKeys.includes(apiKey)) return 'premium';
  return 'free';
}

async function getWeatherByCity(req, res, next) {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ 
      error: 'City parameter is required',
      message: 'Please provide a city name in the query parameter'
    });
  }

  try {
    const tier = getTierForApiKey(req.apiKey);
    const weatherData = await fetchCurrentWeather(city, tier);
    
    res.json({
      data: weatherData,
      tier,
      api_info: {
        requests_remaining: res.get('X-RateLimit-Remaining'),
        reset_time: res.get('X-RateLimit-Reset')
      }
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'City not found',
        message: 'The specified city could not be found'
      });
    }
    next(error);
  }
}

async function getWeatherForecast(req, res, next) {
  const city = req.query.city;
  const days = parseInt(req.query.days) || 7;

  if (!city) {
    return res.status(400).json({ 
      error: 'City parameter is required',
      message: 'Please provide a city name in the query parameter'
    });
  }

  const tier = getTierForApiKey(req.apiKey);
  
  if (tier === 'free') {
    return res.status(403).json({
      error: 'Premium feature',
      message: 'Weather forecasts require a premium or enterprise subscription',
      upgrade_url: '/api/billing/upgrade'
    });
  }

  try {
    const forecastData = await fetch7DayForecast(city);
    const limitedForecast = forecastData.slice(0, days * 8); // forecast limited to requested days (8 data points per day)
    
    res.json({
      data: {
        city,
        forecast: limitedForecast,
        days_requested: days
      },
      tier
    });
  } catch (error) {
    next(error);
  }
}

async function getWeatherAlerts(req, res, next) {
  const city = req.query.city;
  
  if (!city) {
    return res.status(400).json({ 
      error: 'City parameter is required',
      message: 'Please provide a city name in the query parameter'
    });
  }

  try {
    const tier = getTierForApiKey(req.apiKey);
    const alertsData = await fetchWeatherAlerts(city, tier);
    
    res.json({
      data: alertsData,
      tier
    });
  } catch (error) {
    next(error);
  }
}

async function getApiUsage(req, res, next) {
  const tier = getTierForApiKey(req.apiKey);
  
  //MOCK USAGE DATA
  const mockUsage = {
    current_period: {
      requests_made: Math.floor(Math.random() * 1000),
      requests_limit: tier === 'enterprise' ? 10000 : (tier === 'premium' ? 1000 : 100),
      period_start: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      period_end: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    },
    tier,
    features: {
      current_weather: true,
      forecasts: tier !== 'free',
      alerts: tier !== 'free',
      historical_data: tier === 'enterprise',
      air_quality: tier !== 'free',
      uv_index: tier !== 'free'
    }
  };

  res.json(mockUsage);
}

module.exports = { 
  getWeatherByCity, 
  getWeatherForecast, 
  getWeatherAlerts, 
  getApiUsage 
};