'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface DeviceInfo {
  name: string;
  icon: string;
  dataCollected: string[];
  whyItMatters: string;
  protection: string[];
}

const DEVICES: DeviceInfo[] = [
  {
    name: 'SMARTPHONE',
    icon: '📱',
    dataCollected: ['Location (GPS)', 'Contacts & Calls', 'Photos & Camera', 'App Activity', 'Device Identifiers', 'Browsing History'],
    whyItMatters: 'Your phone builds a detailed profile of your daily life, movements, and relationships.',
    protection: ['Review app permissions regularly', 'Disable location for non-essential apps', 'Use a privacy-focused browser', 'Limit ad tracking'],
  },
  {
    name: 'SMARTWATCH',
    icon: '⌚',
    dataCollected: ['Heart Rate & Health', 'Sleep Patterns', 'Location Tracking', 'Exercise Data', 'Notifications'],
    whyItMatters: 'Health and biometric data is highly sensitive and often shared with third parties.',
    protection: ['Review health data sharing settings', 'Limit notification access', 'Disable always-on tracking'],
  },
  {
    name: 'SOCIAL MEDIA',
    icon: '💬',
    dataCollected: ['Posts & Messages', 'Friend Network', 'Interests & Likes', 'Location Tags', 'Facial Recognition', 'Behavioral Patterns'],
    whyItMatters: 'Social platforms profile your behavior to serve targeted ads and can expose personal info.',
    protection: ['Use privacy settings', 'Limit post visibility', 'Review connected apps', 'Avoid oversharing location'],
  },
  {
    name: 'CAMERA',
    icon: '📷',
    dataCollected: ['Photo Metadata (EXIF)', 'Location of Photos', 'Facial Data', 'Timestamps', 'Device Information'],
    whyItMatters: 'Photos contain hidden metadata that can reveal where and when they were taken.',
    protection: ['Strip EXIF data before sharing', 'Disable geotagging', 'Be cautious with cloud sync'],
  },
  {
    name: 'LOCATION SERVICES',
    icon: '📍',
    dataCollected: ['Real-time Position', 'Movement Patterns', 'Visited Places', 'Travel Routes', 'Time at Locations'],
    whyItMatters: 'Location history reveals where you live, work, who you visit, and your daily routine.',
    protection: ['Use location only when needed', 'Disable background location', 'Clear location history', 'Use VPN'],
  },
];

export default function DigitalLifeCentre() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation } = useCyberStore();
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [exploredDevices, setExploredDevices] = useState<number[]>([]);

  const handleDeviceClick = (index: number) => {
    setSelectedDevice(index);
    if (!exploredDevices.includes(index)) {
      setExploredDevices([...exploredDevices, index]);
    }
  };

  const handleComplete = () => {
    learnConcept('Digital Privacy');
    learnConcept('Data Collection');
    learnConcept('Privacy Protection');
    completeSimulation('digital-life-privacy');
    completeLocation('digital-life-centre');
    setActiveLocation(null);
  };

  const allExplored = exploredDevices.length === DEVICES.length;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0a0d20 0%, #060912 100%)' }} />

      {/* Data particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-pink-400/30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{
              y: [-20, -200],
              opacity: [0, 0.6, 0],
            }}
            transition={{ duration: 4 + Math.random() * 3, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-3xl">
        <HolographicPanel
          title="DIGITAL LIFE CENTRE"
          subtitle="Privacy & Data Protection"
          onClose={() => setActiveLocation(null)}
          size="full"
        >
          <AnimatePresence mode="wait">
            {selectedDevice === null ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs text-white/50 mb-4">
                  Every device collects data about you. Click each to discover what they know.
                </p>

                <div className="grid grid-cols-5 gap-3 mb-6">
                  {DEVICES.map((device, i) => (
                    <motion.button
                      key={device.name}
                      whileHover={{ scale: 1.05, y: -5 }}
                      onClick={() => handleDeviceClick(i)}
                      className={`p-4 border rounded text-center transition-all ${
                        exploredDevices.includes(i) ? 'border-pink-400/30 bg-pink-400/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-2xl">{device.icon}</span>
                      <p className="text-[8px] tracking-[1px] text-white/50 mt-2">{device.name}</p>
                      {exploredDevices.includes(i) && (
                        <p className="text-[8px] text-green-400 mt-1">✓</p>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white/30">{exploredDevices.length}/{DEVICES.length} devices explored</p>
                  {allExplored && (
                    <CyberButton onClick={handleComplete} size="sm">Complete</CyberButton>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setSelectedDevice(null)} className="text-[10px] text-white/40 hover:text-white/60 mb-4">
                  ← Back to devices
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{DEVICES[selectedDevice].icon}</span>
                  <div>
                    <p className="text-sm font-bold tracking-[2px]" style={{ color: '#ec4899' }}>
                      {DEVICES[selectedDevice].name}
                    </p>
                  </div>
                </div>

                {/* Data collected */}
                <div className="mb-5">
                  <p className="text-[10px] tracking-[2px] text-white/40 mb-2">DATA COLLECTED</p>
                  <div className="grid grid-cols-2 gap-1">
                    {DEVICES[selectedDevice].dataCollected.map((data, i) => (
                      <motion.div
                        key={data}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 py-1"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400/60" />
                        <span className="text-xs text-white/60">{data}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Why it matters */}
                <div className="mb-5 p-3 border border-yellow-400/20 rounded bg-yellow-400/5">
                  <p className="text-[10px] tracking-[2px] text-yellow-400 mb-1">WHY IT MATTERS</p>
                  <p className="text-xs text-white/60">{DEVICES[selectedDevice].whyItMatters}</p>
                </div>

                {/* Protection */}
                <div>
                  <p className="text-[10px] tracking-[2px] text-green-400 mb-2">HOW TO PROTECT YOURSELF</p>
                  <div className="space-y-1">
                    {DEVICES[selectedDevice].protection.map((tip, i) => (
                      <motion.div
                        key={tip}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-green-400 text-[10px]">✓</span>
                        <span className="text-xs text-white/50">{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
