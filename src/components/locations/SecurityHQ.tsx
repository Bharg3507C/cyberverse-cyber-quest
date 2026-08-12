'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface SecurityCategory {
  id: string;
  name: string;
  icon: string;
  weight: number;
  checks: { label: string; key: string; points: number }[];
}

const CATEGORIES: SecurityCategory[] = [
  {
    id: 'password', name: 'PASSWORD', icon: '🔑', weight: 20,
    checks: [
      { label: 'Use strong unique passwords', key: 'pass-strong', points: 7 },
      { label: 'Use a password manager', key: 'pass-manager', points: 7 },
      { label: 'Never reuse passwords', key: 'pass-reuse', points: 6 },
    ],
  },
  {
    id: 'mfa', name: 'MFA', icon: '📱', weight: 20,
    checks: [
      { label: 'Enable MFA on email', key: 'mfa-email', points: 8 },
      { label: 'Enable MFA on banking', key: 'mfa-bank', points: 7 },
      { label: 'Use authenticator app over SMS', key: 'mfa-app', points: 5 },
    ],
  },
  {
    id: 'updates', name: 'UPDATES', icon: '🔄', weight: 15,
    checks: [
      { label: 'Auto-update OS enabled', key: 'up-os', points: 5 },
      { label: 'Apps updated regularly', key: 'up-apps', points: 5 },
      { label: 'Browser updated', key: 'up-browser', points: 5 },
    ],
  },
  {
    id: 'backups', name: 'BACKUPS', icon: '💾', weight: 15,
    checks: [
      { label: 'Regular data backups', key: 'bk-regular', points: 5 },
      { label: 'Offline backup copy', key: 'bk-offline', points: 5 },
      { label: 'Backup tested/verified', key: 'bk-test', points: 5 },
    ],
  },
  {
    id: 'privacy', name: 'PRIVACY', icon: '👁️', weight: 15,
    checks: [
      { label: 'Review app permissions', key: 'priv-perms', points: 5 },
      { label: 'Limit social media exposure', key: 'priv-social', points: 5 },
      { label: 'Use privacy-focused tools', key: 'priv-tools', points: 5 },
    ],
  },
  {
    id: 'device', name: 'DEVICE SECURITY', icon: '💻', weight: 15,
    checks: [
      { label: 'Screen lock enabled', key: 'dev-lock', points: 5 },
      { label: 'Disk encryption enabled', key: 'dev-encrypt', points: 5 },
      { label: 'Antivirus/EDR active', key: 'dev-av', points: 5 },
    ],
  },
];

export default function SecurityHQ() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, updateSecurityScore } = useCyberStore();
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const totalPoints = CATEGORIES.reduce((acc, cat) => acc + cat.checks.reduce((a, c) => a + c.points, 0), 0);
  const earnedPoints = CATEGORIES.reduce((acc, cat) =>
    acc + cat.checks.reduce((a, c) => a + (checks[c.key] ? c.points : 0), 0), 0);
  const score = Math.round((earnedPoints / totalPoints) * 100);

  const getCategoryScore = (cat: SecurityCategory) => {
    const total = cat.checks.reduce((a, c) => a + c.points, 0);
    const earned = cat.checks.reduce((a, c) => a + (checks[c.key] ? c.points : 0), 0);
    return { earned, total, percent: Math.round((earned / total) * 100) };
  };

  const toggle = (key: string) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    updateSecurityScore(score);
  }, [score, updateSecurityScore]);

  const handleComplete = () => {
    learnConcept('Cyber Hygiene');
    learnConcept('Security Assessment');
    completeSimulation('security-assessment');
    completeLocation('security-hq');
    setActiveLocation(null);
  };

  const strongCategories = CATEGORIES.filter(c => getCategoryScore(c).percent >= 70);
  const weakCategories = CATEGORIES.filter(c => getCategoryScore(c).percent < 70);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #001a0d 0%, #060912 100%)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-3xl">
        <HolographicPanel
          title="SECURITY HQ"
          subtitle="Digital Security Assessment"
          onClose={() => setActiveLocation(null)}
          size="full"
          variant="success"
        >
          {/* Score display */}
          <div className="text-center mb-6">
            <p className="text-[10px] tracking-[2px] text-white/30 mb-2">SECURITY SCORE</p>
            <motion.p
              className="text-4xl font-bold"
              style={{ color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444' }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5 }}
              key={score}
            >
              {score} / 100
            </motion.p>
            <div className="w-48 h-2 bg-white/5 rounded-full mx-auto mt-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444' }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 gap-3 mb-6 max-h-[280px] overflow-y-auto">
            {CATEGORIES.map((cat) => {
              const catScore = getCategoryScore(cat);
              return (
                <div key={cat.id} className="border border-white/5 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span className="text-[10px] tracking-[1px] font-medium text-white/60">{cat.name}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: catScore.percent >= 70 ? '#10b981' : '#f59e0b' }}>
                      {catScore.percent}%
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {cat.checks.map((check) => (
                      <button
                        key={check.key}
                        onClick={() => toggle(check.key)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-all ${
                          checks[check.key] ? 'border-green-400/50 bg-green-400/20' : 'border-white/20'
                        }`}>
                          {checks[check.key] && <span className="text-[8px] text-green-400">✓</span>}
                        </div>
                        <span className="text-[10px] text-white/40">{check.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {earnedPoints > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 border border-green-400/20 rounded">
                <p className="text-[9px] tracking-[1px] text-green-400 mb-1">STRONG</p>
                {strongCategories.map(c => (
                  <p key={c.id} className="text-[10px] text-white/40">{c.icon} {c.name}</p>
                ))}
                {strongCategories.length === 0 && <p className="text-[10px] text-white/20">—</p>}
              </div>
              <div className="p-2 border border-yellow-400/20 rounded">
                <p className="text-[9px] tracking-[1px] text-yellow-400 mb-1">NEEDS ATTENTION</p>
                {weakCategories.map(c => (
                  <p key={c.id} className="text-[10px] text-white/40">{c.icon} {c.name}</p>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <CyberButton onClick={handleComplete} size="sm">Save Assessment</CyberButton>
          </div>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
