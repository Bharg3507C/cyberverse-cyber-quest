'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCyberStore } from '@/store/cyberStore';

const CyberScene = dynamic(() => import('@/components/three/CyberScene'), { ssr: false });
const LandingScene = dynamic(() => import('@/components/three/LandingScene'), { ssr: false });

export default function Landing() {
  const { setScreen } = useCyberStore();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Background */}
      <CyberScene camera={{ position: [0, 3, 10], fov: 55 }}>
        <LandingScene />
      </CyberScene>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[8px] md:tracking-[16px]"
            style={{ color: '#00f0ff', textShadow: '0 0 60px rgba(0,240,255,0.4), 0 0 120px rgba(0,240,255,0.2)' }}
          >
            CYBERVERSE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-white/50 text-sm md:text-base tracking-[4px] mt-4 max-w-xl mx-auto leading-relaxed"
          >
            EXPLORE THE DIGITAL WORLD.
            <br />
            UNDERSTAND THE THREATS.
            <br />
            DEFEND THE FUTURE.
          </motion.p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 pointer-events-auto"
        >
          <button
            onClick={() => setScreen('cyber-city')}
            className="btn-cyber text-base px-10 py-4 tracking-[3px]"
            style={{ boxShadow: '0 0 40px rgba(0,240,255,0.2)' }}
          >
            ENTER CYBERVERSE
          </button>
          <button
            onClick={() => setScreen('world-map')}
            className="px-8 py-4 text-sm tracking-[3px] uppercase text-white/50 hover:text-white/80 border border-white/10 hover:border-white/30 transition-all"
          >
            EXPLORE WORLDS
          </button>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 text-[10px] tracking-[3px] text-white/20 uppercase"
        >
          Interactive 3D Cybersecurity Experience
        </motion.p>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,9,18,0.8) 100%)',
        }}
      />
    </div>
  );
}
