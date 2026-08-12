'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  label?: string;
}

export default function LoadingScreen({ isLoading, label = 'INITIALIZING' }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) { setProgress(100); return; }
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#060912' }}
        >
          {/* Animated logo */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8"
          >
            <h1
              className="text-2xl font-bold tracking-[8px]"
              style={{ color: '#00f0ff', textShadow: '0 0 30px rgba(0,240,255,0.4)' }}
            >
              CYBERVERSE
            </h1>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Label */}
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[9px] tracking-[3px] text-white/30 uppercase"
          >
            {label}
          </motion.p>

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.2), transparent)' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Skeleton placeholder for panels
export function PanelSkeleton() {
  return (
    <div className="w-full max-w-lg p-6 rounded" style={{ background: 'rgba(10,14,26,0.9)', border: '1px solid rgba(0,240,255,0.1)' }}>
      <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="h-3 w-32 bg-white/5 rounded mb-4" />
        <div className="h-2 w-full bg-white/5 rounded mb-2" />
        <div className="h-2 w-3/4 bg-white/5 rounded mb-2" />
        <div className="h-2 w-1/2 bg-white/5 rounded mb-6" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-white/5 rounded" />
          <div className="h-20 bg-white/5 rounded" />
        </div>
      </motion.div>
    </div>
  );
}
