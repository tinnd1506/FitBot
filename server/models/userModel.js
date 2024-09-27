// Import Mongoose, a library used for MongoDB object modeling in Node.js
const mongoose = require('mongoose');

// Define the schema (structure) for the User model
const UserSchema = new mongoose.Schema({
  // Username field: must be a string, required for every user, and unique to prevent duplicates
  username: { type: String, required: true, unique: true },

  // Password field: must be a string and is required for every user
  password: { type: String, required: true },

  // Role field: specifies the user's role, can only be either 'user' or 'admin', defaults to 'user'
  role: { 
    type: String, 
    enum: ['user', 'admin'], // Role must be one of these two values
    default: 'user'  // Default role is 'user' if not specified
  }
});

// Export the User model, which will map the UserSchema to a MongoDB collection named 'users'
module.exports = mongoose.model('User', UserSchema);
