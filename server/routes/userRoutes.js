// Import the Express framework to create an API
const express = require('express');

// Create a new router instance to define route handlers
const router = express.Router();

// Import controller functions for user management from the userController
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');

// Import middleware for token authentication and authorization
const authenticateToken = require('../middleware/authenticateToken');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// Define protected routes for user management

// Route to get all users
// This route requires authentication and admin authorization
router.get('/users', authenticateToken, authorizeAdmin, getUsers);

// Route to update a specific user by userId
// This route requires authentication and admin authorization
router.put('/users/:userId', authenticateToken, authorizeAdmin, updateUser);

// Route to delete a specific user by userId
// This route requires authentication and admin authorization
router.delete('/users/:userId', authenticateToken, authorizeAdmin, deleteUser);

// Export the router to be used in other parts of the application
module.exports = router;
