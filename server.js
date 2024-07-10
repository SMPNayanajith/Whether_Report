require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const { fetchWeather, updateWeatherData } = require('./utils/weatherFetcher');
const User = require('./models/User'); // Make sure to import the User model

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

// Connect to MongoDB
connectDB();

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendWeatherEmails = async () => {
    const users = await User.find();
    users.forEach(async (user) => {
        const weather = await fetchWeather(user.location);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Hourly Weather Report',
            text: `The current weather in ${user.location} is ${weather}.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

// Schedule tasks to run
cron.schedule('0 */3 * * *', sendWeatherEmails);
cron.schedule('0 * * * *', updateWeatherData);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
