// Import the Express framework to create an API
const express = require('express');

// Create a new router instance to define route handlers
const router = express.Router();

// Import the function to handle chat messages from the chat controller
const { handleChatMessage } = require('../controllers/chatController');

// Import middleware for token authentication to secure the chat route
const authenticateToken = require('../middleware/authenticateToken');

// Define a POST route for handling chat messages
// The authenticateToken middleware is applied to ensure the user is authenticated before processing the chat message
router.post('/chat', authenticateToken, handleChatMessage);

// Export the router to be used in other parts of the application
module.exports = router;
