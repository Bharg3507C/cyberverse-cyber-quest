'use client';

import { motion } from 'framer-motion';
import CyberButton from '@/components/ui/CyberButton';

interface PhishingConsequenceProps {
  clickedPhishing: boolean;
  emailSubject: string;
  onContinue: () => void;
}

/**
 * Shows what happens AFTER a user clicks a phishing link.
 * Visual storytelling of the attack chain.
 */
export default function PhishingConsequence({ clickedPhishing, emailSubject, onContinue }: PhishingConsequenceProps) {
  if (!clickedPhishing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-6">
        <div className="text-3xl mb-3">🛡️</div>
        <p className="text-green-400 font-bold tracking-[2px] text-sm mb-2">THREAT AVOIDED</p>
        <p className="text-xs text-white/50 mb-4">
          You correctly identified the phishing attempt. No data was compromised.
        </p>
        <div className="p-3 border border-green-400/20 rounded bg-green-400/5 mb-4">
          <p className="text-[10px] text-green-400/60 tracking-[1px] mb-1">WHAT WOULD HAVE HAPPENED:</p>
          <div className="space-y-1 text-[10px] text-white/40">
            <p>1. Redirected to fake login page</p>
            <p>2. Credentials harvested by attacker</p>
            <p>3. Account compromise within minutes</p>
            <p>4. Lateral movement to other accounts</p>
          </div>
        </div>
        <CyberButton onClick={onContinue} size="sm">Continue</CyberButton>
      </motion.div>
    );
  }

  // Clicked phishing — show the attack chain
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">⚠️</div>
        <p className="text-red-400 font-bold tracking-[2px] text-sm">LINK CLICKED — ATTACK CHAIN INITIATED</p>
      </div>

      {/* Attack timeline */}
      <div className="space-y-3 mb-6">
        {[
          { time: '0s', event: 'You clicked the link', icon: '🖱️', color: '#f59e0b' },
          { time: '1s', event: 'Redirected to fake login page (looks identical)', icon: '🌐', color: '#f59e0b' },
          { time: '5s', event: 'You enter credentials on fake page', icon: '🔑', color: '#ef4444' },
          { time: '6s', event: 'Credentials sent to attacker server', icon: '📡', color: '#ef4444' },
          { time: '30s', event: 'Attacker logs into your real account', icon: '👤', color: '#ef4444' },
          { time: '2min', event: 'Password changed, you\'re locked out', icon: '🔒', color: '#ef4444' },
          { time: '5min', event: 'Attacker sends phishing to your contacts', icon: '📧', color: '#ef4444' },
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-[9px] font-mono text-white/20 w-10 shrink-0">{step.time}</span>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: step.color }} />
            <span className="text-lg">{step.icon}</span>
            <span className="text-xs text-white/60">{step.event}</span>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border border-red-400/20 rounded bg-red-400/5 mb-4">
        <p className="text-[10px] text-red-400 tracking-[1px] mb-1">LESSON</p>
        <p className="text-xs text-white/50">
          A single click can compromise your entire digital identity in minutes.
          Always verify sender, check URLs, and never enter credentials from email links.
        </p>
      </div>

      <div className="text-center">
        <CyberButton onClick={onContinue} size="sm" variant="danger">I Understand — Continue</CyberButton>
      </div>
    </motion.div>
  );
}
