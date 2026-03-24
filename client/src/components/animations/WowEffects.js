import React from 'react';
import { motion } from 'framer-motion';

// Floating particles background component
export const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    color: ['var(--terracotta)', 'var(--charcoal)', 'var(--oat)'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Morphing blob background
export const MorphingBlob = ({ color = 'var(--terracotta)' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
            borderRadius: ['60% 40% 30% 70%', '30% 60% 70% 40%', '60% 40% 30% 70%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--charcoal)' }}
        animate={{
          scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 100, 0],
            borderRadius: ['30% 70% 70% 30%', '70% 30% 30% 70%', '30% 70% 70% 30%']
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

// Spotlight container that follows mouse
export const SpotlightContainer = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(224,122,95,0.15) 0%, transparent 70%)',
          left: mousePosition.x - 128,
          top: mousePosition.y - 128
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {children}
    </div>
  );
};
