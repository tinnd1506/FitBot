// src/pages/AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { registerUser, loginUser } from '../api';
import { useAuth } from '../components/hooks/useAuth';
import { PageTransition } from '../components/animations/AnimationComponents';
import { FitBotLogo } from '../components/ui/Logo';

// Floating particles component
const FloatingParticles = ({ count = 15 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[var(--terracotta)] opacity-10"
          style={{
            width: Math.random() * 20 + 5,
            height: Math.random() * 20 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Morphing blob background
const MorphingBlob = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--terracotta)' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
          borderRadius: ['60% 40% 30% 70%', '30% 60% 70% 40%', '60% 40% 30% 70%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{ background: 'var(--charcoal)' }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, 100, 0],
          borderRadius: ['30% 70% 70% 30%', '70% 30% 30% 70%', '30% 70% 70% 30%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
};

// Animated gradient text
const GradientText = ({ children, className = '' }) => {
  return (
    <motion.span
      className={`bg-gradient-to-r from-[var(--terracotta)] via-[var(--charcoal)] to-[var(--terracotta)] bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
      animate={{
        backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

// Shimmer button effect
const ShimmerButton = ({ children, onClick, className = '', type = 'button' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// 3D Tilt card
const TiltCard = ({ children, className = '' }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 20);
    setRotateY((centerX - x) / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// Animated input field
const AnimatedInput = ({ id, type, value, onChange, label, icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl z-10"
        animate={{
          scale: isFocused ? 1.2 : 1,
          y: isFocused ? -40 : '-50%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          className="w-full bg-white/80 backdrop-blur-sm border-2 border-[var(--light-gray)] rounded-xl px-12 py-4 text-[var(--charcoal)] font-medium transition-all duration-300 focus:border-[var(--terracotta)] focus:outline-none focus:bg-white"
          required
        />
        <motion.label
          htmlFor={id}
          className="absolute left-12 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] font-medium pointer-events-none transition-all duration-300"
          animate={{
            y: value || isFocused ? -28 : '-50%',
            scale: value || isFocused ? 0.85 : 1,
            color: isFocused ? 'var(--terracotta)' : 'var(--warm-gray)',
          }}
        >
          {label}
        </motion.label>
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-[var(--terracotta)]"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  );
};

const AuthPage = () => {
  // State management for form inputs and UI control
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { login } = useAuth();

  // Handle form submission for both registration and login
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        // Handle user registration
        await registerUser(username, password);
        setIsRegistering(false);
        setError('');
      } else {
        // Handle user login
        const { token, role } = await loginUser(username, password);
        login(token, role);
        // Redirect based on user role
        navigate(role === 'admin' ? '/admin' : '/user');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Render the authentication page with editorial fitness aesthetic
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[var(--oat)] via-[var(--cream)] to-[var(--oat)] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background effects */}
        <MorphingBlob />
        <FloatingParticles count={20} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(var(--terracotta) 1px, transparent 1px), linear-gradient(90deg, var(--terracotta) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <motion.div 
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
          <TiltCard>
            {/* Card container */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-10 border border-white/50">
              {/* Logo */}
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <FitBotLogo size={60} className="text-[var(--terracotta)]" />
              </motion.div>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.span 
                  className="text-caption block mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {isRegistering ? 'JOIN FITBOT' : 'WELCOME BACK'}
                </motion.span>
                <motion.h2 
                  className="text-3xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {isRegistering ? (
                    <>
                      Create <GradientText>Account</GradientText>
                    </>
                  ) : (
                    <>
                      Sign <GradientText>In</GradientText>
                    </>
                  )}
                </motion.h2>
              </div>
              
              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-6">
                <AnimatedInput
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  label="Username"
                  icon="👤"
                />
                
                <AnimatedInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  icon="🔒"
                />
                
                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block mr-2"
                      >
                        ⚠️
                      </motion.span>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Submit button */}
                <ShimmerButton
                  type="submit"
                  className="w-full bg-[var(--charcoal)] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <motion.span
                    className="flex items-center justify-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    {isRegistering ? 'Create Account' : 'Sign In'}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </ShimmerButton>
              </form>
              
              {/* Toggle between login/register */}
              <div className="mt-8 text-center">
                <p className="text-[var(--warm-gray)] text-sm">
                  {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                  <motion.button
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setError('');
                    }}
                    className="ml-2 text-[var(--terracotta)] font-bold hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRegistering ? 'Sign In' : 'Create Account'}
                  </motion.button>
                </p>
              </div>
            </div>
          </TiltCard>
          
          {/* Back to home link */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              onClick={() => navigate('/')}
              className="text-sm text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors flex items-center justify-center gap-2 mx-auto"
              whileHover={{ x: -5 }}
            >
              <motion.span
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ←
              </motion.span>
              Back to home
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;
