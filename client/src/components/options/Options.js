import React from 'react';

// Options component receives handleOptionClick and handleLogout as props
const Options = ({ handleOptionClick, handleLogout }) => {
  return (
    // Container for all buttons with flex layout and hover effect
    <div className="flex flex-col space-y-4 mt-4 transform transition duration-500 hover:scale-105">
      {/* Chat option button */}
      <button 
        onClick={() => handleOptionClick('chat')} 
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-110 shadow-lg"
      >
        Engage in Fitness Discussion
      </button>
      
      {/* Deadlift analysis option button */}
      <button 
        onClick={() => handleOptionClick('deadlift')} 
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-110 shadow-lg"
      >
        Utilize Machine Learning for Deadlift Form Analysis
      </button>
      
      {/* Logout button with different color scheme */}
      <button 
        onClick={handleLogout} 
        className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 transform hover:scale-110 shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Options;
