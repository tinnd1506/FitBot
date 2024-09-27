import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage } from '../api';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import SharedBackground from '../components/backgrounds/SharedBackground'; // Import the new background component

const ChatPage = () => {
  const navigate = useNavigate();
  
  // State for managing chat messages, user input, and loading status
  const [messages, setMessages] = useState([
    { text: "Let's pump up your fitness knowledge! What would you like to know about?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle sending messages
  const handleSend = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // Check for authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token available.");
        return;
      }

      // Add user message to the chat
      setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);

      // Check for 'stop' command to end chat
      if (message.toLowerCase().includes('stop')) {
        navigate('/user'); // Navigate to UserPage when 'stop' is detected
      } else {
        // Send message to backend and add bot response to chat
        const botMessageText = await sendMessage(message, token);
        setMessages(prevMessages => [...prevMessages, { text: botMessageText, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prevMessages => [...prevMessages, { text: 'Error: Could not send message', sender: 'system' }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  // Handle 'Enter' key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // Function to end the chat session
  const handleEndChat = () => {
    navigate('/chat');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden">
      <SharedBackground /> {/* Render shared background component */}
      <div className="flex-grow p-4 overflow-auto relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          <MessageList messages={messages} />
        </div>
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleKeyPress={handleKeyPress}
        isLoading={isLoading}
        handleEndChat={handleEndChat}
      />
    </div>
  );
};

export default ChatPage;
