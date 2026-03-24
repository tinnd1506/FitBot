import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';
import { detectDeadlift, resetDeadlift } from '../../api';

// Pulse ring animation for active state
const PulseRing = ({ isActive }) => (
  <AnimatePresence>
    {isActive && (
      <>
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-[var(--terracotta)]"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.1, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(224, 122, 95, 0.15) 0%, rgba(224, 122, 95, 0.05) 40%, transparent 70%)'
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 0.6, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    )}
  </AnimatePresence>
);

// Animated rep counter ring
const RepCounterRing = ({ reps, target = 12 }) => {
  const percentage = Math.min((reps / target) * 100, 100);
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="var(--light-gray)"
          strokeWidth="6"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="var(--terracotta)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ filter: 'drop-shadow(0 0 4px var(--terracotta))' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={reps}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xl font-bold text-[var(--charcoal)]"
        >
          {reps}
        </motion.span>
      </div>
    </div>
  );
};

// Stage indicator with animation
const StageIndicator = ({ stage }) => {
  const stages = ['Ready', 'down', 'up'];
  const currentIndex = stages.indexOf(stage) || 0;
  
  return (
    <div className="flex items-center gap-2">
      {stages.map((s, i) => (
        <motion.div
          key={s}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-sm ${
            i === currentIndex 
              ? 'bg-[var(--terracotta)] text-white shadow-md' 
              : i < currentIndex 
                ? 'bg-[var(--terracotta)]/30 text-[var(--terracotta)]' 
                : 'bg-gray-200 text-gray-500'
          }`}
          animate={i === currentIndex ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          {s === 'down' ? 'Lowering' : s === 'up' ? 'Lifting' : s}
        </motion.div>
      ))}
    </div>
  );
};

// Form quality meter
const FormQualityMeter = ({ quality = 'Good' }) => {
  const qualities = ['Poor', 'Fair', 'Good', 'Excellent'];
  const index = qualities.indexOf(quality);
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {qualities.map((q, i) => (
          <motion.div
            key={q}
            className={`w-2 h-6 rounded-full ${
              i <= index 
                ? i === 3 ? 'bg-green-500' : i === 2 ? 'bg-[var(--terracotta)]' : 'bg-yellow-500'
                : 'bg-[var(--light-gray)]'
            }`}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      <span className={`text-sm font-semibold ${
        quality === 'Excellent' ? 'text-green-500' : 
        quality === 'Good' ? 'text-[var(--terracotta)]' : 'text-yellow-500'
      }`}>
        {quality}
      </span>
    </div>
  );
};

// Live indicator with pulsing effect
const LiveIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <motion.div
        className="w-2.5 h-2.5 rounded-full bg-[var(--error)]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--error)]"
        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
    <span className="text-xs font-semibold text-[var(--error)] tracking-wider">LIVE</span>
  </div>
);

// Deadlift form checklist (static)
const FormChecklist = () => {
  const items = [
    { icon: '👣', text: 'Feet hip-width apart' },
    { icon: '✋', text: 'Bar over mid-foot' },
    { icon: '🦶', text: 'Drive through heels' },
    { icon: '🫁', text: 'Chest up, back straight' },
    { icon: '🍑', text: 'Hips through at top' }
  ];

  return (
    <div className="bg-gradient-to-br from-[var(--charcoal)] to-[var(--dark-gray)] rounded-xl p-4 text-white">
      <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-[var(--terracotta)]">✓</span> Form Checklist
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 text-sm"
          >
            <span className="w-6 h-6 rounded-full bg-[var(--terracotta)]/20 flex items-center justify-center text-xs">
              {item.icon}
            </span>
            <span className="text-white/90">{item.text}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

// Floating particles animation
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-[var(--terracotta)] rounded-full opacity-30"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [-20, -100],
          x: [0, Math.random() * 40 - 20],
          opacity: [0.3, 0],
          scale: [1, 0.5],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

const DeadliftApp = ({ onEndSession }) => {
  const [stage, setStage] = useState('0');
  const [reps, setReps] = useState(0);
  const [error, setError] = useState(null);
  const [poseNetModel, setPoseNetModel] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const resetSessionState = useCallback(async () => {
    try {
      await resetDeadlift();
    } catch (error) {
      console.error('Error resetting:', error);
    } finally {
      setReps(0);
      setStage('0');
      setIsDetecting(false);
      setElapsedTime(0);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Load PoseNet model
  useEffect(() => {
    const loadPoseNet = async () => {
      try {
        const model = await posenet.load();
        setPoseNetModel(model);
      } catch (err) {
        console.error('Error loading PoseNet model: ', err);
        setError('Error loading PoseNet model');
      }
    };
    loadPoseNet();
  }, []);

  // Set up video stream
  useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsVideoReady(true);
          };
        }
      } catch (err) {
        console.error('Error accessing webcam: ', err);
        setError('Error accessing webcam');
      }
    };
    getVideoStream();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      resetSessionState();
    };
  }, []);

  const sendFrame = useCallback(async (frame) => {
    try {
      const { stage: newStage, reps: newReps } = await detectDeadlift(frame);
      setStage(newStage);
      setReps(newReps);
      setIsDetecting(true);
    } catch (err) {
      console.error('Error detecting deadlift: ', err.message);
      setError('Error detecting deadlift');
    }
  }, []);

  const drawLine = useCallback((ctx, start, end) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#00ff00';
    ctx.lineCap = 'round';
    ctx.stroke();
  }, []);

  const drawPose = useCallback((pose) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!canvas || !ctx || !videoRef.current) return;

    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (pose) {
      // Filter keypoints with high confidence
      const keypoints = pose.keypoints.filter((kp) => kp.score > 0.5);

      // Draw keypoints
      keypoints.forEach(({ position }) => {
        ctx.beginPath();
        ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });

      // Draw skeleton
      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
      adjacentKeyPoints.forEach((keypoint) => {
        ctx.beginPath();
        ctx.moveTo(keypoint[0].position.x, keypoint[0].position.y);
        ctx.lineTo(keypoint[1].position.x, keypoint[1].position.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'green';
        ctx.stroke();
      });
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (videoRef.current && isVideoReady) {
      const video = videoRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => sendFrame(blob), 'image/jpeg');
    }
  }, [isVideoReady, sendFrame]);

  const detectPose = useCallback(async () => {
    if (poseNetModel && videoRef.current && isVideoReady) {
      try {
        const video = videoRef.current;
        const pose = await poseNetModel.estimateSinglePose(video, {
          flipHorizontal: false,
        });
        drawPose(pose);
      } catch (err) {
        console.error('Error detecting pose: ', err);
      }
    }
  }, [poseNetModel, isVideoReady, drawPose]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isVideoReady) {
        captureFrame();
        detectPose();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [captureFrame, detectPose, isVideoReady]);

  const handleReset = async () => {
    try {
      const data = await resetDeadlift();
      setReps(data.reps);
      setStage('0');
      setIsDetecting(false);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  const handleEndSession = async () => {
    await resetSessionState();
    onEndSession();
  };

  const isActive = stage === 'down' || stage === 'up';

  return (
    <div className="h-screen flex flex-col bg-gray-50/50 overflow-hidden">
      {/* Header - enhanced visibility */}
      <motion.header 
        className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200 shadow-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--terracotta)] to-[var(--terracotta-light)] flex items-center justify-center shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-xl relative z-10">🏋️</span>
          </motion.div>
          <div className="flex flex-col gap-1.5">
            <motion.h1 
              className="font-bold text-[var(--charcoal)] text-lg"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Deadlift Form Trainer
            </motion.h1>
            <StageIndicator stage={stage} />
          </div>
        </div>
        <LiveIndicator />
      </motion.header>

      {/* Main content area */}
      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left: Video section */}
        <section className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Video wrapper with proper aspect ratio */}
          <div className="rounded-xl overflow-hidden shadow-2xl relative py-6" style={{ 
            height: 'fit-content',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%)'
          }}>
            <PulseRing isActive={isActive} />
            
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Animated orbs */}
              <motion.div
                className="absolute w-96 h-96 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(224, 122, 95, 0.4) 0%, rgba(224, 122, 95, 0.1) 50%, transparent 70%)',
                  top: '-10%',
                  left: '-10%',
                }}
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute w-80 h-80 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(250, 249, 246, 0.15) 0%, rgba(250, 249, 246, 0.05) 50%, transparent 70%)',
                  bottom: '-5%',
                  right: '-5%',
                }}
                animate={{
                  x: [0, -80, 0],
                  y: [0, -60, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />
              <motion.div
                className="absolute w-72 h-72 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(224, 122, 95, 0.25) 0%, rgba(224, 122, 95, 0.08) 50%, transparent 70%)',
                  top: '50%',
                  right: '10%',
                }}
                animate={{
                  x: [0, -50, 0],
                  y: [0, 40, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2,
                }}
              />
              
              {/* Animated grid pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(224, 122, 95, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(224, 122, 95, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '50px 50px'],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Radial gradient overlay for depth */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
              }} />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(110deg, transparent 30%, rgba(250, 249, 246, 0.1) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['-200% 0%', '200% 0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
            
            <div className="relative mx-auto" style={{ width: '560px', height: '420px' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                width="640" 
                height="480"
                className="absolute inset-0 rounded-lg object-cover"
                style={{ width: '100%', height: '100%' }}
              />
              <canvas 
                ref={canvasRef} 
                width="640" 
                height="480"
                className="absolute inset-0 z-10 pointer-events-none rounded-lg"
                style={{ width: '100%', height: '100%' }}
              />
              
              {/* Overlay: Time top-left */}
              <div className="absolute top-2.5 left-2.5 z-20">
                <motion.div
                  className="bg-black/70 backdrop-blur-sm rounded-md px-2.5 py-1.5 text-white border border-white/10 relative overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(224, 122, 95, 0.5)' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--terracotta)]/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="text-[10px] text-white/60 uppercase tracking-wider relative z-10">Time</span>
                  <p className="font-mono font-bold text-sm leading-tight relative z-10">{formatTime(elapsedTime)}</p>
                </motion.div>
              </div>

              {/* Overlay: Reps bottom-right */}
              <div className="absolute bottom-2.5 right-2.5 z-20">
                <motion.div
                  className="bg-black/80 backdrop-blur-md rounded-xl p-2.5 border border-white/20 shadow-lg relative overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(224, 122, 95, 0.4)' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--terracotta)]/20 to-transparent"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="flex flex-col items-center gap-1 relative z-10">
                    <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Reps</p>
                    <motion.p 
                      key={reps}
                      initial={{ scale: 1.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-3xl font-bold text-white leading-none"
                      style={{ textShadow: '0 0 10px rgba(224, 122, 95, 0.5)' }}
                    >
                      {reps}
                    </motion.p>
                    <div className="w-full bg-white/20 rounded-full h-1 mt-1 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] h-1 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((reps / 10) * 100, 100)}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        style={{ boxShadow: '0 0 8px var(--terracotta)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Stage indicator */}
              <AnimatePresence mode="wait">
                {stage === 'down' && (
                  <motion.div
                    className="absolute top-2.5 right-2.5 bg-[var(--terracotta)] text-white px-2.5 py-1 rounded-full text-xs font-bold z-20 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    Lowering ↓
                  </motion.div>
                )}
                {stage === 'up' && (
                  <motion.div
                    className="absolute top-2.5 right-2.5 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold z-20 shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    Lifting ↑
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="flex gap-3 shrink-0">
            <motion.button
              onClick={handleReset}
              className="flex-1 py-2.5 bg-white border border-gray-200 text-[var(--charcoal)] font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--terracotta)]/0 via-[var(--terracotta)]/10 to-[var(--terracotta)]/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <motion.svg 
                className="w-4 h-4 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </motion.svg>
              <span className="relative z-10">Reset</span>
            </motion.button>
            
            <motion.button
              onClick={handleEndSession}
              className="flex-1 py-2.5 bg-[var(--charcoal)] text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-md relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 bg-[var(--terracotta)]"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="relative z-10">End Session</span>
            </motion.button>
          </div>
        </section>

        {/* Right: Stats sidebar */}
        <aside className="w-64 flex flex-col gap-2.5 shrink-0 overflow-y-auto">
          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-2">
            <motion.div 
              className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 text-center"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.p 
                className="text-xl font-bold text-[var(--terracotta)]"
                key={reps}
                animate={{ scale: [1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {reps}
              </motion.p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Reps</p>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 text-center"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-base font-bold text-[var(--charcoal)] font-mono">{formatTime(elapsedTime)}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Time</p>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 text-center"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <motion.p 
                className={`text-base font-bold ${reps > 0 ? 'text-green-500' : 'text-amber-500'}`}
                animate={{ rotate: reps > 0 ? [0, 360] : 0 }}
                transition={{ duration: 0.5 }}
              >
                {reps > 0 ? '✓' : '○'}
              </motion.p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{reps > 0 ? 'Good' : 'Ready'}</p>
            </motion.div>
          </div>

          {/* Form checklist card */}
          <motion.div 
            className="bg-gradient-to-br from-[var(--charcoal)] to-[var(--dark-gray)] rounded-lg p-3.5 text-white shadow-xl border border-white/10"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-bold text-sm mb-2.5 flex items-center gap-2">
              <span className="text-[var(--terracotta)] text-base">✓</span> 
              <span className="text-white">Form Checklist</span>
            </h3>
            <ul className="space-y-2">
              {[
                { icon: '👣', text: 'Feet hip-width apart' },
                { icon: '✋', text: 'Bar over mid-foot' },
                { icon: '🦶', text: 'Drive through heels' },
                { icon: '🫁', text: 'Chest up, back straight' },
                { icon: '🍑', text: 'Hips through at top' }
              ].map((item, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-center gap-2 text-xs group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.span 
                    className="w-7 h-7 rounded-full bg-[var(--terracotta)]/20 border border-[var(--terracotta)]/30 flex items-center justify-center text-sm shrink-0"
                    whileHover={{ scale: 1.2, rotate: 360, backgroundColor: 'rgba(224, 122, 95, 0.3)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-white font-medium group-hover:text-[var(--terracotta-light)] transition-colors">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Avoid section */}
          <motion.div 
            className="bg-white rounded-lg p-3.5 shadow-md border border-red-100"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-bold text-sm mb-2.5 flex items-center gap-2 text-red-500">
              <span className="text-base">⚠️</span> 
              <span>Avoid These</span>
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              {[
                'Rounding lower back',
                'Bar drifting forward',
                'Hyper-extending at lockout'
              ].map((text, i) => (
                <motion.li 
                  key={i}
                  className="flex items-start gap-2 group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                >
                  <motion.span 
                    className="text-red-500 font-bold text-base mt-0.5 shrink-0"
                    whileHover={{ scale: 1.3, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    ×
                  </motion.span>
                  <span className="font-medium group-hover:text-red-600 transition-colors">{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Target info */}
          <motion.div
            className="bg-gradient-to-br from-[var(--terracotta)]/10 to-[var(--terracotta)]/5 rounded-lg p-3.5 border border-[var(--terracotta)]/30 shadow-sm"
            whileHover={{ scale: 1.02, borderColor: 'var(--terracotta)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[var(--charcoal)]">Target</span>
              <span className="text-sm font-bold text-[var(--terracotta)]">10 reps</span>
            </div>
            <div className="w-full bg-white/70 rounded-full h-2 shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-light)] h-2 rounded-full transition-all duration-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((reps / 10) * 100, 100)}%` }}
                style={{ width: `${Math.min((reps / 10) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">0</span>
              <span className="text-[10px] font-semibold text-[var(--terracotta)]">{reps}/10</span>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm px-4 py-3 shadow-lg flex items-center gap-2 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span>⚠️</span>
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-400 hover:text-red-600 font-bold"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeadliftApp;