// ============================================================
// CYBERVERSE — Investigation System Type Definitions
// ============================================================

export interface SecurityLog {
  id: string;
  timestamp: string;
  eventId: string;
  eventType: EventType;
  user: string;
  sourceIp: string;
  destination?: string;
  endpoint?: string;
  httpMethod?: string;
  statusCode?: number;
  severity: Severity;
  action?: string;
  device?: string;
  userAgent?: string;
  result: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'PENDING';
  message: string;
  // Internal flags (never shown to user)
  _isSuspicious: boolean;
  _evidenceTag?: string;
}

export type EventType =
  | 'AUTH_FAILURE'
  | 'AUTH_SUCCESS'
  | 'AUTH_LOCKOUT'
  | 'PRIVILEGE_CHANGE'
  | 'SESSION_CREATE'
  | 'SESSION_DESTROY'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGE'
  | 'MFA_CHALLENGE'
  | 'MFA_BYPASS'
  | 'DATA_ACCESS'
  | 'DATA_EXPORT'
  | 'FIREWALL_ALLOW'
  | 'FIREWALL_BLOCK'
  | 'HTTP_REQUEST'
  | 'DNS_QUERY'
  | 'DEVICE_REGISTER'
  | 'DEVICE_REMOVE'
  | 'CONFIG_CHANGE'
  | 'ALERT_TRIGGER'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'FILE_ACCESS'
  | 'FILE_DOWNLOAD'
  | 'NETWORK_SCAN'
  | 'PORT_SCAN';

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EvidenceItem {
  id: string;
  logId: string;
  label: string;
  description: string;
  category: 'authentication' | 'authorization' | 'network' | 'data' | 'device' | 'policy';
}

export interface TimelineEvent {
  id: string;
  logId: string;
  timestamp: string;
  label: string;
  order: number;
}

export interface Hypothesis {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
}

export interface RemediationAction {
  id: string;
  label: string;
  description: string;
  isAppropriate: boolean;
  pointsCorrect: number;
  pointsIncorrect: number;
  category: 'access' | 'authentication' | 'network' | 'monitoring' | 'documentation';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: string;
  points: number;
}

export interface AccountState {
  user: string;
  mfaEnabled: boolean;
  activeSessions: number;
  adminRole: boolean;
  passwordAgeDays: number;
  accountLocked: boolean;
  lastLogin: string;
  suspiciousSessionIds: string[];
}

export interface ScoreBreakdown {
  evidenceScore: number;
  evidenceMax: number;
  timelineScore: number;
  timelineMax: number;
  hypothesisScore: number;
  hypothesisMax: number;
  remediationScore: number;
  remediationMax: number;
  quizScore: number;
  quizMax: number;
  totalScore: number;
  totalMax: number;
  accuracy: number;
  xpEarned: number;
}

export interface IncidentReport {
  scenarioId: string;
  scenarioTitle: string;
  analyst: string;
  timestamp: string;
  evidenceIdentified: number;
  evidenceTotal: number;
  evidenceMissed: number;
  incorrectEvidence: number;
  timelineAccuracy: number;
  hypothesis: string;
  hypothesisCorrect: boolean;
  remediationsApplied: string[];
  remediationsCorrect: number;
  remediationsUnnecessary: number;
  quizCorrect: number;
  quizTotal: number;
  finalRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: ScoreBreakdown;
}

export interface IncidentScenario {
  id: string;
  title: string;
  briefing: string;
  objective: string;
  category: 'account-takeover' | 'privilege-escalation' | 'web-attack' | 'suspicious-login' | 'compromised-device' | 'data-breach';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  // Data
  logs: SecurityLog[];
  expectedEvidence: string[]; // log IDs that are suspicious
  correctTimelineOrder: string[]; // log IDs in correct order
  hypotheses: Hypothesis[];
  accountState: AccountState;
  remediationActions: RemediationAction[];
  quizQuestions: QuizQuestion[];
  // Learning
  conceptsTaught: string[];
  explanation: string;
}

export interface InvestigationState {
  scenarioId: string;
  phase: InvestigationPhase;
  // User actions
  markedEvidence: { logId: string; relevant: boolean }[];
  timeline: string[]; // log IDs in user-constructed order
  selectedHypothesis: string | null;
  appliedRemediations: string[];
  quizAnswers: Record<string, string>; // questionId → answerId
  // Calculated
  score: ScoreBreakdown | null;
  report: IncidentReport | null;
  startedAt: string;
  completedAt: string | null;
}

export type InvestigationPhase =
  | 'briefing'
  | 'investigate'
  | 'evidence'
  | 'timeline'
  | 'hypothesis'
  | 'remediation'
  | 'quiz'
  | 'report';

export type CyberRank =
  | 'CYBER CADET'
  | 'CYBER SCOUT'
  | 'CYBER DEFENDER'
  | 'SECURITY SPECIALIST'
  | 'CYBER GUARDIAN'
  | 'ELITE CYBER DEFENDER';

export interface UserProgress {
  xp: number;
  rank: CyberRank;
  investigationsCompleted: string[];
  investigationScores: Record<string, ScoreBreakdown>;
  totalEvidenceCollected: number;
  totalRemediationsApplied: number;
  totalQuizCorrect: number;
  conceptsLearned: string[];
  achievements: string[];
}

export function getRank(xp: number): CyberRank {
  if (xp >= 2000) return 'ELITE CYBER DEFENDER';
  if (xp >= 1500) return 'CYBER GUARDIAN';
  if (xp >= 1000) return 'SECURITY SPECIALIST';
  if (xp >= 600) return 'CYBER DEFENDER';
  if (xp >= 300) return 'CYBER SCOUT';
  return 'CYBER CADET';
}
