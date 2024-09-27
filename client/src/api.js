import axios from 'axios';

/**
 * Get the base URL for user-related API requests.
 * @returns {string} The API URL, defaulting to localhost if not set in environment.
 */
const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

/**
 * Get the base URL for deadlift detection API requests.
 * @returns {string} The detection API URL, defaulting to localhost if not set in environment.
 */
const getDetectApiUrl = () => {
  return process.env.REACT_APP_ML_API_URL || 'http://localhost:5001';
};

// Initialize API URLs
const API_URL = getApiUrl();
const DETECT_API_URL = getDetectApiUrl();

/**
 * Register a new user.
 * @param {string} username - The username for registration.
 * @param {string} password - The password for registration.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If registration fails.
 */
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Log in a user.
 * @param {string} username - The username for login.
 * @param {string} password - The password for login.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If login fails.
 */
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Send a chat message.
 * @param {string} message - The message to send.
 * @param {string} token - The authentication token.
 * @returns {Promise<string>} The bot's response message.
 */
export const sendMessage = async (message, token) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, 
      { message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Handling different response formats
    if (response.data && response.data.response) {
      const botResponse = response.data.response;
      let botMessageText = '';

      // Parsing response based on its type
      if (typeof botResponse === 'string') {
        botMessageText = botResponse;
      } else if (botResponse.parts && Array.isArray(botResponse.parts)) {
        botMessageText = botResponse.parts.map(part => part.text).join(' ');
      } else if (botResponse.text) {
        botMessageText = botResponse.text;
      } else {
        console.error('Unexpected response format:', botResponse);
        botMessageText = 'Error: Unexpected response format from server';
      }

      return botMessageText;
    } else {
      console.error('Unexpected response format:', response.data);
      return 'Error: Unexpected response from server';
    }
  } catch (error) {
    console.error('Error sending message:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return 'Error: Could not send message';
  }
};

/**
 * Get a list of users.
 * @returns {Promise<Array>} An array of user objects.
 * @throws {Error} If fetching users fails.
 */
export const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching users');
  }
};

/**
 * Update a user's data.
 * @param {string} userId - The ID of the user to update.
 * @param {Object} userData - The new user data.
 * @returns {Promise<Object>} The updated user data.
 * @throws {Error} If updating the user fails.
 */
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating user');
  }
};

/**
 * Delete a user.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If deleting the user fails.
 */
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error.response || error);
    throw new Error(error.response?.data?.message || 'Error deleting user');
  }
};

/**
 * Detect deadlift posture from a video frame.
 * @param {Blob} frame - The video frame as a Blob object.
 * @returns {Promise<Object>} The detection results.
 * @throws {Error} If detection fails.
 */
export const detectDeadlift = async (frame) => {
  const formData = new FormData();
  formData.append('frame', frame);

  try {
    const response = await axios.post(`${DETECT_API_URL}/detect`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting deadlift:', error.response?.data || error.message);
    throw new Error('Error detecting deadlift');
  }
};

/**
 * Reset the deadlift detection state.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If resetting fails.
 */
export const resetDeadlift = async () => {
  try {
    const response = await fetch(`${DETECT_API_URL}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error resetting:', error);
    throw new Error('Error resetting');
  }
};
