'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

// ============================================================
// INVESTIGATION ENGINE
// 6-phase pedagogical flow:
//   1. EVIDENCE     — Present raw artifacts, no explanation
//   2. INVESTIGATE  — Let user examine / click / inspect clues
//   3. DECIDE       — User makes a judgment call
//   4. REMEDIATE    — User chooses corrective actions
//   5. TEST         — Verify understanding with follow-up
//   6. SCORE        — Calculate & display performance
// ============================================================

export type Phase = 'evidence' | 'investigate' | 'decide' | 'remediate' | 'test' | 'score';

export interface InvestigationStep {
  phase: Phase;
  render: (ctx: InvestigationContext) => ReactNode;
}

export interface InvestigationContext {
  // tracking
  cluesFound: string[];
  addClue: (id: string) => void;
  decisions: Record<string, string>;
  setDecision: (key: string, value: string) => void;
  remediations: string[];
  addRemediation: (id: string) => void;
  testAnswers: Record<string, boolean>;
  setTestAnswer: (key: string, correct: boolean) => void;
  // navigation
  nextPhase: () => void;
  currentPhase: Phase;
  // scoring
  score: number;
}

interface InvestigationEngineProps {
  title: string;
  subtitle: string;
  location: string;
  steps: InvestigationStep[];
  onComplete: (score: number, cluesFound: string[], remediations: string[]) => void;
  onClose: () => void;
  variant?: 'default' | 'danger' | 'success' | 'warning';
}

export default function InvestigationEngine({
  title,
  subtitle,
  steps,
  onComplete,
  onClose,
  variant = 'default',
}: InvestigationEngineProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cluesFound, setCluesFound] = useState<string[]>([]);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [remediations, setRemediations] = useState<string[]>([]);
  const [testAnswers, setTestAnswers] = useState<Record<string, boolean>>({});

  const addClue = (id: string) => {
    if (!cluesFound.includes(id)) setCluesFound([...cluesFound, id]);
  };

  const setDecision = (key: string, value: string) => {
    setDecisions((prev) => ({ ...prev, [key]: value }));
  };

  const addRemediation = (id: string) => {
    if (!remediations.includes(id)) setRemediations([...remediations, id]);
  };

  const setTestAnswer = (key: string, correct: boolean) => {
    setTestAnswers((prev) => ({ ...prev, [key]: correct }));
  };

  const nextPhase = () => {
    if (phaseIndex < steps.length - 1) {
      setPhaseIndex(phaseIndex + 1);
    } else {
      onComplete(score, cluesFound, remediations);
    }
  };

  // Score calculation
  const totalTests = Object.keys(testAnswers).length;
  const correctTests = Object.values(testAnswers).filter(Boolean).length;
  const score = totalTests > 0
    ? Math.round(((cluesFound.length * 0.3 + remediations.length * 0.3 + correctTests * 0.4) / 
        Math.max(1, cluesFound.length * 0.3 + remediations.length * 0.3 + totalTests * 0.4)) * 100)
    : Math.round(((cluesFound.length + remediations.length) / Math.max(1, cluesFound.length + remediations.length)) * 100);

  const currentPhase = steps[phaseIndex]?.phase || 'evidence';

  const ctx: InvestigationContext = {
    cluesFound, addClue,
    decisions, setDecision,
    remediations, addRemediation,
    testAnswers, setTestAnswer,
    nextPhase, currentPhase, score,
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0a0e1a 0%, #060912 100%)' }} />

      {/* Phase indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div
              className="w-6 h-6 flex items-center justify-center rounded-full text-[8px] font-bold border transition-all"
              style={{
                borderColor: i <= phaseIndex ? 'rgba(0,240,255,0.5)' : 'rgba(255,255,255,0.1)',
                background: i < phaseIndex ? 'rgba(0,240,255,0.15)' : i === phaseIndex ? 'rgba(0,240,255,0.05)' : 'transparent',
                color: i <= phaseIndex ? '#00f0ff' : 'rgba(255,255,255,0.2)',
              }}
            >
              {i < phaseIndex ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-4 h-px mx-0.5" style={{ background: i < phaseIndex ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.05)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Phase label */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20">
        <p className="text-[9px] tracking-[3px] text-white/20 uppercase text-center">{currentPhase}</p>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-3xl mt-8"
      >
        <HolographicPanel title={title} subtitle={subtitle} onClose={onClose} size="full" variant={variant}>
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {steps[phaseIndex]?.render(ctx)}
            </motion.div>
          </AnimatePresence>

          {/* Clues tracker */}
          {cluesFound.length > 0 && currentPhase !== 'score' && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] tracking-[2px] text-white/20">CLUES:</span>
                {cluesFound.map((clue) => (
                  <span key={clue} className="text-[9px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400/70 border border-cyan-400/20">
                    {clue}
                  </span>
                ))}
              </div>
            </div>
          )}
        </HolographicPanel>
      </motion.div>
    </div>
  );
}

// --- Reusable sub-components for building investigation phases ---

export function EvidenceItem({ label, value, suspicious, onClick }: { label: string; value: string; suspicious?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border rounded transition-all ${
        onClick ? 'cursor-pointer hover:border-white/30' : 'cursor-default'
      } ${suspicious ? 'border-yellow-400/20 bg-yellow-400/5' : 'border-white/5'}`}
    >
      <span className="text-[9px] tracking-[1px] text-white/30 uppercase block">{label}</span>
      <span className="text-xs text-white/70 mt-0.5 block">{value}</span>
    </button>
  );
}

export function ClueTag({ found, label }: { found: boolean; label: string }) {
  return (
    <span className={`text-[9px] px-2 py-1 rounded border ${
      found ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400' : 'border-white/5 text-white/20'
    }`}>
      {found ? '✓ ' : '? '}{label}
    </span>
  );
}

export function DecisionButton({ label, selected, onClick, variant = 'default' }: { label: string; selected: boolean; onClick: () => void; variant?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border rounded transition-all ${
        selected
          ? variant === 'danger' ? 'border-red-400/40 bg-red-400/10' : 'border-cyan-400/40 bg-cyan-400/10'
          : 'border-white/10 hover:border-white/30'
      }`}
    >
      <span className="text-xs text-white/70">{label}</span>
    </button>
  );
}

export function ScoreDisplay({ score, cluesFound, totalClues, remediations, totalRemediations, testCorrect, totalTests }: {
  score: number; cluesFound: number; totalClues: number; remediations: number; totalRemediations: number; testCorrect: number; totalTests: number;
}) {
  return (
    <div className="text-center">
      <motion.p
        className="text-4xl font-bold mb-2"
        style={{ color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
      >
        {score}%
      </motion.p>
      <p className="text-[10px] text-white/30 tracking-[2px] mb-6">INVESTIGATION SCORE</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 border border-white/5 rounded text-center">
          <p className="text-lg font-bold text-cyan-400">{cluesFound}/{totalClues}</p>
          <p className="text-[8px] text-white/30 tracking-[1px]">CLUES FOUND</p>
        </div>
        <div className="p-3 border border-white/5 rounded text-center">
          <p className="text-lg font-bold text-purple-400">{remediations}/{totalRemediations}</p>
          <p className="text-[8px] text-white/30 tracking-[1px]">REMEDIATED</p>
        </div>
        <div className="p-3 border border-white/5 rounded text-center">
          <p className="text-lg font-bold text-green-400">{testCorrect}/{totalTests}</p>
          <p className="text-[8px] text-white/30 tracking-[1px]">TEST PASSED</p>
        </div>
      </div>
    </div>
  );
}
