import React from 'react';
import { motion } from 'framer-motion';

// ChatInput component for handling user input with editorial fitness styling
const ChatInput = ({ input, setInput, handleSend, handleKeyPress, isLoading }) => {
  return (
    // Main container with card styling
    <div className="flex items-center gap-3">
      {/* Text input field for user messages */}
      <div className="flex-grow relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="w-full px-6 py-4 bg-white border border-[var(--light-gray)] rounded-full focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20 transition-all duration-300 text-[var(--charcoal)] placeholder:text-[var(--warm-gray)]"
        />
      </div>
      
      {/* Send button */}
      <motion.button
        onClick={() => handleSend(input)}
        disabled={isLoading || !input.trim()}
        className="px-6 py-4 bg-[var(--charcoal)] text-[var(--oat)] font-semibold rounded-full hover:bg-[var(--terracotta)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ChatInput;
