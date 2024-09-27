import React from 'react';

// SharedBackground component creates a visually appealing background with multiple layers
// It accepts an optional additionalElement prop for extra customization
const SharedBackground = ({ additionalElement }) => {
  return (
    // Main container for the background, positioned absolutely and covering the entire viewport
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {/* Base layer: Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-purple-900 opacity-75"></div>
      
      {/* Noise texture layer for added visual interest */}
      <div className="absolute inset-0 bg-noise opacity-10"></div>
      
      {/* Animated layers for dynamic effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pulsing purple layer */}
        <div className="absolute inset-0 transform-gpu scale-150 filter blur-3xl bg-purple-800 mix-blend-overlay animate-pulse-slow opacity-30"></div>
        
        {/* Pulsing black layer */}
        <div className="absolute inset-0 transform-gpu scale-150 filter blur-3xl bg-black mix-blend-overlay animate-pulse-slower opacity-30"></div>
      </div>
      
      {/* Render any additional elements passed as props */}
      {additionalElement}
    </div>
  );
};

export default SharedBackground;
