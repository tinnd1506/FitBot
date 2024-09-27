// Import mongoose for interacting with MongoDB and dotenv to manage environment variables
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file, ensure it's at the top

// Define an asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    // Get the MongoDB URI from the environment variables
    const uri = process.env.MONGODB_URI;
    
    // Throw an error if the URI is not defined, ensuring the .env file has the correct key
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Attempt to connect to MongoDB with the provided URI
    await mongoose.connect(uri);

    // Log a success message if the connection is established
    console.log('MongoDB connected successfully');
  } catch (error) {
    // If any error occurs during the connection, log it and exit the process
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit with failure code
  }
};

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;
