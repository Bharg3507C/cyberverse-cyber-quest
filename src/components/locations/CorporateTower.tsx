'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface Floor {
  number: string;
  name: string;
  scenario: string;
  options: { label: string; correct: boolean }[];
  explanation: string;
}

const FLOORS: Floor[] = [
  {
    number: '01',
    name: 'PASSWORD POLICY',
    scenario: 'An employee uses "password123" for all company accounts and writes it on a sticky note on their monitor.',
    options: [
      { label: 'Enforce unique strong passwords + password manager', correct: true },
      { label: 'It\'s fine if they remember it', correct: false },
      { label: 'Just add a number to make it longer', correct: false },
    ],
    explanation: 'Company policy should require unique, complex passwords. A password manager helps employees manage them securely without sticky notes.',
  },
  {
    number: '02',
    name: 'ACCESS CONTROL',
    scenario: 'A marketing intern requests access to the financial database "for a report their manager mentioned."',
    options: [
      { label: 'Grant access immediately to be helpful', correct: false },
      { label: 'Verify with their manager and apply least-privilege access', correct: true },
      { label: 'Give them read-only access to everything', correct: false },
    ],
    explanation: 'Always verify access requests through proper channels. Apply the principle of least privilege — grant only what\'s needed for the specific task.',
  },
  {
    number: '03',
    name: 'DEVICE SECURITY',
    scenario: 'An employee leaves their laptop unlocked and unattended while getting coffee in a public coworking space.',
    options: [
      { label: 'Lock the device immediately (Win+L / Cmd+L)', correct: true },
      { label: 'Ignore it, they\'ll be back soon', correct: false },
      { label: 'Close the lid but don\'t lock it', correct: false },
    ],
    explanation: 'Unattended unlocked devices are a major security risk. Always lock before leaving — set auto-lock to 1-2 minutes as backup.',
  },
  {
    number: '04',
    name: 'DATA PROTECTION',
    scenario: 'A team member sends a spreadsheet with customer personal data to their personal email "to work on it from home."',
    options: [
      { label: 'That\'s fine if they\'re productive', correct: false },
      { label: 'Use approved company tools (VPN, secure cloud) instead', correct: true },
      { label: 'Only if they delete it afterward', correct: false },
    ],
    explanation: 'Sensitive data must stay within approved company systems. Personal email lacks enterprise security controls and creates compliance risks.',
  },
  {
    number: '05',
    name: 'INCIDENT REPORTING',
    scenario: 'An employee clicks a suspicious link and their screen flashes briefly. Everything seems fine afterward.',
    options: [
      { label: 'Ignore it since nothing seems wrong', correct: false },
      { label: 'Report it to security team immediately', correct: true },
      { label: 'Run a quick antivirus scan and move on', correct: false },
    ],
    explanation: 'Always report suspicious activity immediately. Many attacks show no visible symptoms. Early reporting enables faster containment.',
  },
];

export default function CorporateTower() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation } = useCyberStore();
  const [currentFloor, setCurrentFloor] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const floor = FLOORS[currentFloor];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);
    if (floor.options[index].correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentFloor < FLOORS.length - 1) {
      setCurrentFloor(currentFloor + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      learnConcept('Corporate Security');
      learnConcept('Least Privilege');
      learnConcept('Incident Reporting');
      completeSimulation('corporate-security');
      completeLocation('corporate-tower');
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0a0d28 0%, #060912 100%)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <HolographicPanel title="TOWER COMPLETE" onClose={() => setActiveLocation(null)} size="md">
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <p className="text-2xl font-bold text-blue-400">{score} / {FLOORS.length}</p>
              <p className="text-xs text-white/50 mt-2 mb-6">floors completed correctly</p>
              <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">Return to City</CyberButton>
            </div>
          </HolographicPanel>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0a0d28 0%, #060912 100%)' }} />

      {/* Floor indicator on left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <div className="space-y-2">
          {FLOORS.map((f, i) => (
            <div
              key={f.number}
              className={`w-8 h-8 flex items-center justify-center border rounded text-[9px] transition-all ${
                i === currentFloor ? 'border-blue-400/60 text-blue-400 bg-blue-400/10' :
                i < currentFloor ? 'border-green-400/30 text-green-400/50' : 'border-white/10 text-white/20'
              }`}
            >
              {f.number}
            </div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl">
        <HolographicPanel
          title={`FLOOR ${floor.number} — ${floor.name}`}
          subtitle="Corporate Tower Security Training"
          onClose={() => setActiveLocation(null)}
          size="full"
        >
          <AnimatePresence mode="wait">
            <motion.div key={currentFloor} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Scenario */}
              <div className="p-4 border border-blue-400/20 rounded bg-blue-400/5 mb-5">
                <p className="text-[10px] tracking-[2px] text-blue-400/60 mb-2">SCENARIO</p>
                <p className="text-sm text-white/70 leading-relaxed">{floor.scenario}</p>
              </div>

              <p className="text-[10px] tracking-[2px] text-white/30 mb-3">WHAT SHOULD HAPPEN?</p>

              {/* Options */}
              <div className="space-y-2 mb-5">
                {floor.options.map((option, i) => {
                  let borderColor = 'border-white/10';
                  let bg = 'transparent';
                  if (answered) {
                    if (option.correct) { borderColor = 'border-green-400/50'; bg = 'rgba(16,185,129,0.05)'; }
                    else if (i === selectedOption && !option.correct) { borderColor = 'border-red-400/50'; bg = 'rgba(239,68,68,0.05)'; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={answered}
                      className={`w-full text-left p-3 border rounded transition-all ${!answered ? 'hover:border-white/30 cursor-pointer' : ''}`}
                      style={{ borderColor, background: bg }}
                    >
                      <p className="text-xs text-white/60">{option.label}</p>
                      {answered && option.correct && (
                        <p className="text-[9px] text-green-400 mt-1">✓ Correct answer</p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                  <div className="p-3 border border-white/5 rounded">
                    <p className="text-[10px] tracking-[1px] text-white/30 mb-1">EXPLANATION</p>
                    <p className="text-xs text-white/50 leading-relaxed">{floor.explanation}</p>
                  </div>
                </motion.div>
              )}

              {answered && (
                <CyberButton onClick={handleNext} size="sm">
                  {currentFloor < FLOORS.length - 1 ? `Go to Floor ${FLOORS[currentFloor + 1].number}` : 'Complete Tower'}
                </CyberButton>
              )}
            </motion.div>
          </AnimatePresence>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
