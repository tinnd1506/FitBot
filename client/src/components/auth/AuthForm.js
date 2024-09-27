import React from 'react';

// AuthForm component for handling both registration and login
const AuthForm = ({ isRegistering, handleAuth, username, setUsername, password, setPassword, error, setIsRegistering }) => {
  return (
    // Main container with styling for a semi-transparent, blurred background
    <div className="z-10 bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-2xl backdrop-filter backdrop-blur-lg w-full max-w-md">
      {/* Dynamic header that changes based on whether the user is registering or logging in */}
      <h2 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        {isRegistering ? 'Register' : 'Login'}
      </h2>
      
      {/* Form for user input */}
      <form onSubmit={handleAuth} className="space-y-6">
        {/* Username input field */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
        />
        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
        />
        {/* Submit button with dynamic text based on isRegistering state */}
        <button 
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-105"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      
      {/* Error message display */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      
      {/* Toggle button to switch between registration and login */}
      <button 
        onClick={() => setIsRegistering(!isRegistering)}
        className="w-full mt-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
      >
        {isRegistering ? 'Already have an account? Log In' : 'New user? Register here'}
      </button>
    </div>
  );
};

export default AuthForm;
