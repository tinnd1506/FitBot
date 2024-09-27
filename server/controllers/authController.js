// Import necessary modules
const bcrypt = require('bcryptjs');  // For hashing passwords and comparing hashes
const jwt = require('jsonwebtoken');  // For creating and verifying JWTs (JSON Web Tokens)
const User = require('../models/userModel');  // Import the User model for database operations

// Register a new user
const register = async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // Return a 400 status code with a message if the username is already taken
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password using bcrypt with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided username and hashed password
    const user = new User({ username, password: hashedPassword });

    // Save the new user to the database
    await user.save();

    // Return a 201 status code with a success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Return a 500 status code if any error occurs during the registration process
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login an existing user
const login = async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Find the user in the database by username
    const user = await User.findOne({ username });
    if (!user) {
      // Return a 400 status code with an error message if the user is not found
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Return a 400 status code if the password is incorrect
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT with the user's ID and role, and sign it with the secret key from environment variables
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Payload containing the user's ID and role
      process.env.JWT_SECRET,  // Secret key for signing the token
      { expiresIn: '1h' }  // Token expiration time (1 hour)
    );

    // Return the generated token and user's role in the response
    res.json({ token, role: user.role });
  } catch (error) {
    // Return a 500 status code if any error occurs during the login process
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Export the register and login functions for use in other parts of the application
module.exports = { register, login };
