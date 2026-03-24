import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../api';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import { PageTransition } from '../components/animations/AnimationComponents';
import { FitBotLogo } from '../components/ui/Logo';

// Floating particles background
const FloatingParticles = ({ count = 15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[var(--terracotta)] opacity-5"
          style={{
            width: Math.random() * 15 + 5,
            height: Math.random() * 15 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 30 - 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// Morphing blob background
const MorphingBlob = ({ color = 'var(--terracotta)' }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
          borderRadius: ['60% 40% 30% 70%', '30% 60% 70% 40%', '60% 40% 30% 70%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--charcoal)' }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, 100, 0],
          borderRadius: ['30% 70% 70% 30%', '70% 30% 30% 70%', '30% 70% 70% 30%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
};

// Typing indicator animation
const TypingIndicator = () => {
  return (
    <motion.div 
      className="flex items-center gap-1 px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-[var(--light-gray)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--terracotta)]"
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--warm-gray)] ml-2">FitBot is thinking...</span>
    </motion.div>
  );
};

// Suggestion chips
const SuggestionChips = ({ onSuggestionClick }) => {
  const suggestions = [
    'How do I deadlift?',
    'Workout plan',
    'Nutrition tips',
    'Form check help',
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestions.map((suggestion, i) => (
        <motion.button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-[var(--light-gray)] rounded-full text-sm text-[var(--charcoal)] hover:bg-[var(--terracotta)]/10 hover:border-[var(--terracotta)]/30 transition-all"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
};

const ChatPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // State for managing chat messages, user input, and loading status
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
    navigate('/user');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[var(--oat)] via-[var(--cream)] to-[var(--oat)] flex flex-col relative overflow-hidden">
        {/* Background effects */}
        <FloatingParticles count={15} />
        
        {/* Morphing Blob Background */}
        <MorphingBlob color="var(--terracotta)" />
        
        {/* Energy pulse rings */}
        <div className="absolute top-1/4 left-1/4 pointer-events-none">
          <motion.div
            className="absolute w-40 h-40 rounded-full border-2 border-[var(--terracotta)]/20"
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute w-40 h-40 rounded-full border-2 border-[var(--terracotta)]/20"
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
          />
        </div>
        
        {/* Floating hexagon */}
        <div className="absolute right-20 top-1/3 pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="80" height="80" viewBox="0 0 100 100" className="opacity-20">
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="#E07A5F"
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        </div>
        
        {/* Floating dumbbell icons */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-10"
            style={{
              left: `${20 + i * 30}%`,
              top: `${60 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#E07A5F">
              <rect x="2" y="7" width="4" height="10" rx="1" />
              <rect x="18" y="7" width="4" height="10" rx="1" />
              <rect x="6" y="10" width="12" height="4" />
            </svg>
          </motion.div>
        ))}
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(224,122,95,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(94,139,126,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(var(--charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--charcoal) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Header */}
        <motion.header 
          className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-[var(--light-gray)]/50 bg-white/90 backdrop-blur-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button 
              onClick={() => navigate('/user')}
              className="p-2 hover:bg-[var(--light-gray)] rounded-full transition-colors"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-[var(--charcoal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <FitBotLogo size={36} className="text-[var(--terracotta)]" />
              </motion.div>
              <div>
                <span className="text-caption text-[var(--warm-gray)]">AI FITNESS COACH</span>
                <h1 className="text-lg font-bold text-[var(--charcoal)]">Chat with FitBot</h1>
              </div>
            </div>
          </motion.div>
          
          <motion.button
            onClick={handleEndChat}
            className="px-4 py-2 bg-[var(--charcoal)]/5 hover:bg-[var(--charcoal)]/10 text-[var(--charcoal)] font-medium rounded-lg text-sm transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            End Chat
          </motion.button>
        </motion.header>
        
        {/* Messages area */}
        <div className="flex-grow overflow-auto relative z-10">
          <div className="max-w-3xl mx-auto px-6 py-6">
            {/* Welcome card for first message */}
            {messages.length <= 1 && (
              <motion.div
                className="mb-8 p-6 bg-gradient-to-br from-[var(--charcoal)] to-[var(--dark-gray)] rounded-2xl text-white relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Heartbeat ECG line - at bottom away from text */}
                <svg className="absolute bottom-2 left-0 right-0 h-8 opacity-40" viewBox="0 0 400 50" preserveAspectRatio="none">
                  <motion.path
                    d="M0 25 L50 25 L60 5 L70 45 L80 25 L120 25 L130 10 L140 40 L150 25 L200 25 L210 15 L220 35 L230 25 L280 25 L290 8 L300 42 L310 25 L400 25"
                    fill="none"
                    stroke="#E07A5F"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </svg>

                {/* Pulsing heart - top right corner away from text */}
                <div className="absolute right-4 top-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <svg className="w-8 h-8 text-red-500 opacity-30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Small floating dumbbell - top left corner */}
                <div className="absolute left-4 top-4 opacity-20">
                  <motion.div
                    animate={{ y: [0, -5, 0], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <svg className="w-6 h-6 text-[var(--terracotta)]" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="7" width="4" height="10" rx="1" fill="currentColor"/>
                      <rect x="18" y="7" width="4" height="10" rx="1" fill="currentColor"/>
                      <rect x="6" y="10" width="12" height="4" fill="currentColor"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Small running figure - bottom right corner */}
                <div className="absolute right-20 bottom-2 opacity-15">
                  <motion.div
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <svg className="w-8 h-8 text-[var(--success)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Small rep dots - far top right */}
                <div className="absolute right-32 top-6 flex gap-1 opacity-25">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[var(--terracotta)]"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  <motion.h2 
                    className="text-2xl font-bold mb-3 text-white tracking-tight drop-shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Welcome to FitBot Chat
                  </motion.h2>
                  <motion.p 
                    className="text-white/90 text-base mb-5 font-medium leading-relaxed"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    I'm your AI fitness assistant. Ask me anything about workouts, nutrition, or form correction.
                  </motion.p>
                </div>
              </motion.div>
            )}
            
            {/* Suggestion Chips - below welcome card */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <p className="text-sm text-[var(--warm-gray)] mb-3 font-medium">Quick suggestions:</p>
                <SuggestionChips onSuggestionClick={handleSend} />
              </motion.div>
            )}
            
            <MessageList messages={messages} />
            
            {/* Typing indicator */}
            <AnimatePresence>
              {isLoading && (
                <div className="flex justify-start mt-4">
                  <TypingIndicator />
                </div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <motion.div 
          className="relative z-10 p-6 border-t border-[var(--light-gray)]/50 bg-white/90 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-3xl mx-auto">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              handleKeyPress={handleKeyPress}
              isLoading={isLoading}
            />
            <p className="text-center text-xs text-[var(--warm-gray)] mt-3">
              Press Enter to send • Type 'stop' to return to dashboard
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ChatPage;
