'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import { getScenario, getAllScenarioMeta } from '@/lib/investigation/scenarios';
import { ScoreBreakdown, IncidentReport } from '@/lib/investigation/types';
import InvestigationPanel from '@/components/investigation/InvestigationPanel';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

export default function IncidentAlley() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, unlockAchievement, updateSecurityScore, addXp } = useCyberStore();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const scenarios = getAllScenarioMeta();

  const handleComplete = (score: ScoreBreakdown, report: IncidentReport) => {
    addXp(score.xpEarned);
    if (score.accuracy >= 60) {
      completeSimulation(`investigation-${report.scenarioId}`);
      updateSecurityScore(Math.max(score.accuracy, 70));
    }
    if (score.accuracy >= 80) unlockAchievement('incident-investigator');
    learnConcept('Incident Response');
    learnConcept('Log Analysis');
    completeLocation('incident-alley');
  };

  if (activeScenario) {
    const scenario = getScenario(activeScenario);
    return (
      <InvestigationPanel
        scenario={scenario}
        onComplete={handleComplete}
        onClose={() => setActiveScenario(null)}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1a0505 0%, #060912 100%)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-2xl">
        <HolographicPanel title="INCIDENT ALLEY" subtitle="Security Investigation Lab" onClose={() => setActiveLocation(null)} size="full" variant="danger">
          <p className="text-xs text-white/50 mb-4">
            Investigate real-world-style security incidents. Analyze logs, collect evidence, build timelines, and recommend remediation.
          </p>

          <div className="space-y-2 mb-6">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenario(s.id)}
                className="w-full text-left p-4 border border-white/5 hover:border-cyan-400/30 rounded transition-all hover:bg-cyan-400/3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/70">{s.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{s.briefing.slice(0, 80)}...</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${
                      s.difficulty === 'beginner' ? 'border-green-400/30 text-green-400' :
                      s.difficulty === 'intermediate' ? 'border-yellow-400/30 text-yellow-400' :
                      'border-red-400/30 text-red-400'
                    }`}>{s.difficulty.toUpperCase()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">Return to City</CyberButton>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
