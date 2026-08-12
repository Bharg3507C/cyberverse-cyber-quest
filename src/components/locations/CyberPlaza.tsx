'use client';

import { motion } from 'framer-motion';
import { useCyberStore, LOCATIONS } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

export default function CyberPlaza() {
  const { setActiveLocation, locationsExplored, securityScore, locationsCompleted } = useCyberStore();

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #060912 100%)' }} />

      {/* Animated data streams in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px"
            style={{
              left: `${10 + i * 12}%`,
              top: 0,
              height: '100%',
              background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? '#00f0ff' : '#8b5cf6'}22, transparent)`,
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <HolographicPanel title="CYBER PLAZA" subtitle="Central Hub — Cyber City" onClose={() => setActiveLocation(null)} size="full">
          {/* City Status */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border border-cyan-400/10 rounded">
              <p className="text-2xl font-bold" style={{ color: '#00f0ff' }}>{securityScore}%</p>
              <p className="text-[9px] tracking-[2px] text-white/40 mt-1">SECURITY STATUS</p>
            </div>
            <div className="text-center p-4 border border-purple-400/10 rounded">
              <p className="text-2xl font-bold text-purple-400">{locationsExplored.length}/10</p>
              <p className="text-[9px] tracking-[2px] text-white/40 mt-1">EXPLORED</p>
            </div>
            <div className="text-center p-4 border border-green-400/10 rounded">
              <p className="text-2xl font-bold text-green-400">{locationsCompleted.length}/10</p>
              <p className="text-[9px] tracking-[2px] text-white/40 mt-1">COMPLETED</p>
            </div>
          </div>

          {/* Locations Grid */}
          <p className="text-[10px] tracking-[2px] text-white/30 uppercase mb-3">EXPLORE LOCATIONS</p>
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {LOCATIONS.filter(l => l.id !== 'cyber-plaza').map((loc) => (
              <motion.button
                key={loc.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveLocation(loc.id)}
                className="flex items-center gap-3 p-3 border border-white/5 hover:border-white/20 transition-all text-left rounded-sm"
                style={{ background: locationsExplored.includes(loc.id) ? `${loc.color}08` : 'transparent' }}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: loc.color,
                    opacity: locationsExplored.includes(loc.id) ? 1 : 0.3,
                    boxShadow: locationsExplored.includes(loc.id) ? `0 0 8px ${loc.color}` : 'none',
                  }}
                />
                <div>
                  <p className="text-xs font-medium" style={{ color: loc.color }}>{loc.name}</p>
                  <p className="text-[9px] text-white/30">{loc.topic}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">
              Return to City
            </CyberButton>
          </div>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
