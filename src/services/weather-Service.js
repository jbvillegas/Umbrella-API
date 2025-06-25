// filepath: /Users/villegasjb/Documents/_API/Umbrella-API/src/services/weather-Service.js
const axios = require('axios');
const NodeCache = require('node-cache');

const BASE = 'https://api.openweathermap.org/data/2.5';
const KEY = process.env.OPENWEATHER_KEY;

// Cache for 5 minutes to reduce API calls
const cache = new NodeCache({ stdTTL: 300 });

async function fetchCurrentWeather(city, tier = 'free') {
  const cacheKey = `weather_${city}_${tier}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return { ...cached, cached: true };
  }

  const resp = await axios.get(`${BASE}/weather`, {
    params: { q: city, appid: KEY, units: 'metric' }
  });

  let result = {
    city: resp.data.name,
    country: resp.data.sys.country,
    temperature: {
      current: resp.data.main.temp,
      feels_like: resp.data.main.feels_like,
      min: resp.data.main.temp_min,
      max: resp.data.main.temp_max
    },
    weather: {
      main: resp.data.weather[0].main,
      description: resp.data.weather[0].description,
      icon: resp.data.weather[0].icon
    },
    humidity: resp.data.main.humidity,
    pressure: resp.data.main.pressure,
    visibility: resp.data.visibility,
    wind: {
      speed: resp.data.wind.speed,
      direction: resp.data.wind.deg
    },
    timestamp: new Date().toISOString(),
    cached: false
  };

  // Premium features
  if (tier === 'premium' || tier === 'enterprise') {
    result.premium = {
      uv_index: await fetchUVIndex(resp.data.coord.lat, resp.data.coord.lon),
      air_quality: await fetchAirQuality(resp.data.coord.lat, resp.data.coord.lon)
    };
  }

  // Enterprise features
  if (tier === 'enterprise') {
    result.enterprise = {
      forecast_7day: await fetch7DayForecast(city),
      historical_data: await fetchHistoricalData(resp.data.coord.lat, resp.data.coord.lon)
    };
  }

  cache.set(cacheKey, result);
  return result;
}

async function fetch7DayForecast(city) {
  try {
    const resp = await axios.get(`${BASE}/forecast`, {
      params: { q: city, appid: KEY, units: 'metric', cnt: 56 } // 7 days * 8 forecasts per day
    });
    
    return resp.data.list.map(item => ({
      datetime: item.dt_txt,
      temperature: item.main.temp,
      weather: item.weather[0].description,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed
    }));
  } catch (error) {
    return null;
  }
}

async function fetchUVIndex(lat, lon) {
  try {
    const resp = await axios.get(`${BASE}/uvi`, {
      params: { lat, lon, appid: KEY }
    });
    return resp.data.value;
  } catch (error) {
    return null;
  }
}

async function fetchAirQuality(lat, lon) {
  try {
    const resp = await axios.get(`${BASE}/air_pollution`, {
      params: { lat, lon, appid: KEY }
    });
    return {
      aqi: resp.data.list[0].main.aqi,
      components: resp.data.list[0].components
    };
  } catch (error) {
    return null;
  }
}

async function fetchHistoricalData(lat, lon) {
  // Placeholder for historical data - requires paid OpenWeather plan
  return {
    message: "Historical data requires OpenWeather paid plan",
    available: false
  };
}

async function fetchWeatherAlerts(city, tier = 'free') {
  if (tier === 'free') {
    return { message: 'Weather alerts available in premium tier' };
  }

  try {
    const resp = await axios.get(`${BASE}/weather`, {
      params: { q: city, appid: KEY }
    });
    
    // This would integrate with a weather alerts service
    return {
      alerts: [],
      message: 'No active weather alerts'
    };
  } catch (error) {
    throw new Error('Failed to fetch weather alerts');
  }
}

module.exports = { 
  fetchCurrentWeather, 
  fetch7DayForecast, 
  fetchWeatherAlerts,
  fetchUVIndex,
  fetchAirQuality
};