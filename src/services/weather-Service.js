// filepath: /Users/villegasjb/Documents/_API/Umbrella-API/src/services/weather-Service.js
const axios = require('axios');
const BASE = 'https://api.openweathermap.org/data/2.5';
const KEY = process.env.OPENWEATHER_KEY;

async function fetchCurrentWeather(city) {
  const resp = await axios.get(`${BASE}/weather`, {
    params: { q: city, appid: KEY, units: 'metric' }
  });
  return {
    city: resp.data.name,
    temp: resp.data.main.temp,
    weather: resp.data.weather[0].description
  };
}

module.exports = { fetchCurrentWeather };