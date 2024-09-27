// Import necessary libraries and modules
const express = require('express'); // Express framework for building the API
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const connectDB = require('./config/db'); // Database connection function
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const userRoutes = require('./routes/userRoutes'); // User management routes
const chatRoutes = require('./routes/chatRoutes'); // Chat functionality routes
require('dotenv').config(); // Load environment variables from a .env file

// Create an instance of the Express application
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to the MongoDB database
connectDB();

// Register authentication routes under the '/api' prefix
app.use('/api', authRoutes);

// Register user management routes under the '/api' prefix
app.use('/api', userRoutes);

// Register chat functionality routes under the '/api' prefix
app.use('/api', chatRoutes);

// Catch-all route for handling 404 errors
// Logs the request method and URL for debugging purposes
app.use((req, res) => {
  console.log(`Received request for ${req.method} ${req.url}`);
  res.status(404).send('Not Found'); // Respond with a 404 status and 'Not Found' message
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Log server start message
