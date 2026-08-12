'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

const NETWORK_NODES = [
  { id: 'phone', label: 'PHONE', emoji: '📱' },
  { id: 'router', label: 'ROUTER', emoji: '📡' },
  { id: 'isp', label: 'ISP', emoji: '🏢' },
  { id: 'dns', label: 'DNS', emoji: '📋' },
  { id: 'server', label: 'SERVER', emoji: '🖥️' },
];

interface ConceptInfo {
  title: string;
  description: string;
  visual: string;
  details: string[];
}

const CONCEPTS: Record<string, ConceptInfo> = {
  'IP Address': {
    title: 'IP ADDRESS',
    description: 'A unique address for every device on a network.',
    visual: '192.168.1.1 → 203.0.113.5',
    details: ['Like a postal address for devices', 'IPv4: 4 groups of numbers (0-255)', 'Public IP: visible on internet', 'Private IP: local network only'],
  },
  'DNS': {
    title: 'DNS — Domain Name System',
    description: 'Translates human-readable names to IP addresses.',
    visual: 'google.com → 142.250.80.46',
    details: ['The phonebook of the internet', 'Converts domains to IP addresses', 'Hierarchical system', 'Can be targeted by attackers'],
  },
  'TCP': {
    title: 'TCP — Transmission Control Protocol',
    description: 'Reliable delivery — ensures data arrives complete and in order.',
    visual: 'SYN → SYN-ACK → ACK',
    details: ['Connection-oriented protocol', 'Three-way handshake', 'Guarantees delivery order', 'Used for web, email, files'],
  },
  'UDP': {
    title: 'UDP — User Datagram Protocol',
    description: 'Fast delivery — no guarantees, just speed.',
    visual: 'SEND → SEND → SEND (no confirmation)',
    details: ['Connectionless protocol', 'No delivery guarantee', 'Fast, low overhead', 'Used for video, gaming, DNS'],
  },
  'HTTP': {
    title: 'HTTP — HyperText Transfer Protocol',
    description: 'How browsers talk to servers — unencrypted.',
    visual: 'BROWSER ←→ [PLAIN TEXT] ←→ SERVER',
    details: ['Foundation of web communication', 'Data sent in plain text', 'Can be intercepted', 'Port 80 by default'],
  },
  'HTTPS': {
    title: 'HTTPS — HTTP Secure',
    description: 'Encrypted version of HTTP. Data cannot be read in transit.',
    visual: 'BROWSER ←→ [🔒 ENCRYPTED] ←→ SERVER',
    details: ['Uses TLS/SSL encryption', 'Data encrypted in transit', 'Verified with certificates', 'Look for 🔒 in browser'],
  },
  'Firewall': {
    title: 'FIREWALL',
    description: 'A barrier that filters network traffic based on rules.',
    visual: 'TRAFFIC → [FIREWALL: ALLOW/BLOCK] → NETWORK',
    details: ['Monitors incoming/outgoing traffic', 'Rule-based filtering', 'Can be hardware or software', 'First line of defense'],
  },
};

export default function NetworkTower() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, unlockAchievement } = useCyberStore();
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [exploredConcepts, setExploredConcepts] = useState<string[]>([]);
  const [animatingPacket, setAnimatingPacket] = useState(false);

  const handleConceptClick = (concept: string) => {
    setSelectedConcept(concept);
    if (!exploredConcepts.includes(concept)) {
      setExploredConcepts([...exploredConcepts, concept]);
    }
  };

  const handleAnimate = () => {
    setAnimatingPacket(true);
    setTimeout(() => setAnimatingPacket(false), 3000);
  };

  const handleComplete = () => {
    learnConcept('Networking Basics');
    learnConcept('TCP/IP');
    learnConcept('DNS');
    completeSimulation('network-visualization');
    completeLocation('network-tower');
    unlockAchievement('network-navigator');
    setActiveLocation(null);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #041520 0%, #060912 100%)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-3xl">
        <HolographicPanel
          title="NETWORK TOWER"
          subtitle="Networking Fundamentals"
          onClose={() => setActiveLocation(null)}
          size="full"
        >
          <AnimatePresence mode="wait">
            {selectedConcept === null ? (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Network path visualization */}
                <div className="flex items-center justify-center gap-2 mb-6 py-4">
                  {NETWORK_NODES.map((node, i) => (
                    <div key={node.id} className="flex items-center gap-2">
                      <motion.div
                        className="text-center"
                        animate={animatingPacket ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ delay: i * 0.5, duration: 0.5 }}
                      >
                        <div className="w-12 h-12 flex items-center justify-center border border-cyan-400/30 rounded bg-cyan-400/5">
                          <span className="text-lg">{node.emoji}</span>
                        </div>
                        <p className="text-[8px] tracking-[1px] text-white/40 mt-1">{node.label}</p>
                      </motion.div>
                      {i < NETWORK_NODES.length - 1 && (
                        <div className="relative w-8">
                          <div className="w-full h-px bg-cyan-400/20" />
                          {animatingPacket && (
                            <motion.div
                              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400"
                              style={{ boxShadow: '0 0 8px #00f0ff' }}
                              animate={{ left: ['0%', '100%'] }}
                              transition={{ delay: i * 0.5, duration: 0.5 }}
                            />
                          )}
                          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-white/20 text-[10px]">↓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center mb-5">
                  <CyberButton onClick={handleAnimate} variant="ghost" size="sm">
                    Animate Data Packet
                  </CyberButton>
                </div>

                {/* Concept buttons */}
                <p className="text-[10px] tracking-[2px] text-white/30 mb-3">EXPLORE CONCEPTS</p>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {Object.keys(CONCEPTS).map((concept) => (
                    <button
                      key={concept}
                      onClick={() => handleConceptClick(concept)}
                      className={`p-2.5 border rounded text-center transition-all text-[10px] tracking-[1px] ${
                        exploredConcepts.includes(concept)
                          ? 'border-cyan-400/30 bg-cyan-400/5 text-cyan-400'
                          : 'border-white/10 hover:border-white/30 text-white/50'
                      }`}
                    >
                      {concept}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white/30">{exploredConcepts.length}/{Object.keys(CONCEPTS).length} concepts explored</p>
                  {exploredConcepts.length >= 3 && (
                    <CyberButton onClick={handleComplete} size="sm">Complete</CyberButton>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setSelectedConcept(null)} className="text-[10px] text-white/40 hover:text-white/60 mb-4">
                  ← Back to concepts
                </button>

                <h3 className="text-sm font-bold tracking-[2px] text-cyan-400 mb-2">
                  {CONCEPTS[selectedConcept].title}
                </h3>
                <p className="text-xs text-white/60 mb-4">{CONCEPTS[selectedConcept].description}</p>

                {/* Visual representation */}
                <div className="p-4 border border-cyan-400/20 rounded bg-cyan-400/5 mb-4 text-center">
                  <p className="text-sm font-mono text-cyan-400">{CONCEPTS[selectedConcept].visual}</p>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  {CONCEPTS[selectedConcept].details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                      <span className="text-xs text-white/50">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
