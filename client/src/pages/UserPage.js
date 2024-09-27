import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/hooks/useAuth';
import MessageList from '../components/chat/MessageList';
import Options from '../components/options/Options';
import SharedBackground from '../components/backgrounds/SharedBackground'; 

const UserPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    // Display initial greeting message when the component mounts
    setMessages([
      {
        text: "Welcome to FitBot! I'm your AI fitness assistant. Ready to crush your goals? Let's get started!",
        sender: 'bot'
      }
    ]);
  }, []);

  const handleOptionClick = (option) => {
    setShowOptions(false);
    setMessages([]); // Clear previous messages
    // Navigate to the appropriate page based on the selected option
    if (option === 'chat') {
      navigate('/fitness-chat');
    } else if (option === 'deadlift') {
      navigate('/deadlift');
    }
  };

  const handleLogout = () => {
    logout(); // Call the logout function from useAuth hook
    navigate('/auth'); // Redirect to the authentication page
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden">
      <SharedBackground /> 
      <div className="flex-grow p-4 overflow-auto relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          <MessageList messages={messages} />
          {showOptions && (
            <Options handleOptionClick={handleOptionClick} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;

