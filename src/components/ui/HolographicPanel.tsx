'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface HolographicPanelProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'danger' | 'success' | 'warning';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

const variantColors = {
  default: { border: 'rgba(0, 240, 255, 0.3)', glow: 'rgba(0, 240, 255, 0.15)' },
  danger: { border: 'rgba(239, 68, 68, 0.4)', glow: 'rgba(239, 68, 68, 0.15)' },
  success: { border: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.15)' },
  warning: { border: 'rgba(245, 158, 11, 0.4)', glow: 'rgba(245, 158, 11, 0.15)' },
};

export default function HolographicPanel({
  children,
  title,
  subtitle,
  isOpen = true,
  onClose,
  className = '',
  size = 'lg',
  variant = 'default',
}: HolographicPanelProps) {
  const colors = variantColors[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${sizeClasses[size]} ${className}`}
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.95), rgba(6, 9, 18, 0.92))',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 40px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
            borderRadius: '4px',
          }}
        >
          {/* Scan line effect */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded"
            style={{ opacity: 0.03 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)',
              }}
            />
          </div>

          {/* Header */}
          {(title || onClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                {title && (
                  <h2
                    className="text-sm font-bold tracking-[3px] uppercase"
                    style={{ color: variant === 'danger' ? '#ef4444' : '#00f0ff' }}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-white/50 mt-1 tracking-wide">{subtitle}</p>
                )}
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors border border-white/10 hover:border-white/30 rounded"
                  aria-label="Close panel"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="relative p-6">{children}</div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l rounded-tl" style={{ borderColor: colors.border }} />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r rounded-tr" style={{ borderColor: colors.border }} />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l rounded-bl" style={{ borderColor: colors.border }} />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r rounded-br" style={{ borderColor: colors.border }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
