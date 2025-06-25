const router = require('express').Router();
const { authenticateApiKey } = require('../middlewares/auth');
const { applyRateLimit } = require('../middlewares/rateLimiting');
const { 
  getWeatherByCity, 
  getWeatherForecast, 
  getWeatherAlerts, 
  getApiUsage 
} = require('../controllers/weather-Controller');

// AUTHENTICATION AND RATE LIMITING MIDDLEWARE
router.use(authenticateApiKey);
router.use(applyRateLimit);

// CURRRENT WEATHER DATA
router.get('/current', getWeatherByCity);

// CURRENT WEATHER BY CITY
router.get('/forecast', getWeatherForecast);

// ALERTS FOR WEATHER CONDITIONS
router.get('/alerts', getWeatherAlerts);

// API STATS
router.get('/usage', getApiUsage);

router.get('/', getWeatherByCity);

module.exports = router; 
