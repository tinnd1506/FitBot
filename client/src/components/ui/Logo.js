import React from 'react';
import { motion } from 'framer-motion';

// Chic Modern AI Fitness Logo - Neural Network + Dumbbell fusion
const FitBotLogo = ({ size = 48, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E07A5F" />
          <stop offset="100%" stopColor="#C45D43" />
        </linearGradient>
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      
      {/* Hexagon background - AI/fitness fusion shape */}
      <path 
        d="M24 2 L43 13 V37 L24 48 L5 37 V13 Z" 
        fill="url(#logoGradient)"
      />
      
      {/* Neural network nodes */}
      <circle cx="24" cy="16" r="3" fill="white" />
      <circle cx="16" cy="24" r="3" fill="white" />
      <circle cx="32" cy="24" r="3" fill="white" />
      <circle cx="24" cy="32" r="3" fill="white" />
      
      {/* Neural connections - representing AI */}
      <path d="M24 16 L16 24" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M24 16 L32 24" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M16 24 L24 32" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      <path d="M32 24 L24 32" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
      
      {/* Central AI core - pulsing dot */}
      <circle cx="24" cy="24" r="5" fill="white" />
      <circle cx="24" cy="24" r="2" fill="#E07A5F" />
    </svg>
  );
};

// Minimal icon version
const FitBotIcon = ({ size = 40, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E07A5F" />
          <stop offset="100%" stopColor="#C45D43" />
        </linearGradient>
      </defs>
      
      {/* Hexagon */}
      <path 
        d="M20 2 L36 11 V29 L20 38 L4 29 V11 Z" 
        fill="url(#iconGradient)"
      />
      
      {/* Neural pattern */}
      <circle cx="20" cy="14" r="2.5" fill="white" />
      <circle cx="12" cy="20" r="2.5" fill="white" />
      <circle cx="28" cy="20" r="2.5" fill="white" />
      <circle cx="20" cy="26" r="2.5" fill="white" />
      <circle cx="20" cy="20" r="4" fill="white" />
      <circle cx="20" cy="20" r="1.5" fill="#E07A5F" />
    </svg>
  );
};

// Brand with text - Modern typography
const FitBotBrand = ({ size = 40, showText = true, dark = false, iconClassName = '', textClassName = '' }) => {
  return (
    <div className="flex items-center gap-3">
      <FitBotLogo 
        size={size} 
        className={iconClassName || 'text-[var(--terracotta)]'} 
      />
      {showText && (
        <span className={`font-bold text-xl tracking-tight ${textClassName || (dark ? 'text-[var(--charcoal)]' : 'text-white')}`}>
          Fit<span className="text-[var(--terracotta)]">Bot</span>
        </span>
      )}
    </div>
  );
};

export { FitBotLogo, FitBotIcon, FitBotBrand };
export default FitBotLogo;
