'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface Scenario {
  id: number;
  situation: string;
  context: string;
  isSocialEngineering: boolean;
  technique: string;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: '"Hi, I\'m from IT support. We\'re doing emergency maintenance. Can you give me your OTP so I can verify your account hasn\'t been compromised?"',
    context: 'Phone call from unknown number',
    isSocialEngineering: true,
    technique: 'PRETEXTING',
    explanation: 'IT support never asks for your OTP. This is a pretext — a fabricated scenario designed to get you to reveal sensitive info.',
  },
  {
    id: 2,
    situation: '"Please hold the door! I forgot my access card upstairs. I\'m running late for the 9am meeting."',
    context: 'Person behind you at office entrance',
    isSocialEngineering: true,
    technique: 'TAILGATING',
    explanation: 'Tailgating exploits politeness to bypass physical security. Always direct people to reception — legitimate employees can get a temp card.',
  },
  {
    id: 3,
    situation: '"Your cloud subscription will be terminated today unless you verify your identity immediately. Click the link below."',
    context: 'Email from "cloud-admin-verify@servicemail.xyz"',
    isSocialEngineering: true,
    technique: 'URGENCY MANIPULATION',
    explanation: 'Creating artificial urgency bypasses critical thinking. Legitimate services give reasonable timeframes and never threaten immediate deletion.',
  },
  {
    id: 4,
    situation: '"Hi team, the fire drill scheduled for Thursday has been moved to Friday at 2PM. No action needed."',
    context: 'Email from facilities@yourcompany.com',
    isSocialEngineering: false,
    technique: 'LEGITIMATE',
    explanation: 'This is a routine internal communication — no requests for credentials, no urgency, from a verified domain.',
  },
  {
    id: 5,
    situation: '"I found this USB drive in the parking lot. It\'s labeled \'Employee Salaries Q4\'. Let me plug it in to find the owner."',
    context: 'Colleague at their desk',
    isSocialEngineering: true,
    technique: 'BAITING',
    explanation: 'Baiting uses curiosity against you. Unknown USB drives can contain malware. Always report them to security — never plug them in.',
  },
  {
    id: 6,
    situation: '"Hi, I\'m the new intern starting in marketing. Could you show me how to access the shared drive? HR said you could help."',
    context: 'Person at your desk you haven\'t met before',
    isSocialEngineering: true,
    technique: 'IMPERSONATION',
    explanation: 'Verify identity before granting access. Legitimate new employees are introduced through official channels with proper documentation.',
  },
];

export default function DigitalTransit() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation } = useCyberStore();
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[current];

  const handleAnswer = (isSE: boolean) => {
    const isCorrect = isSE === scenario.isSocialEngineering;
    setCorrect(isCorrect);
    setAnswered(true);
    if (isCorrect) setScore(score + 1);
  };

  const handleNext = () => {
    if (current < SCENARIOS.length - 1) {
      setCurrent(current + 1);
      setAnswered(false);
    } else {
      learnConcept('Social Engineering');
      learnConcept('Pretexting');
      learnConcept('Tailgating');
      completeSimulation('social-engineering');
      completeLocation('digital-transit');
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #150a20 0%, #060912 100%)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <HolographicPanel title="TRAINING COMPLETE" onClose={() => setActiveLocation(null)} size="md">
            <div className="text-center">
              <div className="text-4xl mb-4">🚇</div>
              <p className="text-2xl font-bold text-purple-400">{score} / {SCENARIOS.length}</p>
              <p className="text-xs text-white/50 mt-2 mb-6">scenarios correctly identified</p>
              <p className="text-[10px] text-white/30 mb-4">
                Techniques covered: Pretexting, Tailgating, Urgency, Baiting, Impersonation
              </p>
              <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">Return to City</CyberButton>
            </div>
          </HolographicPanel>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #150a20 0%, #060912 100%)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl">
        <HolographicPanel
          title="DIGITAL TRANSIT"
          subtitle={`Social Engineering | Scenario ${current + 1}/${SCENARIOS.length}`}
          onClose={() => setActiveLocation(null)}
          size="full"
        >
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Context */}
              <p className="text-[10px] tracking-[2px] text-purple-400/60 mb-3">{scenario.context}</p>

              {/* Scenario message */}
              <div className="p-4 border border-purple-400/20 rounded bg-purple-400/5 mb-5">
                <p className="text-sm text-white/70 italic leading-relaxed">{scenario.situation}</p>
              </div>

              {!answered ? (
                <div className="flex gap-3">
                  <CyberButton onClick={() => handleAnswer(false)} variant="secondary" size="sm" className="flex-1">
                    ✓ LEGITIMATE
                  </CyberButton>
                  <CyberButton onClick={() => handleAnswer(true)} variant="danger" size="sm" className="flex-1">
                    ⚠ SOCIAL ENGINEERING
                  </CyberButton>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`p-3 rounded border mb-4 ${correct ? 'border-green-400/30 bg-green-400/5' : 'border-red-400/30 bg-red-400/5'}`}>
                    <p className={`text-sm font-bold ${correct ? 'text-green-400' : 'text-red-400'}`}>
                      {correct ? '✓ CORRECT' : '✗ INCORRECT'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] tracking-[2px] font-bold ${scenario.isSocialEngineering ? 'text-red-400' : 'text-green-400'}`}>
                        {scenario.technique}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{scenario.explanation}</p>
                  </div>

                  <CyberButton onClick={handleNext} size="sm">
                    {current < SCENARIOS.length - 1 ? 'Next Scenario' : 'Complete Training'}
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
