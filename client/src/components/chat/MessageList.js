import React from 'react';
import { motion } from 'framer-motion';

// MessageList component displays a list of chat messages with editorial fitness styling
// Props:
// - messages: An array of message objects, each containing 'sender' and 'text'
const MessageList = ({ messages }) => {
  return (
    // Container for all messages with vertical spacing between them
    <div className="space-y-4">
      {messages.map((message, index) => (
        // Individual message container with animation
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className={`p-5 rounded-[var(--radius-lg)] ${
            // Conditional styling based on the message sender
            message.sender === 'bot'
              ? 'bg-white shadow-md border border-[var(--light-gray)]' // Bot messages
              : message.sender === 'user'
                ? 'bg-[var(--charcoal)] text-white shadow-md' // User messages
                : 'bg-[var(--error)]/10 border border-[var(--error)]/20' // System or error messages
          }`}
        >
          {/* Sender label */}
          <span className={`text-xs font-semibold tracking-wide uppercase mb-2 block ${
            message.sender === 'bot'
              ? 'text-[var(--terracotta)]'
              : message.sender === 'user'
                ? 'text-white/60'
                : 'text-[var(--error)]'
          }`}>
            {message.sender === 'bot' ? 'FitBot' : message.sender === 'user' ? 'You' : 'System'}
          </span>
          {/* Message text */}
          <p className={`leading-relaxed ${
            message.sender === 'user' ? 'text-white' : 'text-[var(--charcoal)]'
          }`}>
            {message.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default MessageList;
