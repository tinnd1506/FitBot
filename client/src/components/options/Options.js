import React from 'react';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '../animations/AnimationComponents';

// Options component receives handleOptionClick as props with editorial fitness styling
const Options = ({ handleOptionClick }) => {
  const options = [
    {
      id: 'chat',
      title: 'Fitness Chat',
      description: 'Discuss your fitness goals with our AI assistant',
      icon: '💬',
      color: 'var(--charcoal)'
    },
    {
      id: 'deadlift',
      title: 'Deadlift Analysis',
      description: 'Real-time form correction using machine learning',
      icon: '🏋️',
      color: 'var(--terracotta)'
    }
  ];

  return (
    <StaggerContainer className="space-y-4">
      {options.map((option) => (
        <StaggerItem key={option.id}>
          <motion.button
            onClick={() => handleOptionClick(option.id)}
            className="w-full p-6 bg-white rounded-[var(--radius-lg)] shadow-md hover:shadow-lg transition-all duration-300 text-left flex items-center gap-4 group"
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${option.color}15` }}
            >
              {option.icon}
            </div>
            
            {/* Text content */}
            <div className="flex-grow">
              <h3 className="font-semibold text-lg text-[var(--charcoal)] group-hover:text-[var(--terracotta)] transition-colors">
                {option.title}
              </h3>
              <p className="text-sm text-[var(--warm-gray)] mt-1">
                {option.description}
              </p>
            </div>
            
            {/* Arrow */}
            <motion.div
              className="text-[var(--warm-gray)] group-hover:text-[var(--terracotta)] transition-colors"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.button>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};

export default Options;
