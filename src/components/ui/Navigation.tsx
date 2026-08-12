'use client';

import { motion } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';

export default function Navigation() {
  const { screen, setScreen, setActiveLocation, locationsExplored, securityScore } = useCyberStore();

  const handleBack = () => {
    if (screen === 'location') {
      setActiveLocation(null);
    } else if (screen === 'cyber-city') {
      setScreen('world-map');
    } else if (screen === 'world-map') {
      setScreen('landing');
    }
  };

  if (screen === 'landing') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="flex items-center justify-between p-4 md:p-6">
        {/* Left - Logo & Back */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {screen !== 'world-map' && (
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-cyan-400/50 text-white/60 hover:text-cyan-400 transition-all rounded text-sm"
              aria-label="Go back"
            >
              ←
            </button>
          )}
          <div>
            <h1
              className="text-xs font-bold tracking-[4px] uppercase cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: '#00f0ff' }}
              onClick={() => setScreen('landing')}
            >
              CYBERVERSE
            </h1>
            {screen === 'cyber-city' && (
              <p className="text-[10px] text-white/40 tracking-[2px] mt-0.5">CYBER CITY</p>
            )}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {(screen === 'cyber-city' || screen === 'location') && (
            <>
              <button
                onClick={() => setScreen('world-map')}
                className="px-3 py-1.5 text-[10px] tracking-[2px] uppercase text-white/60 hover:text-cyan-400 border border-white/10 hover:border-cyan-400/30 transition-all rounded"
              >
                World Map
              </button>
              <div className="px-3 py-1.5 border border-white/10 rounded">
                <span className="text-[10px] tracking-[1px] text-white/40">SCORE </span>
                <span className="text-[10px] font-bold text-cyan-400">{securityScore}%</span>
              </div>
              <div className="px-3 py-1.5 border border-white/10 rounded">
                <span className="text-[10px] tracking-[1px] text-white/40">EXPLORED </span>
                <span className="text-[10px] font-bold text-purple-400">{locationsExplored.length}/10</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
