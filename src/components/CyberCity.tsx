'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useCyberStore, LOCATIONS, LocationId } from '@/store/cyberStore';

const CyberScene = dynamic(() => import('@/components/three/CyberScene'), { ssr: false });
const CyberCityScene = dynamic(() => import('@/components/three/CyberCityScene'), { ssr: false });

export default function CyberCity() {
  const { setActiveLocation, exploreLocation, locationsExplored } = useCyberStore();
  const [hoveredLocation, setHoveredLocation] = useState<LocationId | null>(null);

  const handleLocationClick = (locationId: LocationId) => {
    exploreLocation(locationId);
    setActiveLocation(locationId);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D City */}
      <CyberScene camera={{ position: [0, 8, 14], fov: 50 }}>
        <CyberCityScene
          onLocationClick={handleLocationClick}
          onLocationHover={setHoveredLocation}
          hoveredLocation={hoveredLocation}
        />
      </CyberScene>

      {/* Location tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="panel-holographic px-6 py-3 text-center">
              <p className="text-xs font-bold tracking-[2px]" style={{ color: LOCATIONS.find(l => l.id === hoveredLocation)?.color }}>
                {LOCATIONS.find(l => l.id === hoveredLocation)?.name}
              </p>
              <p className="text-[10px] text-white/50 mt-1">
                {LOCATIONS.find(l => l.id === hoveredLocation)?.topic}
              </p>
              <p className="text-[9px] text-cyan-400/60 mt-1 tracking-[1px]">CLICK TO EXPLORE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom location nav */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-1 px-3 py-2 rounded-sm" style={{ background: 'rgba(6,9,18,0.85)', border: '1px solid rgba(0,240,255,0.1)' }}>
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleLocationClick(loc.id)}
              onMouseEnter={() => setHoveredLocation(loc.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              className="w-7 h-7 flex items-center justify-center rounded-sm transition-all hover:scale-110"
              style={{
                border: `1px solid ${locationsExplored.includes(loc.id) ? loc.color + '60' : 'rgba(255,255,255,0.1)'}`,
                background: locationsExplored.includes(loc.id) ? loc.color + '15' : 'transparent',
              }}
              title={loc.name}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: loc.color,
                  opacity: locationsExplored.includes(loc.id) ? 1 : 0.3,
                  boxShadow: locationsExplored.includes(loc.id) ? `0 0 6px ${loc.color}` : 'none',
                }}
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* City status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-20 left-6 z-10"
      >
        <p className="text-[10px] tracking-[2px] text-white/30 uppercase">LOCATIONS</p>
        <p className="text-lg font-bold" style={{ color: '#00f0ff' }}>
          {locationsExplored.length} / 10
        </p>
        <p className="text-[9px] text-white/20 tracking-[1px] mt-1">CLICK BUILDINGS TO EXPLORE</p>
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(6,9,18,0.7) 100%)' }}
      />
    </div>
  );
}
