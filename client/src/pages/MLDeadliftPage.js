import React from 'react';
import DeadliftApp from '../components/machine learning/DeadliftApp';
import { useNavigate } from 'react-router-dom'; // Import for navigation functionality
import SharedBackground from '../components/backgrounds/SharedBackground';

// MLDeadliftPage component: This component integrates machine learning with the deadlift exercise session.
const MLDeadliftPage = () => {
  const navigate = useNavigate();

  // handleEndSession: Navigates user back to the chat page upon session completion.
  const handleEndSession = () => {
    navigate('/chat'); // Navigation path to the chat page, verify this path in your router configuration.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden">
      {/* SharedBackground component is used here to provide a consistent background across different pages with an additional geometric pattern overlay. */}
      <SharedBackground
        additionalElement={
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-geometric-pattern bg-no-repeat bg-center opacity-50"></div>
        }
      />
      <div className="z-10 text-center px-4 w-full">
        {/* Page title with a visual gradient effect for aesthetic enhancement. */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6">
          {/* Instruction text to ensure user setup for machine learning analysis. */}
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4 mt-8">
            Ensure your entire body is visible within the frame
          </div>
        </h1>
        {/* Main container for the DeadliftApp component which includes the machine learning functionality. */}
        <div className="p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
          <DeadliftApp handleEndSession={handleEndSession} />
          {/* Button to end the session, styled with a gradient and hover effects for better user interaction. */}
          <div className="mt-4 relative z-50">
            <button 
              onClick={handleEndSession}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition duration-300 transform hover:scale-110 shadow-lg"
            >
              End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLDeadliftPage;
