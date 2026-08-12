'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface PhishingEmail {
  id: number;
  sender: string;
  senderEmail: string;
  subject: string;
  message: string;
  link: string;
  attachment?: string;
  isPhishing: boolean;
  clues: string[];
}

const PHISHING_EMAILS: PhishingEmail[] = [
  {
    id: 1,
    sender: 'CyberBank Support',
    senderEmail: 'support@cyb3r-bank-security.xyz',
    subject: '🚨 URGENT: Your Account Will Be Locked!',
    message: 'Dear valued customer, we detected suspicious activity on your account. You MUST verify your identity within 24 hours or your account will be permanently locked. Click below immediately.',
    link: 'http://cyb3r-bank-security.xyz/verify-now',
    attachment: 'account_verification.exe',
    isPhishing: true,
    clues: ['Suspicious domain (.xyz)', 'Urgent threatening language', 'Executable attachment', 'Generic greeting', 'Pressure to act immediately'],
  },
  {
    id: 2,
    sender: 'IT Department',
    senderEmail: 'admin@yourcompany.com',
    subject: 'Scheduled System Maintenance — Saturday 10PM',
    message: 'Hi team, we will be performing routine maintenance this Saturday from 10PM to 2AM. No action required from your end. Services will be briefly unavailable. Contact helpdesk for questions.',
    link: 'https://intranet.yourcompany.com/maintenance-schedule',
    isPhishing: false,
    clues: ['Legitimate domain', 'No urgency or threats', 'No action required', 'Professional tone', 'Specific schedule details'],
  },
  {
    id: 3,
    sender: 'Prize Center',
    senderEmail: 'winner-notification@free-rewards-claim.net',
    subject: '🎉 Congratulations! You Won $500!',
    message: 'You have been selected as our LUCKY WINNER! Claim your $500 gift card reward by providing your full name, address, and bank details. Offer expires in 1 hour!',
    link: 'http://free-rewards-claim.net/claim/$500',
    isPhishing: true,
    clues: ['Suspicious domain', 'Too good to be true', 'Asks for personal/bank info', 'Time pressure', 'You never entered a contest'],
  },
  {
    id: 4,
    sender: 'HR Department',
    senderEmail: 'hr-noreply@yourcompany.com',
    subject: 'Updated Holiday Calendar 2026',
    message: 'Please find attached the updated holiday calendar for 2026. Any questions, reach out to your HR representative.',
    link: 'https://hr.yourcompany.com/calendar/2026',
    attachment: 'Holiday_Calendar_2026.pdf',
    isPhishing: false,
    clues: ['Legitimate company domain', 'Expected communication', 'PDF attachment (not .exe)', 'No urgency', 'Professional tone'],
  },
  {
    id: 5,
    sender: 'Netflix',
    senderEmail: 'billing@netf1ix-update.com',
    subject: 'Payment Failed — Update Your Card Now',
    message: 'We were unable to process your monthly payment. Your account will be suspended unless you update your payment method within the next 2 hours. Click below to update.',
    link: 'http://netf1ix-update.com/billing/update',
    isPhishing: true,
    clues: ['Misspelled domain (netf1ix with "1")', 'Urgency tactic', 'Threatening suspension', 'Suspicious URL', 'Time pressure (2 hours)'],
  },
];

export default function CyberCafe() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, unlockAchievement } = useCyberStore();
  const [currentEmail, setCurrentEmail] = useState(0);
  const [showClues, setShowClues] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [inspecting, setInspecting] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const email = PHISHING_EMAILS[currentEmail];

  const handleAnswer = (isPhishing: boolean) => {
    const isCorrect = isPhishing === email.isPhishing;
    setCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) setScore(score + 1);
    setShowClues(true);
  };

  const handleNext = () => {
    if (currentEmail < PHISHING_EMAILS.length - 1) {
      setCurrentEmail(currentEmail + 1);
      setAnswered(false);
      setShowClues(false);
      setInspecting(null);
    } else {
      learnConcept('Phishing Detection');
      learnConcept('Email Security');
      completeSimulation('phishing-detection');
      completeLocation('cyber-cafe');
      if (score >= 4) unlockAchievement('phishing-detective');
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1a1400 0%, #060912 100%)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <HolographicPanel title="PHISHING TRAINING COMPLETE" onClose={() => setActiveLocation(null)} size="md">
            <div className="text-center">
              <div className="text-4xl mb-4">🎣</div>
              <p className="text-2xl font-bold mb-2" style={{ color: score >= 4 ? '#10b981' : '#f59e0b' }}>
                {score} / {PHISHING_EMAILS.length}
              </p>
              <p className="text-xs text-white/50 mb-6">emails correctly identified</p>
              {score >= 4 && (
                <p className="text-xs text-green-400 mb-4">🏆 Achievement Unlocked: PHISHING DETECTIVE</p>
              )}
              <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">
                Return to City
              </CyberButton>
            </div>
          </HolographicPanel>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1a1400 0%, #060912 100%)' }} />

      {/* Warning flicker */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl">
        <HolographicPanel
          title="CYBER CAFE — PHISHING ALERT"
          subtitle={`Message ${currentEmail + 1} of ${PHISHING_EMAILS.length} | Score: ${score}`}
          onClose={() => setActiveLocation(null)}
          size="full"
          variant="warning"
        >
          <AnimatePresence mode="wait">
            <motion.div key={currentEmail} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Email display */}
              <div className="border border-white/10 rounded p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="space-y-2 mb-3 text-xs">
                  <button
                    onClick={() => setInspecting('sender')}
                    className={`flex items-center gap-2 w-full text-left p-1.5 rounded transition-all ${inspecting === 'sender' ? 'bg-yellow-400/10 border border-yellow-400/30' : 'hover:bg-white/5'}`}
                  >
                    <span className="text-white/30 w-16 shrink-0">FROM:</span>
                    <span className="text-white/70">{email.sender}</span>
                    <span className="text-white/30 text-[10px]">&lt;{email.senderEmail}&gt;</span>
                  </button>
                  <button
                    onClick={() => setInspecting('subject')}
                    className={`flex items-center gap-2 w-full text-left p-1.5 rounded transition-all ${inspecting === 'subject' ? 'bg-yellow-400/10 border border-yellow-400/30' : 'hover:bg-white/5'}`}
                  >
                    <span className="text-white/30 w-16 shrink-0">SUBJ:</span>
                    <span className="text-white/70">{email.subject}</span>
                  </button>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <button
                    onClick={() => setInspecting('message')}
                    className={`w-full text-left p-2 rounded transition-all text-xs text-white/60 leading-relaxed ${inspecting === 'message' ? 'bg-yellow-400/10 border border-yellow-400/30' : 'hover:bg-white/5'}`}
                  >
                    {email.message}
                  </button>
                </div>

                <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setInspecting('link')}
                    className={`text-[10px] px-2 py-1 rounded transition-all ${inspecting === 'link' ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400' : 'border border-white/10 text-white/40 hover:text-white/60'}`}
                  >
                    🔗 {email.link}
                  </button>
                  {email.attachment && (
                    <button
                      onClick={() => setInspecting('attachment')}
                      className={`text-[10px] px-2 py-1 rounded transition-all ${inspecting === 'attachment' ? 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400' : 'border border-white/10 text-white/40 hover:text-white/60'}`}
                    >
                      📎 {email.attachment}
                    </button>
                  )}
                </div>
              </div>

              {/* Inspect hint */}
              {inspecting && !answered && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-yellow-400/60 mb-3">
                  Inspecting: {inspecting.toUpperCase()} — Look for suspicious indicators
                </motion.p>
              )}

              {/* Answer buttons */}
              {!answered ? (
                <div className="flex gap-3">
                  <CyberButton onClick={() => handleAnswer(false)} variant="secondary" size="sm" className="flex-1">
                    ✓ SAFE
                  </CyberButton>
                  <CyberButton onClick={() => handleAnswer(true)} variant="danger" size="sm" className="flex-1">
                    ⚠ PHISHING
                  </CyberButton>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`p-3 rounded border mb-3 ${correct ? 'border-green-400/30 bg-green-400/5' : 'border-red-400/30 bg-red-400/5'}`}>
                    <p className={`text-sm font-bold ${correct ? 'text-green-400' : 'text-red-400'}`}>
                      {correct ? '✓ CORRECT' : '✗ INCORRECT'}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      This email is {email.isPhishing ? 'PHISHING' : 'LEGITIMATE'}.
                    </p>
                  </div>

                  {showClues && (
                    <div className="mb-4">
                      <p className="text-[10px] tracking-[2px] text-white/30 mb-2">
                        {email.isPhishing ? 'RED FLAGS:' : 'LEGITIMATE INDICATORS:'}
                      </p>
                      <div className="space-y-1">
                        {email.clues.map((clue, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-xs text-white/50 flex items-center gap-2"
                          >
                            <span className={email.isPhishing ? 'text-red-400' : 'text-green-400'}>
                              {email.isPhishing ? '⚠' : '✓'}
                            </span>
                            {clue}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  )}

                  <CyberButton onClick={handleNext} size="sm">
                    {currentEmail < PHISHING_EMAILS.length - 1 ? 'Next Email' : 'Complete Training'}
                  </CyberButton>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
