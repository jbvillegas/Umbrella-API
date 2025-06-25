const router = require('express').Router();
const { authenticateApiKey } = require('../middlewares/auth');
const { applyRateLimit } = require('../middlewares/rateLimiting');
const { 
  getWeatherByCity, 
  getWeatherForecast, 
  getWeatherAlerts, 
  getApiUsage 
} = require('../controllers/weather-Controller');

// Apply authentication and rate limiting to all weather routes
router.use(authenticateApiKey);
router.use(applyRateLimit);

// Current weather (available to all tiers)
router.get('/current', getWeatherByCity);

// Weather forecast (premium and enterprise only)
router.get('/forecast', getWeatherForecast);

// Weather alerts (premium and enterprise only)
router.get('/alerts', getWeatherAlerts);

// API usage statistics
router.get('/usage', getApiUsage);

// Legacy endpoint for backward compatibility
router.get('/', getWeatherByCity);

module.exports = router; 
