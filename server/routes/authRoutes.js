// Import the Express framework to create an API
const express = require('express');

// Create a new router instance to define route handlers
const router = express.Router();

// Import the authentication controller functions for user registration and login
const { register, login } = require('../controllers/authController');

// Define a POST route for user registration
// When a request is made to '/register', the register function from authController is called
router.post('/register', register);

// Define a POST route for user login
// When a request is made to '/login', the login function from authController is called
router.post('/login', login);

// Export the router to be used in other parts of the application
module.exports = router;
