import React from 'react';

// MessageList component displays a list of chat messages
// Props:
// - messages: An array of message objects, each containing 'sender' and 'text'
const MessageList = ({ messages }) => {
  return (
    // Container for all messages with vertical spacing between them
    <div className="space-y-4">
      {messages.map((message, index) => (
        // Individual message container
        <div 
          key={index} 
          className={`p-4 rounded-lg ${
            // Conditional styling based on the message sender
            message.sender === 'bot' 
              ? 'bg-green-800 bg-opacity-50 backdrop-filter backdrop-blur-lg' // Bot messages
              : message.sender === 'user'
                ? 'bg-blue-800 bg-opacity-50 backdrop-filter backdrop-blur-lg' // User messages
                : 'bg-red-800 bg-opacity-50 backdrop-filter backdrop-blur-lg' // System or error messages
          }`}
        >
          {/* Message text */}
          <p className="text-white">{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
