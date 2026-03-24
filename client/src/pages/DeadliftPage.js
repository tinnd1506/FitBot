import React from 'react';
import { motion } from 'framer-motion';
import DeadliftApp from '../components/ml/DeadliftApp';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/animations/AnimationComponents';
import { FitBotBrand } from '../components/ui/Logo';

// Animated background waves
const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        d="M0,50 Q25,30 50,50 T100,50"
        fill="none"
        stroke="var(--terracotta)"
        strokeWidth="0.5"
        animate={{ 
          d: [
            "M0,50 Q25,30 50,50 T100,50",
            "M0,50 Q25,70 50,50 T100,50",
            "M0,50 Q25,30 50,50 T100,50"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,60 Q25,40 50,60 T100,60"
        fill="none"
        stroke="var(--terracotta)"
        strokeWidth="0.5"
        animate={{ 
          d: [
            "M0,60 Q25,40 50,60 T100,60",
            "M0,60 Q25,80 50,60 T100,60",
            "M0,60 Q25,40 50,60 T100,60"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </svg>
    {/* Floating particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-[var(--terracotta)] opacity-5"
        style={{
          width: Math.random() * 10 + 5,
          height: Math.random() * 10 + 5,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

// MLDeadliftPage component
const MLDeadliftPage = () => {
  const navigate = useNavigate();

  const handleEndSession = () => {
    navigate('/user');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--oat)] relative">
        <AnimatedBackground />
        
        {/* Sticky Header */}
        <motion.header 
          className="sticky top-0 z-50 px-6 py-3 bg-white/80 backdrop-blur-lg border-b border-[var(--light-gray)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.button 
                onClick={() => navigate('/user')}
                className="p-2 hover:bg-[var(--light-gray)] rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 text-[var(--charcoal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              {/* FitBot Logo */}
              <FitBotBrand size={32} showText={true} dark={true} />
            </div>
          </div>
        </motion.header>

        {/* Main content - full height without scrolling */}
        <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)]">
          <motion.div
            className="card overflow-hidden h-full shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DeadliftApp onEndSession={handleEndSession} />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MLDeadliftPage;

