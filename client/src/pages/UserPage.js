import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../components/hooks/useAuth';
import { PageTransition, StaggerContainer, StaggerItem } from '../components/animations/AnimationComponents';
import { FitBotLogo, FitBotBrand } from '../components/ui/Logo';
import MessageList from '../components/chat/MessageList';
import Options from '../components/options/Options';

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
            y: [0, -50, 0],
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

// Feature Card Component
const FeatureCard = ({ icon, title, description, onClick, delay = 0 }) => {
  return (
    <motion.div
      className="card p-6 group cursor-pointer relative overflow-hidden border-2 border-transparent hover:border-[var(--terracotta)]/30 transition-all duration-300"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: '0 20px 40px -15px rgba(224, 122, 95, 0.2)'
      }}
      onClick={onClick}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(224,122,95,0.1), transparent)',
          backgroundSize: '200% 100%'
        }}
        animate={{
          backgroundPosition: ['200% 0%', '-200% 0%']
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div 
        className="text-4xl mb-4 inline-block relative z-10"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-bold text-[var(--charcoal)] mb-2 relative z-10">{title}</h3>
      <p className="text-[var(--dark-gray)] text-sm font-medium leading-relaxed relative z-10">{description}</p>
      
      {/* Arrow indicator */}
      <motion.div
        className="absolute bottom-4 right-4 text-[var(--terracotta)] opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        →
      </motion.div>
    </motion.div>
  );
};

// Welcome Hero Component with Fitness Motion
const WelcomeHero = ({ onWorkout, onChat }) => {
  return (
    <motion.div 
      className="relative bg-gradient-to-br from-[var(--charcoal)] to-[var(--charcoal)]/90 rounded-3xl p-8 lg:p-12 text-white overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated energy rings - expanded rings effect */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-[var(--terracotta)]"
            style={{ 
              top: '50%', 
              left: '50%', 
              marginLeft: -60 - i * 20, 
              marginTop: -60 - i * 20,
              width: 120 + i * 40,
              height: 120 + i * 40,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.3, 1.3],
              opacity: [0.4 - i * 0.1, 0, 0],
              borderWidth: ['2px', '4px', '2px'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute right-16 top-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="none"
              stroke="#E07A5F"
              strokeWidth="3"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      </div>
      
      <div className="absolute right-32 bottom-16">
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [45, 225, 405],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="w-12 h-12"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              fill="none"
              stroke="#5E8B7E"
              strokeWidth="3"
              opacity="0.5"
              rx="10"
            />
          </svg>
        </motion.div>
      </div>
      
      <div className="absolute left-1/2 top-6">
        <motion.div
          animate={{
            y: [0, -12, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="w-10 h-10"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="#E07A5F"
              opacity="0.3"
            />
          </svg>
        </motion.div>
      </div>

      {/* Dynamic wave lines */}
      <svg className="absolute bottom-8 left-0 right-0 h-24 opacity-30" viewBox="0 0 400 100" preserveAspectRatio="none">
        <motion.path
          d="M0 50 Q50 10, 100 50 T200 50 T300 50 T400 50"
          fill="none"
          stroke="#E07A5F"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            d: [
              "M0 50 Q50 10, 100 50 T200 50 T300 50 T400 50",
              "M0 50 Q50 90, 100 50 T200 50 T300 50 T400 50",
              "M0 50 Q50 10, 100 50 T200 50 T300 50 T400 50",
            ]
          }}
          transition={{ 
            pathLength: { duration: 2, repeat: Infinity },
            d: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 0.5 }
          }}
        />
      </svg>

      {/* Orbiting dots */}
      <div className="absolute left-12 top-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 relative"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-[var(--terracotta)]"
              style={{
                top: '50%',
                left: '50%',
                marginLeft: -6,
                marginTop: -6,
              }}
              animate={{
                x: [0, Math.cos(i * Math.PI / 2) * 35],
                y: [0, Math.sin(i * Math.PI / 2) * 35],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                repeatType: 'reverse',
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Pulsing gradient orbs */}
      <motion.div
        className="absolute right-1/4 top-1/4 w-40 h-40 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(224,122,95,0.4) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div
        className="absolute left-1/3 bottom-1/4 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(94,139,126,0.3) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <span className="text-caption text-white font-semibold tracking-wide" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>DASHBOARD</span>
        </motion.div>
        
        <motion.h1 
          className="text-3xl lg:text-4xl font-bold mb-4 text-white"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Ready to Train?
        </motion.h1>
        
        <motion.p 
          className="text-white text-lg font-medium mb-8 max-w-lg leading-relaxed"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Choose your training mode. Get real-time form feedback, or talk through your workout with a coach.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onWorkout}
            className="px-6 py-3 bg-[var(--terracotta)] text-white font-bold rounded-xl shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(224, 122, 95, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              🏋️ Start Form Check
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </span>
          </motion.button>
          
          <motion.button
            onClick={onChat}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              💬 Chat with Coach
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

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
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[var(--oat)] via-[var(--cream)] to-[var(--oat)] relative overflow-hidden" style={{ fontFamily: 'var(--font-primary)' }}>
        {/* Background effects */}
        <FloatingParticles count={15} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(var(--charcoal) 1px, transparent 1px), linear-gradient(90deg, var(--charcoal) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Header */}
        <motion.header 
          className="sticky top-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-[var(--light-gray)]/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FitBotLogo size={40} className="text-[var(--terracotta)]" />
              <div>
                <h1 className="font-bold text-[var(--charcoal)] text-xl tracking-tight">FitBot</h1>
                <p className="text-sm text-[var(--charcoal)] font-semibold">Your AI Fitness Coach</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 bg-[var(--charcoal)]/10 hover:bg-[var(--charcoal)]/15 text-[var(--charcoal)] font-semibold rounded-lg text-sm transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </div>
        </motion.header>

        <div className="container mx-auto px-6 py-8 space-y-8 relative z-10">
          {/* Welcome Hero */}
          <WelcomeHero 
            onWorkout={() => handleOptionClick('deadlift')}
            onChat={() => handleOptionClick('chat')}
          />

          {/* Interactive Sections Grid - Replacing repetitive cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workout Preview Card */}
            <motion.div
              className="lg:col-span-2 card p-6 relative overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleOptionClick('deadlift')}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--terracotta)]/10 via-transparent to-[var(--success)]/10"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[var(--charcoal)] text-xl tracking-tight">Form Check Session</h3>
                    <p className="text-sm text-[var(--charcoal)] font-semibold">Deadlift • Real-time AI Feedback</p>
                  </div>
                  <motion.div
                    className="w-12 h-12 rounded-full bg-[var(--terracotta)]/10 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg className="w-6 h-6 text-[var(--terracotta)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Progress visualization */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-[var(--light-gray)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--success)] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                      />
                    </div>
                    <p className="text-sm text-[var(--charcoal)] font-semibold mt-2">Ready to start • 3 sets recommended</p>
                  </div>
                  <motion.span 
                    className="text-sm font-bold text-[var(--terracotta)]"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Start →
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Panel */}
            <motion.div
              className="card p-6 bg-gradient-to-br from-[var(--charcoal)] to-[var(--charcoal)]/90 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold mb-4 text-white text-lg tracking-tight">Quick Actions</h3>
              
              <div className="space-y-3">
                <motion.button
                  onClick={() => handleOptionClick('chat')}
                  className="w-full py-3 px-4 bg-white/10 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--terracotta)]/20 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Chat with Coach</span>
                </motion.button>
                
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="w-full py-3 px-4 bg-white/10 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--success)]/20 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M19.8 12H9" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Switch Account</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Coach Messages */}
          <motion.div 
            className="card p-6 bg-white/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--terracotta)]/10 flex items-center justify-center">
                <FitBotLogo size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--charcoal)] text-lg tracking-tight">Coach Messages</h3>
                <p className="text-sm text-[var(--charcoal)] font-semibold">Latest from your AI assistant</p>
              </div>
            </div>
            <MessageList messages={messages} />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserPage;

