'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface EmailEvidence {
  id: string;
  category: string;
  label: string;
  value: string;
  suspicious: boolean;
}

interface PhishingScenario {
  id: number;
  sender: string;
  senderEmail: string;
  replyTo: string;
  subject: string;
  body: string;
  url: string;
  urlDisplay: string;
  attachment?: string;
  spf: 'PASS' | 'FAIL' | 'SOFTFAIL';
  dkim: 'PASS' | 'FAIL';
  domainAge: string;
  isPhishing: boolean;
  evidence: EmailEvidence[];
  explanation: string;
}

const SCENARIOS: PhishingScenario[] = [
  {
    id: 1,
    sender: 'SecurePay Support',
    senderEmail: 'support@secure-pay.com',
    replyTo: 'support@secure-pay-security.example',
    subject: 'Urgent: Verify Your Account Immediately',
    body: 'Dear Customer, We detected suspicious activity on your account. Your account will be permanently suspended unless you verify your identity within 24 hours. Click below to verify now.',
    url: 'https://secure-pay.verify-account.example/login',
    urlDisplay: 'Verify My Account',
    attachment: 'verification_form.exe',
    spf: 'FAIL',
    dkim: 'FAIL',
    domainAge: '3 days',
    isPhishing: true,
    evidence: [
      { id: 'e1', category: 'SENDER', label: 'Reply-To mismatch', value: 'Reply-To differs from sender domain', suspicious: true },
      { id: 'e2', category: 'URL', label: 'Domain mismatch', value: 'URL domain does not match sender', suspicious: true },
      { id: 'e3', category: 'AUTH', label: 'SPF FAIL', value: 'Email failed sender verification', suspicious: true },
      { id: 'e4', category: 'AUTH', label: 'DKIM FAIL', value: 'Email signature invalid', suspicious: true },
      { id: 'e5', category: 'CONTENT', label: 'Urgency tactics', value: '24-hour deadline threat', suspicious: true },
      { id: 'e6', category: 'ATTACHMENT', label: 'Executable file', value: '.exe attachment disguised as form', suspicious: true },
      { id: 'e7', category: 'DOMAIN', label: 'New domain', value: 'Domain registered 3 days ago', suspicious: true },
      { id: 'e8', category: 'CONTENT', label: 'Generic greeting', value: 'No personalization', suspicious: true },
    ],
    explanation: 'SPF and DKIM both failed, reply-to mismatches sender, URL redirects to a different domain, executable attachment, and domain is only 3 days old. Classic credential harvesting.',
  },
  {
    id: 2,
    sender: 'IT Department',
    senderEmail: 'it-notifications@yourcompany.com',
    replyTo: 'it-notifications@yourcompany.com',
    subject: 'Scheduled Maintenance — Saturday 10PM',
    body: 'Hi team, Routine maintenance is scheduled for Saturday 10PM to 2AM. No action required. Services may be briefly unavailable. Contact helpdesk for questions.',
    url: 'https://intranet.yourcompany.com/maintenance',
    urlDisplay: 'View Schedule',
    spf: 'PASS',
    dkim: 'PASS',
    domainAge: '8 years',
    isPhishing: false,
    evidence: [
      { id: 'e1', category: 'AUTH', label: 'SPF PASS', value: 'Sender verified', suspicious: false },
      { id: 'e2', category: 'AUTH', label: 'DKIM PASS', value: 'Signature valid', suspicious: false },
      { id: 'e3', category: 'DOMAIN', label: 'Established domain', value: '8 years old', suspicious: false },
      { id: 'e4', category: 'CONTENT', label: 'No action required', value: 'Informational only', suspicious: false },
      { id: 'e5', category: 'URL', label: 'Domain matches', value: 'Internal company URL', suspicious: false },
    ],
    explanation: 'Legitimate internal communication: SPF/DKIM pass, established domain, no urgency, no credentials requested, internal URL.',
  },
  {
    id: 3,
    sender: 'Netflix',
    senderEmail: 'billing@netf1ix-update.example',
    replyTo: 'no-reply@netf1ix-update.example',
    subject: 'Payment Failed — Update Card Now',
    body: 'We could not process your monthly payment. Your account will be suspended in 2 hours unless you update your payment method immediately.',
    url: 'http://netf1ix-update.example/billing/update-card',
    urlDisplay: 'Update Payment',
    spf: 'SOFTFAIL',
    dkim: 'FAIL',
    domainAge: '12 days',
    isPhishing: true,
    evidence: [
      { id: 'e1', category: 'SENDER', label: 'Typosquatting', value: 'netf1ix (number 1 instead of l)', suspicious: true },
      { id: 'e2', category: 'AUTH', label: 'DKIM FAIL', value: 'Not signed by netflix.com', suspicious: true },
      { id: 'e3', category: 'AUTH', label: 'SPF SOFTFAIL', value: 'Sender not authorized', suspicious: true },
      { id: 'e4', category: 'URL', label: 'HTTP not HTTPS', value: 'Insecure connection', suspicious: true },
      { id: 'e5', category: 'CONTENT', label: 'Time pressure', value: '2-hour deadline', suspicious: true },
      { id: 'e6', category: 'DOMAIN', label: 'New domain', value: 'Only 12 days old', suspicious: true },
    ],
    explanation: 'Typosquatting domain (netf1ix), DKIM failure proves it\'s not from Netflix, HTTP link (not HTTPS), extreme time pressure, and new domain.',
  },
  {
    id: 4,
    sender: 'HR Team',
    senderEmail: 'hr@yourcompany.com',
    replyTo: 'hr@yourcompany.com',
    subject: 'Updated Holiday Calendar 2026',
    body: 'Please find the updated holiday calendar for 2026 attached. Reach out to your HR representative with questions.',
    url: 'https://hr.yourcompany.com/calendar/2026',
    urlDisplay: 'View Calendar',
    attachment: 'Holiday_Calendar_2026.pdf',
    spf: 'PASS',
    dkim: 'PASS',
    domainAge: '8 years',
    isPhishing: false,
    evidence: [
      { id: 'e1', category: 'AUTH', label: 'SPF PASS', value: 'Verified sender', suspicious: false },
      { id: 'e2', category: 'AUTH', label: 'DKIM PASS', value: 'Valid signature', suspicious: false },
      { id: 'e3', category: 'ATTACHMENT', label: 'PDF format', value: 'Standard document type', suspicious: false },
      { id: 'e4', category: 'CONTENT', label: 'Expected communication', value: 'Normal HR process', suspicious: false },
      { id: 'e5', category: 'DOMAIN', label: 'Company domain', value: 'Matches known sender', suspicious: false },
    ],
    explanation: 'Legitimate HR email: SPF/DKIM pass, company domain, expected PDF attachment, no urgency, no credentials requested.',
  },
  {
    id: 5,
    sender: 'Microsoft 365',
    senderEmail: 'security@m1cr0soft-alert.example',
    replyTo: 'verify@m1cr0soft-alert.example',
    subject: 'Unusual Sign-in Activity Detected',
    body: 'Someone signed into your account from an unrecognized device in Russia. If this wasn\'t you, secure your account immediately by clicking below.',
    url: 'http://m1cr0soft-alert.example/security/verify',
    urlDisplay: 'Secure My Account',
    spf: 'FAIL',
    dkim: 'FAIL',
    domainAge: '1 day',
    isPhishing: true,
    evidence: [
      { id: 'e1', category: 'SENDER', label: 'Fake domain', value: 'm1cr0soft (numbers replacing letters)', suspicious: true },
      { id: 'e2', category: 'AUTH', label: 'SPF FAIL', value: 'Not authorized sender', suspicious: true },
      { id: 'e3', category: 'AUTH', label: 'DKIM FAIL', value: 'Invalid signature', suspicious: true },
      { id: 'e4', category: 'URL', label: 'HTTP not HTTPS', value: 'No encryption', suspicious: true },
      { id: 'e5', category: 'DOMAIN', label: 'Brand new domain', value: 'Registered yesterday', suspicious: true },
      { id: 'e6', category: 'CONTENT', label: 'Fear tactics', value: 'Foreign sign-in scare', suspicious: true },
    ],
    explanation: 'Impersonation attack: fake Microsoft domain with character substitution, both SPF/DKIM fail, 1-day-old domain, HTTP link, fear-based urgency.',
  },
];

type InspectTab = 'overview' | 'headers' | 'url' | 'content';

export default function CyberCafe() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, unlockAchievement, addXp } = useCyberStore();
  const [current, setCurrent] = useState(0);
  const [tab, setTab] = useState<InspectTab>('overview');
  const [foundEvidence, setFoundEvidence] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [verdict, setVerdict] = useState<'safe' | 'suspicious' | 'phishing' | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[current];
  const totalSuspicious = scenario.evidence.filter(e => e.suspicious).length;

  const toggleEvidence = (id: string) => {
    if (submitted) return;
    setFoundEvidence(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmitVerdict = () => {
    if (!verdict) return;
    setSubmitted(true);

    // Score: classification + evidence + response
    let pts = 0;
    const correctClassification = (scenario.isPhishing && verdict === 'phishing') || (!scenario.isPhishing && verdict === 'safe');
    if (correctClassification) pts += 100;
    else if (!scenario.isPhishing && verdict === 'suspicious') pts += 40; // partial credit

    const correctEvidence = foundEvidence.filter(id => scenario.evidence.find(e => e.id === id)?.suspicious === scenario.isPhishing);
    pts += correctEvidence.length * 50;

    const incorrectEvidence = foundEvidence.filter(id => scenario.evidence.find(e => e.id === id)?.suspicious !== scenario.isPhishing);
    pts -= incorrectEvidence.length * 20;

    // Response scoring
    if (scenario.isPhishing && response === 'report') pts += 50;
    else if (scenario.isPhishing && response === 'delete') pts += 25;
    else if (!scenario.isPhishing && response === 'open') pts += 50;

    setScores([...scores, Math.max(0, pts)]);
    addXp(Math.max(0, Math.round(pts * 0.3)));
  };

  const handleNext = () => {
    if (current < SCENARIOS.length - 1) {
      setCurrent(current + 1);
      setTab('overview');
      setFoundEvidence([]);
      setSubmitted(false);
      setVerdict(null);
      setResponse(null);
    } else {
      learnConcept('Phishing Analysis');
      learnConcept('Email Authentication (SPF/DKIM)');
      learnConcept('Social Engineering');
      learnConcept('Domain Analysis');
      completeSimulation('phishing-investigation');
      completeLocation('cyber-cafe');
      const totalScore = scores.reduce((a, b) => a + b, 0);
      if (totalScore > 800) unlockAchievement('phishing-detective');
      setCompleted(true);
    }
  };

  if (completed) {
    const totalPts = scores.reduce((a, b) => a + b, 0);
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1a1400 0%, #060912 100%)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
          <HolographicPanel title="PHISHING INVESTIGATION COMPLETE" onClose={() => setActiveLocation(null)} size="md">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400 mb-2">{totalPts} PTS</p>
              <p className="text-xs text-white/50 mb-4">{SCENARIOS.length} emails investigated</p>
              <p className="text-[10px] text-white/30 mb-6">Skills: Phishing Analysis • SPF/DKIM • Domain Inspection • Social Engineering Detection</p>
              <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">Return to City</CyberButton>
            </div>
          </HolographicPanel>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1a1400 0%, #060912 100%)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-4xl">
        <HolographicPanel title="CYBER CAFE — EMAIL INVESTIGATION" subtitle={`Email ${current + 1}/${SCENARIOS.length}`} onClose={() => setActiveLocation(null)} size="full" variant="warning">

          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {(['overview', 'headers', 'url', 'content'] as InspectTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-[10px] tracking-[1px] uppercase rounded transition-all ${tab === t ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400' : 'border border-white/5 text-white/40 hover:text-white/60'}`}>
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {tab === 'overview' && (
                <div className="border border-white/5 rounded p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="space-y-2 text-xs mb-3">
                    <div className="flex gap-2"><span className="text-white/30 w-14">FROM:</span><span className="text-white/70">{scenario.sender} &lt;{scenario.senderEmail}&gt;</span></div>
                    <div className="flex gap-2"><span className="text-white/30 w-14">SUBJ:</span><span className="text-white/70">{scenario.subject}</span></div>
                  </div>
                  <div className="border-t border-white/5 pt-3 text-xs text-white/60 leading-relaxed">{scenario.body}</div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                    <span className="text-[10px] px-2 py-1 border border-white/10 text-white/40 rounded">🔗 {scenario.urlDisplay}</span>
                    {scenario.attachment && <span className="text-[10px] px-2 py-1 border border-white/10 text-white/40 rounded">📎 {scenario.attachment}</span>}
                  </div>
                </div>
              )}

              {tab === 'headers' && (
                <div className="border border-white/5 rounded p-4 mb-4 space-y-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <p className="text-[9px] tracking-[2px] text-white/30 mb-2">EMAIL AUTHENTICATION</p>
                  {[
                    ['Reply-To', scenario.replyTo],
                    ['SPF', scenario.spf],
                    ['DKIM', scenario.dkim],
                    ['Domain Age', scenario.domainAge],
                    ['Sender Domain', scenario.senderEmail.split('@')[1]],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-white/3">
                      <span className="text-[10px] text-white/40">{k}</span>
                      <span className={`text-[10px] font-mono ${v === 'FAIL' || v === 'SOFTFAIL' ? 'text-red-400' : v === 'PASS' ? 'text-green-400' : 'text-white/60'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'url' && (
                <div className="border border-white/5 rounded p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <p className="text-[9px] tracking-[2px] text-white/30 mb-2">URL ANALYSIS</p>
                  <p className="text-xs font-mono text-white/60 break-all p-2 bg-black/30 rounded">{scenario.url}</p>
                  <div className="mt-3 space-y-1 text-[10px]">
                    <div className="flex justify-between"><span className="text-white/30">Protocol</span><span className={scenario.url.startsWith('https') ? 'text-green-400' : 'text-red-400'}>{scenario.url.startsWith('https') ? 'HTTPS ✓' : 'HTTP ✗'}</span></div>
                    <div className="flex justify-between"><span className="text-white/30">Domain</span><span className="text-white/60">{new URL(scenario.url).hostname}</span></div>
                    <div className="flex justify-between"><span className="text-white/30">Matches Sender?</span><span className={scenario.url.includes(scenario.senderEmail.split('@')[1]) ? 'text-green-400' : 'text-yellow-400'}>{scenario.url.includes(scenario.senderEmail.split('@')[1]) ? 'YES' : 'NO — DIFFERENT DOMAIN'}</span></div>
                  </div>
                </div>
              )}

              {tab === 'content' && (
                <div className="border border-white/5 rounded p-4 mb-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <p className="text-[9px] tracking-[2px] text-white/30 mb-2">CONTENT ANALYSIS</p>
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between"><span className="text-white/30">Urgency Language</span><span className={scenario.isPhishing ? 'text-yellow-400' : 'text-green-400'}>{scenario.body.match(/immediate|urgent|suspend|within \d+/i) ? 'DETECTED' : 'NONE'}</span></div>
                    <div className="flex justify-between"><span className="text-white/30">Credential Request</span><span className={scenario.url.includes('verify') || scenario.url.includes('login') || scenario.url.includes('update') ? 'text-yellow-400' : 'text-green-400'}>{scenario.url.includes('verify') || scenario.url.includes('login') ? 'YES' : 'NO'}</span></div>
                    <div className="flex justify-between"><span className="text-white/30">Personalization</span><span className={scenario.body.includes('Dear Customer') || scenario.body.includes('Dear ') ? 'text-yellow-400' : 'text-green-400'}>{scenario.body.includes('Dear Customer') ? 'GENERIC' : 'PRESENT'}</span></div>
                    {scenario.attachment && <div className="flex justify-between"><span className="text-white/30">Attachment Type</span><span className={scenario.attachment.endsWith('.exe') ? 'text-red-400' : 'text-green-400'}>{scenario.attachment.split('.').pop()?.toUpperCase()}</span></div>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Evidence marking */}
          {!submitted && (
            <div className="mb-4">
              <p className="text-[9px] tracking-[2px] text-white/30 mb-2">MARK SUSPICIOUS EVIDENCE ({foundEvidence.length} selected)</p>
              <div className="grid grid-cols-2 gap-1">
                {scenario.evidence.map(ev => (
                  <button key={ev.id} onClick={() => toggleEvidence(ev.id)} className={`text-left p-2 rounded border text-[10px] transition-all ${foundEvidence.includes(ev.id) ? 'border-cyan-400/30 bg-cyan-400/5' : 'border-white/5 hover:border-white/20'}`}>
                    <span className="text-white/30">[{ev.category}]</span> <span className="text-white/50">{ev.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verdict + Response */}
          {!submitted ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['safe', 'suspicious', 'phishing'] as const).map(v => (
                  <button key={v} onClick={() => setVerdict(v)} className={`flex-1 py-2 text-[10px] uppercase tracking-[2px] border rounded transition-all ${verdict === v ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400' : 'border-white/10 text-white/40 hover:border-white/30'}`}>
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <p className="text-[9px] text-white/30 self-center mr-2">RESPONSE:</p>
                {['report', 'delete', 'open', 'reply'].map(r => (
                  <button key={r} onClick={() => setResponse(r)} className={`px-3 py-1.5 text-[9px] uppercase border rounded transition-all ${response === r ? 'border-purple-400/40 bg-purple-400/10 text-purple-400' : 'border-white/10 text-white/30 hover:border-white/20'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <CyberButton onClick={handleSubmitVerdict} size="sm" disabled={!verdict || !response}>Submit Analysis</CyberButton>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`p-3 rounded border mb-3 ${(scenario.isPhishing && verdict === 'phishing') || (!scenario.isPhishing && verdict === 'safe') ? 'border-green-400/30 bg-green-400/5' : 'border-red-400/30 bg-red-400/5'}`}>
                <p className="text-xs text-white/60">{scenario.explanation}</p>
              </div>
              <CyberButton onClick={handleNext} size="sm">{current < SCENARIOS.length - 1 ? 'Next Email →' : 'Complete Investigation'}</CyberButton>
            </motion.div>
          )}
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
