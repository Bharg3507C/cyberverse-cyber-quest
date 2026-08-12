'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CyberButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: {
    bg: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(139, 92, 246, 0.15))',
    border: 'rgba(0, 240, 255, 0.5)',
    color: '#00f0ff',
    hoverBg: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(139, 92, 246, 0.3))',
  },
  secondary: {
    bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
    border: 'rgba(139, 92, 246, 0.4)',
    color: '#a78bfa',
    hoverBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.25))',
  },
  danger: {
    bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
    border: 'rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
    hoverBg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.2))',
  },
  ghost: {
    bg: 'transparent',
    border: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff99',
    hoverBg: 'rgba(255, 255, 255, 0.05)',
  },
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function CyberButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: CyberButtonProps) {
  const style = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative overflow-hidden font-semibold tracking-[2px] uppercase cursor-pointer
        ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        borderRadius: '2px',
      }}
    >
      {/* Sweep effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 opacity-0"
          whileHover={{ opacity: 1 }}
          style={{ background: style.hoverBg }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
