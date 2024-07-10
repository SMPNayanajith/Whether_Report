const { validationResult } = require('express-validator');
const User = require('../models/User');
const { fetchWeather } = require('../utils/weatherFetcher');
const jwt = require('jsonwebtoken');

// Utility function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.storeUserDetails = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, location } = req.body;

    try {
        const user = new User({ email, password, location });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateUserLocation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.params;
    const { location } = req.body;

    try {
        const user = await User.findOneAndUpdate({ email }, { location }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'Location updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserWeatherData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, date } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const weatherData = user.weatherData.filter(data => 
            new Date(data.date).toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
        );
        res.json({ weatherData });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
