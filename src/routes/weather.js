const router = require('express').Router();
const { getWeatherByCity } = require('../controllers/weather-Controller');

router.get('/', getWeatherByCity);

module.exports = router; 
