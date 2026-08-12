'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IncidentScenario, InvestigationState, InvestigationPhase, SecurityLog, ScoreBreakdown, IncidentReport } from '@/lib/investigation/types';
import { calculateScore, generateReport } from '@/lib/investigation/scoring';
import CyberButton from '@/components/ui/CyberButton';

interface InvestigationPanelProps {
  scenario: IncidentScenario;
  onComplete: (score: ScoreBreakdown, report: IncidentReport) => void;
  onClose: () => void;
}

export default function InvestigationPanel({ scenario, onComplete, onClose }: InvestigationPanelProps) {
  const [phase, setPhase] = useState<InvestigationPhase>('briefing');
  const [state, setState] = useState<InvestigationState>({
    scenarioId: scenario.id, phase: 'briefing',
    markedEvidence: [], timeline: [],
    selectedHypothesis: null, appliedRemediations: [],
    quizAnswers: {}, score: null, report: null,
    startedAt: new Date().toISOString(), completedAt: null,
  });

  // Log investigation state
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'time-asc'|'time-desc'|'severity'>('time-asc');
  const [selectedLog, setSelectedLog] = useState<SecurityLog|null>(null);

  const phases: InvestigationPhase[] = ['briefing','investigate','evidence','timeline','hypothesis','remediation','quiz','report'];
  const phaseIndex = phases.indexOf(phase);

  const nextPhase = () => {
    const next = phases[phaseIndex + 1];
    if (next) { setPhase(next); setState(s => ({...s, phase: next})); }
  };

  const filteredLogs = useMemo(() => {
    let logs = [...scenario.logs];
    if (search) logs = logs.filter(l => JSON.stringify(l).toLowerCase().includes(search.toLowerCase()));
    if (filterSeverity !== 'ALL') logs = logs.filter(l => l.severity === filterSeverity);
    if (filterType !== 'ALL') logs = logs.filter(l => l.eventType === filterType);
    if (sortBy === 'time-desc') logs.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
    else if (sortBy === 'severity') { const sev = {'CRITICAL':5,'HIGH':4,'MEDIUM':3,'LOW':2,'INFO':1}; logs.sort((a,b) => (sev[b.severity]||0) - (sev[a.severity]||0)); }
    return logs;
  }, [scenario.logs, search, filterSeverity, filterType, sortBy]);

  const toggleEvidence = (logId: string, relevant: boolean) => {
    setState(s => {
      const existing = s.markedEvidence.findIndex(e => e.logId === logId);
      const arr = [...s.markedEvidence];
      if (existing >= 0) arr[existing] = { logId, relevant };
      else arr.push({ logId, relevant });
      return { ...s, markedEvidence: arr };
    });
  };

  const toggleTimeline = (logId: string) => {
    setState(s => {
      const t = s.timeline.includes(logId) ? s.timeline.filter(id => id !== logId) : [...s.timeline, logId];
      return { ...s, timeline: t };
    });
  };

  const handleSubmit = () => {
    const score = calculateScore(scenario, state);
    const report = generateReport(scenario, state, score);
    setState(s => ({...s, score, report, completedAt: new Date().toISOString()}));
    setPhase('report');
    onComplete(score, report);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{background:'#060912'}}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5" style={{background:'rgba(10,14,26,0.95)'}}>
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-white/40 hover:text-white/70 text-sm">← EXIT</button>
          <h1 className="text-xs font-bold tracking-[2px] text-cyan-400">{scenario.title}</h1>
        </div>
        {/* Phase indicator */}
        <div className="flex gap-1">
          {phases.map((p, i) => (
            <div key={p} className={`w-2 h-2 rounded-full ${i < phaseIndex ? 'bg-cyan-400' : i === phaseIndex ? 'bg-cyan-400/50' : 'bg-white/10'}`} title={p} />
          ))}
        </div>
        <span className="text-[9px] tracking-[2px] text-white/20 uppercase">{phase}</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'briefing' && (
            <BriefingPhase key="b" scenario={scenario} onStart={nextPhase} />
          )}
          {phase === 'investigate' && (
            <InvestigatePhase key="i" logs={filteredLogs} search={search} setSearch={setSearch}
              filterSeverity={filterSeverity} setFilterSeverity={setFilterSeverity}
              filterType={filterType} setFilterType={setFilterType}
              sortBy={sortBy} setSortBy={setSortBy}
              selectedLog={selectedLog} setSelectedLog={setSelectedLog}
              onNext={nextPhase} />
          )}
          {phase === 'evidence' && (
            <EvidencePhase key="e" logs={scenario.logs} state={state} toggleEvidence={toggleEvidence} onNext={nextPhase} />
          )}
          {phase === 'timeline' && (
            <TimelinePhase key="t" logs={scenario.logs} state={state} toggleTimeline={toggleTimeline} onNext={nextPhase} />
          )}
          {phase === 'hypothesis' && (
            <HypothesisPhase key="h" hypotheses={scenario.hypotheses} state={state} setState={setState} onNext={nextPhase} />
          )}
          {phase === 'remediation' && (
            <RemediationPhase key="r" scenario={scenario} state={state} setState={setState} onNext={nextPhase} />
          )}
          {phase === 'quiz' && (
            <QuizPhase key="q" questions={scenario.quizQuestions} state={state} setState={setState} onSubmit={handleSubmit} />
          )}
          {phase === 'report' && (
            <ReportPhase key="rp" scenario={scenario} state={state} onClose={onClose} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- PHASE: BRIEFING ----
function BriefingPhase({ scenario, onStart }: { scenario: IncidentScenario; onStart: () => void }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center h-full p-8">
      <div className="max-w-lg text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-cyan-400/30 flex items-center justify-center">
          <span className="text-cyan-400 text-lg">📋</span>
        </div>
        <h2 className="text-sm font-bold tracking-[3px] text-cyan-400 mb-2">INCIDENT BRIEFING</h2>
        <p className="text-xs text-white/30 tracking-[2px] mb-6 uppercase">{scenario.category} • {scenario.difficulty}</p>
        <div className="p-4 border border-white/5 rounded text-left mb-6" style={{background:'rgba(0,240,255,0.02)'}}>
          <p className="text-sm text-white/60 leading-relaxed">{scenario.briefing}</p>
        </div>
        <div className="p-3 border border-white/5 rounded text-left mb-6">
          <p className="text-[9px] tracking-[2px] text-white/30 mb-1">OBJECTIVE</p>
          <p className="text-xs text-white/50">{scenario.objective}</p>
        </div>
        <CyberButton onClick={onStart}>BEGIN INVESTIGATION</CyberButton>
      </div>
    </motion.div>
  );
}

// ---- PHASE: INVESTIGATE (SOC Log Viewer) ----
function InvestigatePhase({ logs, search, setSearch, filterSeverity, setFilterSeverity, filterType, setFilterType, sortBy, setSortBy, selectedLog, setSelectedLog, onNext }: {
  logs: SecurityLog[]; search: string; setSearch: (s:string)=>void;
  filterSeverity: string; setFilterSeverity: (s:string)=>void;
  filterType: string; setFilterType: (s:string)=>void;
  sortBy: string; setSortBy: (s:any)=>void;
  selectedLog: SecurityLog|null; setSelectedLog: (l:SecurityLog|null)=>void;
  onNext: ()=>void;
}) {
  const sevColors: Record<string,string> = {CRITICAL:'#ef4444',HIGH:'#f59e0b',MEDIUM:'#a855f7',LOW:'#06b6d4',INFO:'#6b7280'};
  const types = ['ALL', ...Array.from(new Set(logs.map(l=>l.eventType)))];
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex h-full">
      {/* Log list */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        {/* Filters */}
        <div className="p-3 border-b border-white/5 flex gap-2 flex-wrap items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search logs..." className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white placeholder:text-white/20 w-48 focus:outline-none focus:border-cyan-400/30" />
          <select value={filterSeverity} onChange={e=>setFilterSeverity(e.target.value)} className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
            <option value="ALL">All Severity</option>
            {['INFO','LOW','MEDIUM','HIGH','CRITICAL'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
            {types.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-2 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
            <option value="time-asc">Oldest First</option>
            <option value="time-desc">Newest First</option>
            <option value="severity">By Severity</option>
          </select>
          <span className="text-[9px] text-white/20 ml-auto">{logs.length} events</span>
        </div>
        {/* Log entries */}
        <div className="flex-1 overflow-y-auto">
          {logs.map(log => (
            <button key={log.id} onClick={()=>setSelectedLog(log)} className={`w-full text-left px-3 py-2 border-b border-white/3 hover:bg-white/3 transition-colors flex items-center gap-2 ${selectedLog?.id===log.id ? 'bg-cyan-400/5 border-l-2 border-l-cyan-400' : ''}`}>
              <span className="text-[9px] font-mono text-white/25 w-32 shrink-0">{log.timestamp.slice(11)}</span>
              <span className="w-2 h-2 rounded-full shrink-0" style={{background:sevColors[log.severity]||'#666'}} />
              <span className="text-[10px] font-mono text-white/40 w-28 shrink-0">{log.eventType}</span>
              <span className="text-[10px] text-white/50 truncate flex-1">{log.message}</span>
              <span className="text-[9px] text-white/20 w-20 shrink-0">{log.user}</span>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-white/5">
          <CyberButton onClick={onNext} size="sm">PROCEED TO EVIDENCE COLLECTION →</CyberButton>
        </div>
      </div>
      {/* Detail panel */}
      <div className="w-80 overflow-y-auto p-4" style={{background:'rgba(0,0,0,0.2)'}}>
        {selectedLog ? (
          <div>
            <p className="text-[9px] tracking-[2px] text-cyan-400/60 mb-3">EVENT DETAILS</p>
            {Object.entries({
              'Event ID': selectedLog.eventId, 'Timestamp': selectedLog.timestamp,
              'Event Type': selectedLog.eventType, 'User': selectedLog.user,
              'Source IP': selectedLog.sourceIp, 'Endpoint': selectedLog.endpoint || '—',
              'Status': String(selectedLog.statusCode || '—'), 'Severity': selectedLog.severity,
              'Result': selectedLog.result, 'Device': selectedLog.device || '—',
              'User Agent': selectedLog.userAgent || '—', 'Action': selectedLog.action || '—',
              'Message': selectedLog.message,
            }).map(([k,v])=>(
              <div key={k} className="flex justify-between py-1.5 border-b border-white/3">
                <span className="text-[9px] text-white/30 uppercase">{k}</span>
                <span className="text-[10px] text-white/60 text-right max-w-[180px] break-all">{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/20 text-center mt-20">Click a log entry to inspect</p>
        )}
      </div>
    </motion.div>
  );
}

// ---- PHASE: EVIDENCE ----
function EvidencePhase({ logs, state, toggleEvidence, onNext }: { logs: SecurityLog[]; state: InvestigationState; toggleEvidence: (id:string,r:boolean)=>void; onNext:()=>void }) {
  const marked = state.markedEvidence.filter(e => e.relevant).length;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-xs font-bold tracking-[2px] text-cyan-400">EVIDENCE COLLECTION</h3>
        <p className="text-[10px] text-white/40 mt-1">Mark events you believe are relevant to the incident. Do NOT mark normal activity.</p>
        <p className="text-[10px] text-white/30 mt-1">Marked as evidence: <span className="text-cyan-400">{marked}</span></p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.map(log => {
          const ev = state.markedEvidence.find(e => e.logId === log.id);
          const isMarked = ev?.relevant;
          return (
            <div key={log.id} className={`flex items-center gap-3 p-2 rounded border transition-all ${isMarked ? 'border-cyan-400/30 bg-cyan-400/5' : 'border-white/5 hover:border-white/10'}`}>
              <button onClick={()=>toggleEvidence(log.id, !isMarked)} className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isMarked ? 'border-cyan-400/50 bg-cyan-400/20 text-cyan-400' : 'border-white/20 text-transparent hover:border-white/40'}`}>
                {isMarked ? '✓' : ''}
              </button>
              <span className="text-[9px] font-mono text-white/25 w-16 shrink-0">{log.timestamp.slice(11)}</span>
              <span className="text-[10px] font-mono text-white/40 w-28 shrink-0">{log.eventType}</span>
              <span className="text-[10px] text-white/50 truncate flex-1">{log.message}</span>
              <span className="text-[9px] text-white/20">{log.sourceIp}</span>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-white/5">
        <CyberButton onClick={onNext} size="sm" disabled={marked < 1}>PROCEED TO TIMELINE →</CyberButton>
      </div>
    </motion.div>
  );
}

// ---- PHASE: TIMELINE ----
function TimelinePhase({ logs, state, toggleTimeline, onNext }: { logs: SecurityLog[]; state: InvestigationState; toggleTimeline: (id:string)=>void; onNext:()=>void }) {
  const evidenceLogs = logs.filter(l => state.markedEvidence.some(e => e.logId === l.id && e.relevant));
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-xs font-bold tracking-[2px] text-cyan-400">BUILD INCIDENT TIMELINE</h3>
        <p className="text-[10px] text-white/40 mt-1">Select events in the order they occurred to reconstruct the attack chain.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Available events */}
          <div>
            <p className="text-[9px] tracking-[2px] text-white/30 mb-2">YOUR EVIDENCE</p>
            <div className="space-y-1">
              {evidenceLogs.map(log => {
                const inTimeline = state.timeline.includes(log.id);
                return (
                  <button key={log.id} onClick={()=>toggleTimeline(log.id)} className={`w-full text-left p-2 rounded border text-[10px] transition-all ${inTimeline ? 'border-purple-400/30 bg-purple-400/5 opacity-50' : 'border-white/5 hover:border-white/20'}`}>
                    <span className="text-white/25 font-mono">{log.timestamp.slice(11)}</span> — <span className="text-white/50">{log.message}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Constructed timeline */}
          <div>
            <p className="text-[9px] tracking-[2px] text-white/30 mb-2">YOUR TIMELINE ({state.timeline.length})</p>
            <div className="space-y-1">
              {state.timeline.map((id, i) => {
                const log = logs.find(l => l.id === id);
                return log ? (
                  <div key={id} className="flex items-center gap-2 p-2 rounded border border-purple-400/20 bg-purple-400/5">
                    <span className="text-[9px] text-purple-400 w-4">{i+1}.</span>
                    <span className="text-[10px] text-white/50 truncate">{log.timestamp.slice(11)} — {log.message}</span>
                    <button onClick={()=>toggleTimeline(id)} className="text-white/20 hover:text-white/50 text-xs ml-auto">✕</button>
                  </div>
                ) : null;
              })}
              {state.timeline.length === 0 && <p className="text-[10px] text-white/15">Click events to add them in order</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-white/5">
        <CyberButton onClick={onNext} size="sm" disabled={state.timeline.length < 2}>PROCEED TO HYPOTHESIS →</CyberButton>
      </div>
    </motion.div>
  );
}

// ---- PHASE: HYPOTHESIS ----
function HypothesisPhase({ hypotheses, state, setState, onNext }: { hypotheses: IncidentScenario['hypotheses']; state: InvestigationState; setState: (fn:any)=>void; onNext:()=>void }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center h-full p-8">
      <div className="max-w-lg w-full">
        <h3 className="text-xs font-bold tracking-[2px] text-cyan-400 mb-2 text-center">WHAT DO YOU THINK HAPPENED?</h3>
        <p className="text-[10px] text-white/40 text-center mb-6">Based on your investigation, select the most likely hypothesis.</p>
        <div className="space-y-2 mb-6">
          {hypotheses.map(h => (
            <button key={h.id} onClick={()=>setState((s:InvestigationState)=>({...s, selectedHypothesis: h.id}))}
              className={`w-full text-left p-4 border rounded transition-all ${state.selectedHypothesis === h.id ? 'border-cyan-400/40 bg-cyan-400/5' : 'border-white/5 hover:border-white/20'}`}>
              <p className="text-xs text-white/70 font-medium">{h.label}</p>
              <p className="text-[10px] text-white/30 mt-1">{h.description}</p>
            </button>
          ))}
        </div>
        <div className="text-center">
          <CyberButton onClick={onNext} size="sm" disabled={!state.selectedHypothesis}>PROCEED TO REMEDIATION →</CyberButton>
        </div>
      </div>
    </motion.div>
  );
}

// ---- PHASE: REMEDIATION ----
function RemediationPhase({ scenario, state, setState, onNext }: { scenario: IncidentScenario; state: InvestigationState; setState: (fn:any)=>void; onNext:()=>void }) {
  const toggle = (id: string) => {
    setState((s:InvestigationState) => ({
      ...s, appliedRemediations: s.appliedRemediations.includes(id)
        ? s.appliedRemediations.filter(r => r !== id)
        : [...s.appliedRemediations, id],
    }));
  };
  const { accountState: acc } = scenario;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex h-full">
      {/* Account info */}
      <div className="w-72 p-4 border-r border-white/5 overflow-y-auto" style={{background:'rgba(0,0,0,0.15)'}}>
        <p className="text-[9px] tracking-[2px] text-white/30 mb-3">AFFECTED ACCOUNT</p>
        <p className="text-sm font-bold text-white/70 mb-4">{acc.user}</p>
        {[
          ['MFA', acc.mfaEnabled ? 'ENABLED' : 'OFF', acc.mfaEnabled ? '#10b981' : '#ef4444'],
          ['Active Sessions', String(acc.activeSessions), acc.activeSessions > 1 ? '#f59e0b' : '#10b981'],
          ['Admin Role', acc.adminRole ? 'ENABLED' : 'DISABLED', acc.adminRole ? '#ef4444' : '#10b981'],
          ['Password Age', `${acc.passwordAgeDays} days`, acc.passwordAgeDays > 90 ? '#f59e0b' : '#10b981'],
          ['Account', acc.accountLocked ? 'LOCKED' : 'ACTIVE', '#06b6d4'],
        ].map(([label, val, color]) => (
          <div key={label as string} className="flex justify-between py-2 border-b border-white/3">
            <span className="text-[10px] text-white/40">{label}</span>
            <span className="text-[10px] font-bold" style={{color: color as string}}>{val}</span>
          </div>
        ))}
      </div>
      {/* Actions */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-xs font-bold tracking-[2px] text-cyan-400">REMEDIATION ACTIONS</h3>
          <p className="text-[10px] text-white/40 mt-1">Select appropriate actions. Unnecessary actions will reduce your score.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {scenario.remediationActions.map(action => {
            const applied = state.appliedRemediations.includes(action.id);
            return (
              <button key={action.id} onClick={()=>toggle(action.id)}
                className={`w-full text-left p-3 border rounded transition-all ${applied ? 'border-cyan-400/40 bg-cyan-400/5' : 'border-white/5 hover:border-white/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${applied ? 'border-cyan-400/50 bg-cyan-400/20 text-cyan-400 text-[10px]' : 'border-white/20'}`}>
                    {applied ? '✓' : ''}
                  </div>
                  <div>
                    <p className="text-xs text-white/70">{action.label}</p>
                    <p className="text-[9px] text-white/30">{action.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/5">
          <CyberButton onClick={onNext} size="sm" disabled={state.appliedRemediations.length < 1}>PROCEED TO QUIZ →</CyberButton>
        </div>
      </div>
    </motion.div>
  );
}

// ---- PHASE: QUIZ ----
function QuizPhase({ questions, state, setState, onSubmit }: { questions: IncidentScenario['quizQuestions']; state: InvestigationState; setState: (fn:any)=>void; onSubmit:()=>void }) {
  const [current, setCurrent] = useState(0);
  const q = questions[current];
  const answered = Object.keys(state.quizAnswers).length;
  const selectAnswer = (qId: string, oId: string) => {
    setState((s:InvestigationState) => ({...s, quizAnswers: {...s.quizAnswers, [qId]: oId}}));
  };
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center h-full p-8">
      <div className="max-w-lg w-full">
        <p className="text-[9px] tracking-[2px] text-white/20 text-center mb-2">QUESTION {current+1} OF {questions.length}</p>
        <h3 className="text-sm text-white/70 text-center mb-6 leading-relaxed">{q.question}</h3>
        <div className="space-y-2 mb-6">
          {q.options.map(o => (
            <button key={o.id} onClick={()=>selectAnswer(q.id, o.id)}
              className={`w-full text-left p-3 border rounded transition-all ${state.quizAnswers[q.id] === o.id ? 'border-cyan-400/40 bg-cyan-400/5' : 'border-white/5 hover:border-white/20'}`}>
              <p className="text-xs text-white/60">{o.label}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          {current > 0 && <CyberButton onClick={()=>setCurrent(current-1)} variant="ghost" size="sm">← PREV</CyberButton>}
          <div className="ml-auto">
            {current < questions.length - 1 ? (
              <CyberButton onClick={()=>setCurrent(current+1)} size="sm" disabled={!state.quizAnswers[q.id]}>NEXT →</CyberButton>
            ) : (
              <CyberButton onClick={onSubmit} size="sm" disabled={answered < questions.length}>SUBMIT INVESTIGATION</CyberButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---- PHASE: REPORT ----
function ReportPhase({ scenario, state, onClose }: { scenario: IncidentScenario; state: InvestigationState; onClose:()=>void }) {
  const { score, report } = state;
  if (!score || !report) return null;
  const sevColors: Record<string,string> = { LOW:'#10b981', MEDIUM:'#f59e0b', HIGH:'#ef4444', CRITICAL:'#ef4444' };
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center h-full p-8 overflow-y-auto">
      <div className="max-w-2xl w-full">
        <h2 className="text-sm font-bold tracking-[3px] text-cyan-400 text-center mb-6">INCIDENT REPORT</h2>
        {/* Score overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            ['EVIDENCE', score.evidenceScore, score.evidenceMax],
            ['TIMELINE', score.timelineScore, score.timelineMax],
            ['REMEDIATION', score.remediationScore, score.remediationMax],
            ['QUIZ', score.quizScore, score.quizMax],
          ].map(([label, val, max]) => (
            <div key={label as string} className="text-center p-3 border border-white/5 rounded">
              <p className="text-lg font-bold text-cyan-400">{val as number}</p>
              <p className="text-[8px] text-white/20">/ {max as number}</p>
              <p className="text-[8px] tracking-[1px] text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="text-center p-4 border border-cyan-400/20 rounded bg-cyan-400/5 mb-6">
          <p className="text-3xl font-bold text-cyan-400">{score.accuracy}%</p>
          <p className="text-[9px] text-white/30 tracking-[2px] mt-1">ACCURACY</p>
          <p className="text-xs text-white/50 mt-2">+{score.xpEarned} XP EARNED</p>
        </div>
        {/* Details */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-[10px]">
          <div className="p-3 border border-white/5 rounded">
            <span className="text-white/30">Hypothesis:</span>
            <span className={`ml-2 ${report.hypothesisCorrect ? 'text-green-400' : 'text-red-400'}`}>{report.hypothesis}</span>
          </div>
          <div className="p-3 border border-white/5 rounded">
            <span className="text-white/30">Final Risk:</span>
            <span className="ml-2 font-bold" style={{color: sevColors[report.finalRisk]}}>{report.finalRisk}</span>
          </div>
          <div className="p-3 border border-white/5 rounded">
            <span className="text-white/30">Evidence:</span>
            <span className="ml-2 text-white/60">{report.evidenceIdentified}/{report.evidenceTotal} found, {report.incorrectEvidence} incorrect</span>
          </div>
          <div className="p-3 border border-white/5 rounded">
            <span className="text-white/30">Quiz:</span>
            <span className="ml-2 text-white/60">{report.quizCorrect}/{report.quizTotal} correct</span>
          </div>
        </div>
        {/* Explanation */}
        <div className="p-4 border border-white/5 rounded mb-6" style={{background:'rgba(0,240,255,0.02)'}}>
          <p className="text-[9px] tracking-[2px] text-cyan-400/60 mb-2">WHY THIS MATTERED</p>
          <p className="text-xs text-white/50 leading-relaxed">{scenario.explanation}</p>
        </div>
        <div className="text-center">
          <CyberButton onClick={onClose}>RETURN TO CYBERVERSE</CyberButton>
        </div>
      </div>
    </motion.div>
  );
}
