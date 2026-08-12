'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCyberStore, WORLDS } from '@/store/cyberStore';

const CyberScene = dynamic(() => import('@/components/three/CyberScene'), { ssr: false });
const WorldMapScene = dynamic(() => import('@/components/three/WorldMapScene'), { ssr: false });

export default function WorldMap() {
  const { setScreen } = useCyberStore();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Scene */}
      <CyberScene camera={{ position: [0, 8, 14], fov: 55 }}>
        <WorldMapScene />
      </CyberScene>

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 text-center"
        >
          <h2 className="text-xs tracking-[4px] text-white/40 uppercase">CYBERVERSE</h2>
          <h1 className="text-lg tracking-[6px] mt-1 font-bold" style={{ color: '#00f0ff' }}>WORLD MAP</h1>
        </motion.div>

        {/* World List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-auto max-h-[70vh] overflow-y-auto"
        >
          <div className="space-y-2">
            {WORLDS.map((world, i) => (
              <motion.button
                key={world.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => {
                  if (world.active) setScreen('cyber-city');
                }}
                className={`block w-56 text-left px-4 py-3 border transition-all rounded-sm ${
                  world.active
                    ? 'border-cyan-400/40 hover:border-cyan-400/70 hover:bg-cyan-400/5 cursor-pointer'
                    : 'border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: world.color, boxShadow: world.active ? `0 0 8px ${world.color}` : 'none' }}
                  />
                  <div>
                    <p className="text-[10px] tracking-[2px] text-white/30">0{i + 1}</p>
                    <p className="text-xs font-semibold tracking-[1px]" style={{ color: world.active ? world.color : 'rgba(255,255,255,0.3)' }}>
                      {world.name}
                    </p>
                    <p className="text-[9px] text-white/30 mt-0.5">{world.topic}</p>
                  </div>
                </div>
                {!world.active && (
                  <p className="text-[8px] tracking-[1px] text-white/20 mt-1 ml-5">COMING SOON</p>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto"
        >
          <button onClick={() => setScreen('cyber-city')} className="btn-cyber px-8 py-3 text-xs tracking-[3px]">
            ENTER CYBER CITY
          </button>
        </motion.div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(6,9,18,0.9) 100%)' }}
      />
    </div>
  );
}
