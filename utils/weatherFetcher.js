const axios = require('axios');
const User = require('../models/User');

const fetchWeather = async (location) => {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
    return response.data.weather[0].description;
};

const updateWeatherData = async () => {
    const users = await User.find();
    users.forEach(async (user) => {
        const weather = await fetchWeather(user.location);
        user.weatherData.push({ date: new Date(), weather });
        await user.save();
    });
};

module.exports = { fetchWeather, updateWeatherData };
