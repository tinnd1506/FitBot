import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerContainer, StaggerItem } from '../components/animations/AnimationComponents';
import { FloatingParticles, MorphingBlob, SpotlightContainer } from '../components/animations/WowEffects';
import { FitBotLogo, FitBotBrand } from '../components/ui/Logo';

// Activity Ring Component - Apple Fitness style
const ActivityRing = ({ percentage = 75, color = 'var(--terracotta)', size = 60, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
        {percentage}%
      </div>
    </div>
  );
};

// Heartbeat pulse animation
const HeartbeatPulse = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-red-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="currentColor"
        />
      </motion.svg>
      <motion.span
        className="text-white font-mono text-sm"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        142 BPM
      </motion.span>
    </div>
  );
};

// Calorie burn counter
const CalorieCounter = ({ calories = 284, className = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = calories / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= calories) {
          setCount(calories);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, calories]);

  return (
    <div ref={ref} className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="text-orange-500"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
        </svg>
      </motion.div>
      <div className="text-white">
        <span className="font-bold text-2xl font-mono">{count}</span>
        <span className="text-white/60 text-xs ml-1">KCAL</span>
      </div>
    </div>
  );
};

// Timer component
const WorkoutTimer = ({ className = '' }) => {
  const [seconds, setSeconds] = useState(42);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-green-500"
      />
      <span className="text-white font-mono text-xl">
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

// Rep counter
const RepCounter = ({ reps = 12, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="text-[var(--terracotta)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"/>
        </svg>
      </div>
      <div className="text-white">
        <span className="font-bold text-3xl">{reps}</span>
        <span className="text-white/60 text-xs ml-1">REPS</span>
      </div>
    </div>
  );
};

// Live workout indicator
const LiveIndicator = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className="w-3 h-3 rounded-full bg-red-500"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span className="text-white font-bold text-sm tracking-wider">LIVE</span>
    </div>
  );
};

// Text scramble effect
const TextScramble = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/2;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);
  
  return <span className={className}>{displayText}</span>;
};

// Animated gradient border
const GradientBorder = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute -inset-[2px] rounded-[2rem] z-0"
        style={{
          background: 'linear-gradient(90deg, #E07A5F, #5E8B7E, #D4A574, #E07A5F)',
          backgroundSize: '300% 100%'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Floating orb with trail
const FloatingOrb = ({ size = 20, color, delay = 0, duration = 10 }) => {
  return (
    <motion.div
      className="absolute rounded-full blur-md"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        filter: 'blur(8px)'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        scale: [0, 1, 1, 0],
        x: [0, 100, -50, 0],
        y: [0, -150, -50, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

// Wave text animation
const WaveText = ({ text, className = '' }) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={{
            y: [0, -5, 0],
            color: ['var(--charcoal)', 'var(--terracotta)', 'var(--charcoal)']
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.05,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Animated counter hook
const useCountUp = (end, duration = 2) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / (duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(end * progress));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);
  
  return { count, ref };
};

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const { count, ref } = useCountUp(parseInt(value.replace(/[^0-9]/g, '')), 2);
  
  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Glitch text effect
const GlitchText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return <span className={className}>{displayText}</span>;
};

// Pulsing button with glow
const PulseButton = ({ children, onClick, className }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--terracotta)] blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Floating fitness icon with trail
const FloatingFitnessIcon = ({ icon, delay = 0 }) => {
  return (
    <motion.div
      className="absolute text-4xl"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [100, -100],
        x: [0, 50, -50, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      {icon}
    </motion.div>
  );
};

// Wave background
const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="var(--terracotta)"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// Rotating badge
const RotatingBadge = ({ text, icon }) => {
  return (
    <motion.div
      className="relative w-24 h-24"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          />
        </defs>
        <text fill="white" fontSize="11" fontWeight="bold" letterSpacing="2">
          <textPath href="#circlePath">
            {text} • {text} • {text} • 
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl">
        {icon}
      </div>
    </motion.div>
  );
};

// Hero section with parallax
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section 
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-[var(--dark-gray)] to-[var(--charcoal)]" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(224, 122, 95, 0.3) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(224, 122, 95, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Morphing blob backgrounds */}
      <MorphingBlob color="var(--terracotta)" />
      
      {/* Floating orbs with trails */}
      <FloatingOrb size={30} color="#E07A5F" delay={0} duration={8} />
      <FloatingOrb size={40} color="#5E8B7E" delay={2} duration={12} />
      <FloatingOrb size={25} color="#D4A574" delay={4} duration={10} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <StaggerContainer className="text-white">
            <StaggerItem>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-pulse" />
                <span className="text-sm font-medium">AI-Powered Personal Trainer</span>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
                <span className="block">
                  <TextScramble text="TRAIN" className="text-white" />
                </span>
                <span className="block text-[var(--terracotta)]">
                  <WaveText text="LIKE A PRO" />
                </span>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="text-xl text-white/70 max-w-lg mb-8 leading-relaxed">
                Real-time form correction with computer vision. 
                Your pocket AI coach that never sleeps.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <motion.button
                    className="px-8 py-4 bg-[var(--terracotta)] text-white font-bold rounded-full text-lg tracking-wide hover:bg-[var(--terracotta-light)] transition-colors shadow-lg shadow-[var(--terracotta)]/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Free Trial
                  </motion.button>
                </Link>
              </div>
            </StaggerItem>

          {/* Stats row - Fitness app style */}
            <StaggerItem>
              <div className="flex gap-6 mt-12 pt-8 border-t border-white/10 items-center">
                <ActivityRing percentage={85} color="#E07A5F" />
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <HeartbeatPulse />
                  <CalorieCounter calories={284} />
                  <WorkoutTimer />
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right visual - Live workout preview */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Gradient border workout card */}
            <GradientBorder>
              <motion.div 
                className="relative z-10 mx-auto w-80 bg-[var(--charcoal)] rounded-[2rem] shadow-2xl overflow-hidden p-5"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Live Workout Header */}
                <div className="flex items-center justify-between mb-4">
                  <FitBotBrand size={28} textClassName="text-white text-sm" />
                  <LiveIndicator />
                </div>
                
                {/* Workout Stats Grid */}
                <div className="bg-white/5 rounded-2xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                      <RepCounter reps={12} />
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                      <CalorieCounter calories={156} />
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-white/60 text-xs mb-2">
                    <span>Workout Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[var(--terracotta)] to-[var(--success)]"
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                </div>

                {/* Heart Rate Graph */}
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <HeartbeatPulse />
                  <svg className="flex-1 h-8" viewBox="0 0 100 30">
                    <motion.path
                      d="M0 15 L10 15 L15 5 L20 25 L25 15 L35 15 L40 10 L45 20 L50 15 L60 15 L65 8 L70 22 L75 15 L85 15 L90 12 L95 18 L100 15"
                      fill="none"
                      stroke="#E07A5F"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </svg>
                </div>
              </motion.div>
            </GradientBorder>

            {/* Floating form correction notification */}
            <motion.div 
              className="absolute -top-5 -left-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 shadow-lg z-20"
              animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 text-white">
                <motion.span 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-lg"
                >
                  ✓
                </motion.span>
                <span className="text-sm font-bold">Perfect Form!</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div 
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

// FeaturedWorkouts section removed - app only has deadlift detection and chat
const FeaturedWorkouts = () => null;

// Features grid - Honest features that are actually implemented
const FeaturesGrid = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Form Correction',
      description: 'Real-time AI analysis detects your deadlift form'
    },
    {
      icon: '🤖',
      title: 'AI Coach',
      description: 'Virtual trainer available 24/7 to answer questions and provide personalized fitness guidance'
    },
    {
      icon: '💬',
      title: 'Expert Chat',
      description: 'Get instant answers about workouts, nutrition, or any fitness questions from our AI assistant'
    },
    {
      icon: '📱',
      title: 'Anywhere Access',
      description: 'Use your device camera to train at home, gym, or anywhere - no special equipment needed'
    }
  ];

  return (
    <SpotlightContainer className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-caption text-[var(--terracotta)]">WHY FITBOT</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--charcoal)] mt-4">
            Train Like a Pro
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="card p-8 group cursor-pointer relative overflow-hidden border-2 border-transparent hover:border-[var(--terracotta)]/30 transition-colors"
              initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.15, 
                type: "spring", 
                stiffness: 120,
                damping: 15,
                mass: 1
              }}
              whileHover={{ 
                y: -16, 
                scale: 1.03,
                rotateY: 5,
                boxShadow: '0 40px 80px -20px rgba(224, 122, 95, 0.3)',
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              style={{ perspective: 1000 }}
            >
              {/* Shimmer border effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-[var(--radius-lg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(224,122,95,0.2), transparent)',
                  backgroundSize: '200% 100%'
                }}
                animate={{
                  backgroundPosition: ['200% 0%', '-200% 0%']
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Floating particles inside card */}
              <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-lg)]">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[var(--terracotta)]/20"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + i * 20}%`
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>
              
              {/* Icon with enhanced animation */}
              <motion.div 
                className="text-4xl mb-4 inline-block relative z-10"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.3, 
                  rotate: [0, -15, 15, 0],
                  transition: { duration: 0.4 }
                }}
              >
                {feature.icon}
                {/* Glow effect behind icon */}
                <motion.div
                  className="absolute inset-0 bg-[var(--terracotta)] rounded-full blur-xl -z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 0.3, scale: 2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              {/* Title with slide in */}
              <motion.h3 
                className="text-xl font-bold text-[var(--charcoal)] mb-3 relative z-10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 100 }}
              >
                {feature.title}
              </motion.h3>
              
              {/* Description with fade */}
              <motion.p 
                className="text-[var(--warm-gray)] leading-relaxed relative z-10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.4 }}
              >
                {feature.description}
              </motion.p>
              
              {/* Corner accent */}
              <motion.div
                className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[var(--terracotta)]/10 to-transparent rounded-tl-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </SpotlightContainer>
  );
};

// Social proof section - Removed until real testimonials are available
const SocialProof = () => null;

// CTA Section
const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-light)] relative overflow-hidden">
      {/* Animated circles */}
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/10"
        animate={{ x: [-100, 0, -100], y: [-100, 50, -100] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/10"
        animate={{ x: [100, -50, 100], y: [100, -50, 100] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h2 
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to Transform?
        </motion.h2>
        <motion.p 
          className="text-white/80 text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Start your fitness journey with AI-powered coaching today
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/auth">
            <motion.button
              className="px-12 py-5 bg-white text-[var(--terracotta)] font-bold rounded-full text-xl shadow-2xl"
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </Link>
        </motion.div>
        <motion.p 
          className="text-white/60 text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Sign up for free • No credit card required
        </motion.p>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[var(--charcoal)] py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <FitBotBrand size={40} showText={true} textClassName="text-white text-xl" iconClassName="text-[var(--terracotta)]" />
          <p className="text-white/50 text-sm mt-4 md:mt-0">
            © 2024 FitBot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Landing Page
const LandingPage = () => {
  return (
    <PageTransition>
      <div className="overflow-hidden">
        <FloatingParticles count={20} color="rgba(224, 122, 95, 0.3)" />
        
        <HeroSection />
        <FeaturesGrid />
        <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default LandingPage;
