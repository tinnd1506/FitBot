import React from 'react';

// ChatInput component for handling user input and chat actions
const ChatInput = ({ input, setInput, handleSend, handleKeyPress, handleEndChat, isLoading }) => {
  return (
    // Main container with styling for a glass-like effect
    <div className="p-4 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
      <div className="flex items-center max-w-2xl mx-auto">
        {/* Text input field for user messages */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-grow p-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-white shadow-inner"
        />
        {/* Send button */}
        <button 
          onClick={() => handleSend(input)} 
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-r-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-110 shadow-lg"
        >
          Send
        </button>
        {/* End Chat button */}
        <button 
          onClick={handleEndChat}
          className="ml-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 transform hover:scale-110 shadow-lg"
        >
          End Chat
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
