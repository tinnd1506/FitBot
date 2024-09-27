// Import the User model for interacting with the users collection in the database
const User = require('../models/userModel');

// Fetch all users, returning only their username and role
const getUsers = async (req, res) => {
  try {
    // Find all users and select only 'username' and 'role' fields
    const users = await User.find({}, 'username role');
    
    // Send the list of users in the response
    res.json(users);
  } catch (error) {
    // If an error occurs, send a 500 status code and an error message
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update an existing user's information by userId
const updateUser = async (req, res) => {
  try {
    // Extract userId from request parameters and the updated data from the request body
    const { userId } = req.params;
    const { username, role } = req.body;

    // Find the user by ID and update the username and role, returning the updated user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, role },  // Update these fields
      { new: true, runValidators: true }  // Return the updated document and run schema validators
    );

    // If no user is found, return a 404 Not Found status with an error message
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the updated user object in the response
    res.json(updatedUser);
  } catch (error) {
    // If an error occurs, send a 500 status code and an error message
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete a user by userId
const deleteUser = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    console.log('Attempting to delete user with ID:', userId);

    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(userId);

    // If no user is found for deletion, return a 404 Not Found status with an error message
    if (!deletedUser) {
      console.log('User not found for deletion');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User deleted successfully');

    // Send a success message in the response
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    // If an error occurs, log the error and send a 500 status code with an error message
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Export the getUsers, updateUser, and deleteUser functions to be used in other routes
module.exports = { getUsers, updateUser, deleteUser };
