import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from '../components/ui/AnimatedText';
import SharedBackground from '../components/backgrounds/SharedBackground';

// LandingPage component: The main entry point for new users
const LandingPage = () => {
  // Text to be animated in the header
  const fullText = "Welcome to FitBot";

  return (
    // Main container with gradient background and centered content
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white relative overflow-hidden">
      {/* SharedBackground component with additional geometric pattern */}
      <SharedBackground
        additionalElement={
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-geometric-pattern bg-no-repeat bg-center opacity-50"></div>
        }
      />
      {/* Content container */}
      <div className="z-10 text-center px-4">
        {/* Animated header with gradient text */}
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-6 animate-text-reveal">
          <AnimatedText text={fullText} />
          <span className="animate-blink">|</span>
        </h1>
        {/* Description paragraph with fade-in animation */}
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up">
          <span className="inline-block">Using machine learning for real-time pose correction,</span>{' '}
          <span className="inline-block">FitBot optimizes your workouts and offers expert online coaching.</span>
        </p>
        {/* CTA button linking to authentication page */}
        <Link to="/auth">
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:scale-105 shadow-lg">
            Unleash Your Potential
          </button>
        </Link>
      </div>
      {/* Footer with copyright information */}
      <div className="absolute bottom-4 text-gray-400 text-sm">
        © 2024 FitBot. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;
