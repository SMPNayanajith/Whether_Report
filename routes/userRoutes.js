const express = require('express');
const { body, param } = require('express-validator');
const { storeUserDetails, updateUserLocation, getUserWeatherData, loginUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/users', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('location').notEmpty().withMessage('Location is required')
], storeUserDetails);

router.post('/users/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], loginUser);

router.put('/users/:email', [
    param('email').isEmail().withMessage('Invalid email'),
    body('location').notEmpty().withMessage('Location is required')
], authenticate, updateUserLocation);

router.get('/users/:email/weather/:date', [
    param('email').isEmail().withMessage('Invalid email'),
    param('date').isISO8601().toDate().withMessage('Invalid date format')
], authenticate, getUserWeatherData);

module.exports = router;
