const {fetchCurrentWeather} = require('../services/weather-Service');

async function getWeatherByCity (req, res, next) {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }
    try {
        const weatherData = await fetchCurrentWeather(city);
        res.json(weatherData);
    } catch (error) {
        next(error);    
    }
}

module.exports ={getWeatherByCity};