'use client';

import { motion } from 'framer-motion';
import { useCyberStore, LOCATIONS } from '@/store/cyberStore';
import { getLevelInfo } from '@/lib/investigation/leveling';
import { getAllScenarioMeta } from '@/lib/investigation/scenarios';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

export default function CyberPlaza() {
  const { setActiveLocation, locationsExplored, locationsCompleted, securityScore, xp, conceptsLearned, simulationsCompleted, achievements } = useCyberStore();
  const level = getLevelInfo(xp);
  const scenarios = getAllScenarioMeta();
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  // Simulated SOC metrics derived from user progress
  const activeIncidents = Math.max(0, 6 - simulationsCompleted.length);
  const criticalIncidents = Math.max(0, 2 - Math.floor(simulationsCompleted.length / 3));
  const blockedIPs = simulationsCompleted.length * 3 + locationsCompleted.length * 2;
  const suspiciousEvents = Math.max(0, 32 - simulationsCompleted.length * 5);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #0a1628 0%, #060912 100%)' }} />

      {/* Animated data streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div key={i} className="absolute w-px" style={{ left: `${15 + i * 14}%`, top: 0, height: '100%', background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? '#00f0ff' : '#8b5cf6'}15, transparent)` }}
            animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-4xl">
        <HolographicPanel title="CYBER PLAZA — COMMAND CENTER" subtitle={`Level ${level.level} • ${level.title} • ${xp} XP`} onClose={() => setActiveLocation(null)} size="full">

          {/* XP Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-[9px] text-white/30 mb-1">
              <span>LEVEL {level.level} — {level.rank}</span>
              <span>{xp} / {level.xpNext} XP</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)' }} animate={{ width: `${level.progress}%` }} />
            </div>
          </div>

          {/* SOC Dashboard Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'ACTIVE INCIDENTS', value: String(activeIncidents).padStart(2, '0'), color: activeIncidents > 2 ? '#ef4444' : '#f59e0b' },
              { label: 'SECURITY SCORE', value: `${securityScore}%`, color: securityScore >= 70 ? '#10b981' : '#f59e0b' },
              { label: 'BLOCKED IPs', value: String(blockedIPs), color: '#06b6d4' },
              { label: 'SUSPICIOUS', value: String(suspiciousEvents), color: suspiciousEvents > 20 ? '#ef4444' : '#10b981' },
            ].map(m => (
              <div key={m.label} className="text-center p-3 border border-white/5 rounded" style={{ borderColor: `${m.color}20` }}>
                <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[8px] tracking-[1px] text-white/30 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Simulated Event Feed */}
          <div className="mb-5 p-3 border border-white/5 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <p className="text-[9px] tracking-[2px] text-white/20 mb-2">SIMULATED EVENT FEED</p>
            <div className="space-y-1 max-h-20 overflow-hidden">
              {[
                { t: '14:32:08', msg: 'AUTH_FAILURE user=alex.chen src=203.0.113.42', sev: 'MEDIUM' },
                { t: '14:32:14', msg: 'AUTH_SUCCESS user=alex.chen src=203.0.113.42', sev: 'INFO' },
                { t: '14:35:02', msg: 'PRIVILEGE_CHANGE user=alex.chen action=admin_assigned', sev: 'HIGH' },
                { t: '14:38:11', msg: 'DATA_EXPORT user=alex.chen size=2.4GB', sev: 'CRITICAL' },
              ].map((ev, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}
                  className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="text-white/20">{ev.t}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${ev.sev === 'CRITICAL' ? 'bg-red-400' : ev.sev === 'HIGH' ? 'bg-yellow-400' : ev.sev === 'MEDIUM' ? 'bg-purple-400' : 'bg-gray-500'}`} />
                  <span className="text-white/40">{ev.msg}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-[8px] text-white/10 mt-2 text-center">SIMULATED SECURITY DATA</p>
          </div>

          {/* Progress + Locations */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Progress */}
            <div>
              <p className="text-[9px] tracking-[2px] text-white/30 mb-2">INVESTIGATION STATUS</p>
              <div className="space-y-1">
                {scenarios.slice(0, 4).map(s => {
                  const done = simulationsCompleted.includes(`investigation-${s.id}`);
                  return (
                    <div key={s.id} className="flex items-center gap-2 text-[10px]">
                      <span className={done ? 'text-green-400' : 'text-white/20'}>{done ? '✓' : '○'}</span>
                      <span className="text-white/40">{s.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* Badges */}
              {unlockedAchievements.length > 0 && (
                <div className="mt-3">
                  <p className="text-[9px] tracking-[2px] text-white/30 mb-1">BADGES</p>
                  <div className="flex gap-1 flex-wrap">
                    {unlockedAchievements.map(a => (
                      <span key={a.id} className="text-[9px] px-2 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20">{a.title}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Locations */}
            <div>
              <p className="text-[9px] tracking-[2px] text-white/30 mb-2">EXPLORE LOCATIONS</p>
              <div className="space-y-1 max-h-[140px] overflow-y-auto">
                {LOCATIONS.filter(l => l.id !== 'cyber-plaza').map(loc => (
                  <button key={loc.id} onClick={() => setActiveLocation(loc.id)}
                    className="flex items-center gap-2 w-full p-1.5 rounded border border-white/3 hover:border-white/15 transition-all text-left">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: loc.color, opacity: locationsExplored.includes(loc.id) ? 1 : 0.2 }} />
                    <span className="text-[10px] text-white/50">{loc.name}</span>
                    {locationsCompleted.includes(loc.id) && <span className="text-[8px] text-green-400 ml-auto">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills / Concepts */}
          {conceptsLearned.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <p className="text-[9px] tracking-[2px] text-white/20 mb-2">SKILLS PRACTICED ({conceptsLearned.length})</p>
              <div className="flex gap-1 flex-wrap">
                {conceptsLearned.slice(0, 12).map(c => (
                  <span key={c} className="text-[8px] px-2 py-0.5 rounded bg-cyan-400/5 text-cyan-400/60 border border-cyan-400/10">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">Return to City</CyberButton>
          </div>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
