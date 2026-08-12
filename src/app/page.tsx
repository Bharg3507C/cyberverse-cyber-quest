'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import { useSound } from '@/lib/audio/useSound';
import { analytics } from '@/lib/analytics/tracker';
import { registerServiceWorker } from '@/lib/pwa/registerSW';
import dynamic from 'next/dynamic';

const Landing = dynamic(() => import('@/components/Landing'), { ssr: false });
const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false });
const CyberCity = dynamic(() => import('@/components/CyberCity'), { ssr: false });
const LocationRouter = dynamic(() => import('@/components/locations/LocationRouter'), { ssr: false });
const Navigation = dynamic(() => import('@/components/ui/Navigation'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), { ssr: false });

export default function Home() {
  const { screen } = useCyberStore();
  const [isLoading, setIsLoading] = useState(true);
  const { transition, startAmbient } = useSound();

  // Init
  useEffect(() => {
    registerServiceWorker();
    analytics.pageView('landing');

    const timer = setTimeout(() => {
      setIsLoading(false);
      startAmbient();
    }, 1500);

    return () => clearTimeout(timer);
  }, [startAmbient]);

  // Track screen changes
  useEffect(() => {
    analytics.pageView(screen);
    transition();
  }, [screen, transition]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060912]">
      <LoadingScreen isLoading={isLoading} label="ENTERING CYBERVERSE" />

      {!isLoading && (
        <>
          <Navigation />

          <AnimatePresence mode="wait">
            {screen === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Landing />
              </motion.div>
            )}

            {screen === 'world-map' && (
              <motion.div
                key="world-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <WorldMap />
              </motion.div>
            )}

            {screen === 'cyber-city' && (
              <motion.div
                key="cyber-city"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <CyberCity />
              </motion.div>
            )}

            {screen === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <LocationRouter />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}
