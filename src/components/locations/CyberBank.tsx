'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

type Step = 'intro' | 'auth' | 'mfa' | 'access' | 'complete';

const ACCESS_ZONES = [
  { name: 'LOBBY', level: 'PUBLIC', color: '#10b981' },
  { name: 'EMPLOYEE AREA', level: 'AUTHENTICATED', color: '#f59e0b' },
  { name: 'SERVER ROOM', level: 'AUTHORIZED (TECH)', color: '#8b5cf6' },
  { name: 'ADMIN VAULT', level: 'ADMIN ONLY', color: '#ef4444' },
];

const MFA_STEPS = [
  { label: 'PASSWORD', icon: '🔑', desc: 'Something you know' },
  { label: 'PHONE CODE', icon: '📱', desc: 'Something you have' },
  { label: 'BIOMETRIC', icon: '👁️', desc: 'Something you are' },
];

export default function CyberBank() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation } = useCyberStore();
  const [step, setStep] = useState<Step>('intro');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [accessChoices, setAccessChoices] = useState<Record<string, boolean>>({});
  const [mfaProgress, setMfaProgress] = useState(0);

  const handleAccessToggle = (zone: string) => {
    setAccessChoices(prev => ({ ...prev, [zone]: !prev[zone] }));
  };

  const handleMfaStep = () => {
    if (mfaProgress < 3) {
      setMfaProgress(mfaProgress + 1);
      if (mfaProgress === 2) {
        learnConcept('Multi-Factor Authentication');
      }
    }
  };

  const handleComplete = () => {
    learnConcept('Authentication');
    learnConcept('Authorization');
    learnConcept('Access Control');
    completeSimulation('cyberbank-auth');
    completeLocation('cyberbank');
    setStep('complete');
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0d0a28 0%, #060912 100%)' }} />

      {/* Vault pattern background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute border border-purple-400/30 rounded-full"
            style={{
              width: `${200 + i * 150}px`,
              height: `${200 + i * 150}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <HolographicPanel
          title="CYBERBANK"
          subtitle="Authentication & Access Control"
          onClose={() => setActiveLocation(null)}
          size="full"
          variant="default"
        >
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🏦</div>
                  <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                    Welcome to CyberBank. Learn how digital systems verify <span className="text-cyan-400">who you are</span> and control <span className="text-purple-400">what you can access</span>.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-4 border border-cyan-400/20 rounded text-center">
                    <p className="text-xs font-bold text-cyan-400 tracking-[2px]">AUTHENTICATION</p>
                    <p className="text-[10px] text-white/40 mt-2">WHO ARE YOU?</p>
                  </div>
                  <div className="p-4 border border-purple-400/20 rounded text-center">
                    <p className="text-xs font-bold text-purple-400 tracking-[2px]">AUTHORIZATION</p>
                    <p className="text-[10px] text-white/40 mt-2">WHAT CAN YOU ACCESS?</p>
                  </div>
                </div>
                <div className="text-center">
                  <CyberButton onClick={() => setStep('auth')}>Begin Scenario</CyberButton>
                </div>
              </motion.div>
            )}

            {step === 'auth' && (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs text-white/50 mb-4">
                  A user arrives at CyberBank. First, they must prove their identity.
                </p>

                {/* User selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['Employee', 'IT Admin', 'Visitor'].map(user => (
                    <button
                      key={user}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 border rounded text-center transition-all ${
                        selectedUser === user ? 'border-cyan-400/50 bg-cyan-400/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <p className="text-xs font-medium">{user}</p>
                    </button>
                  ))}
                </div>

                {selectedUser && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-[10px] tracking-[2px] text-cyan-400 mb-3">
                      ✓ IDENTITY: {selectedUser.toUpperCase()}
                    </p>
                    <p className="text-xs text-white/50 mb-4">
                      Now assign access levels. What should <span className="text-cyan-400">{selectedUser}</span> be allowed to access?
                    </p>

                    <div className="space-y-2 mb-6">
                      {ACCESS_ZONES.map(zone => (
                        <div
                          key={zone.name}
                          className="flex items-center justify-between p-3 border border-white/5 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                            <div>
                              <p className="text-xs font-medium">{zone.name}</p>
                              <p className="text-[9px] text-white/30">{zone.level}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAccessToggle(zone.name)}
                            className={`px-3 py-1 text-[10px] border rounded transition-all ${
                              accessChoices[zone.name]
                                ? 'border-green-400/50 text-green-400 bg-green-400/10'
                                : 'border-white/10 text-white/40 hover:border-white/30'
                            }`}
                          >
                            {accessChoices[zone.name] ? 'GRANTED' : 'DENY'}
                          </button>
                        </div>
                      ))}
                    </div>

                    <CyberButton onClick={() => setStep('mfa')} size="sm">Continue to MFA</CyberButton>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 'mfa' && (
              <motion.div key="mfa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-xs text-white/50 mb-2">Multi-Factor Authentication adds layers of security.</p>
                <p className="text-[10px] text-white/30 mb-6">Complete each factor to authenticate.</p>

                <div className="flex items-center justify-center gap-4 mb-8">
                  {MFA_STEPS.map((mfa, i) => (
                    <div key={mfa.label} className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleMfaStep}
                        disabled={i !== mfaProgress || mfaProgress >= 3}
                        className={`w-24 h-24 flex flex-col items-center justify-center border rounded transition-all ${
                          i < mfaProgress
                            ? 'border-green-400/50 bg-green-400/10'
                            : i === mfaProgress
                            ? 'border-cyan-400/50 bg-cyan-400/5 cursor-pointer hover:bg-cyan-400/10'
                            : 'border-white/5 opacity-30'
                        }`}
                      >
                        <span className="text-2xl">{mfa.icon}</span>
                        <p className="text-[9px] tracking-[1px] mt-2 font-medium">
                          {i < mfaProgress ? '✓' : mfa.label}
                        </p>
                        <p className="text-[8px] text-white/30 mt-1">{mfa.desc}</p>
                      </motion.button>
                      {i < 2 && <span className="text-white/20 text-lg">+</span>}
                    </div>
                  ))}
                </div>

                {mfaProgress >= 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <p className="text-green-400 text-sm mb-4">✓ MULTI-FACTOR AUTHENTICATION COMPLETE</p>
                    <CyberButton onClick={handleComplete}>Complete Lesson</CyberButton>
                  </motion.div>
                )}

                {mfaProgress < 3 && (
                  <p className="text-center text-[10px] text-cyan-400/60">Click each factor to proceed</p>
                )}
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-green-400 font-bold tracking-[2px] text-sm">CYBERBANK COMPLETE</p>
                <p className="text-xs text-white/40 mt-2 mb-6">You learned: Authentication, Authorization, MFA, Access Control</p>
                <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">
                  Return to City
                </CyberButton>
              </motion.div>
            )}
          </AnimatePresence>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
