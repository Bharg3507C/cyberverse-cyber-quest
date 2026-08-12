import { IncidentScenario, InvestigationState, ScoreBreakdown, IncidentReport } from './types';

export function calculateScore(scenario: IncidentScenario, state: InvestigationState): ScoreBreakdown {
  // Evidence scoring
  const correctEvidence = state.markedEvidence.filter(e => e.relevant && scenario.expectedEvidence.includes(e.logId));
  const incorrectEvidence = state.markedEvidence.filter(e => e.relevant && !scenario.expectedEvidence.includes(e.logId));
  const missedEvidence = scenario.expectedEvidence.filter(id => !state.markedEvidence.some(e => e.logId === id && e.relevant));
  const evidenceScore = Math.max(0, correctEvidence.length * 15 - incorrectEvidence.length * 10);
  const evidenceMax = scenario.expectedEvidence.length * 15;

  // Timeline scoring
  const correctOrder = scenario.correctTimelineOrder;
  const userTimeline = state.timeline;
  let timelineMatches = 0;
  userTimeline.forEach((id, i) => { if (correctOrder.includes(id)) timelineMatches++; });
  const timelineScore = Math.round((timelineMatches / Math.max(1, correctOrder.length)) * 60);
  const timelineMax = 60;

  // Hypothesis
  const hyp = scenario.hypotheses.find(h => h.id === state.selectedHypothesis);
  const hypothesisScore = hyp?.isCorrect ? 40 : -20;
  const hypothesisMax = 40;

  // Remediation
  let remediationScore = 0;
  state.appliedRemediations.forEach(rId => {
    const action = scenario.remediationActions.find(a => a.id === rId);
    if (action) {
      remediationScore += action.isAppropriate ? action.pointsCorrect : action.pointsIncorrect;
    }
  });
  const remediationMax = scenario.remediationActions.filter(a => a.isAppropriate).reduce((s, a) => s + a.pointsCorrect, 0);

  // Quiz
  let quizScore = 0;
  scenario.quizQuestions.forEach(q => {
    const userAnswer = state.quizAnswers[q.id];
    const correct = q.options.find(o => o.isCorrect);
    if (userAnswer === correct?.id) quizScore += q.points;
  });
  const quizMax = scenario.quizQuestions.reduce((s, q) => s + q.points, 0);

  const totalScore = Math.max(0, evidenceScore + timelineScore + hypothesisScore + remediationScore + quizScore);
  const totalMax = evidenceMax + timelineMax + hypothesisMax + remediationMax + quizMax;
  const accuracy = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const xpEarned = Math.round(totalScore * 0.8);

  return { evidenceScore, evidenceMax, timelineScore, timelineMax, hypothesisScore, hypothesisMax, remediationScore, remediationMax, quizScore, quizMax, totalScore, totalMax, accuracy, xpEarned };
}

export function generateReport(scenario: IncidentScenario, state: InvestigationState, score: ScoreBreakdown): IncidentReport {
  const correctEvidence = state.markedEvidence.filter(e => e.relevant && scenario.expectedEvidence.includes(e.logId));
  const incorrectEvidence = state.markedEvidence.filter(e => e.relevant && !scenario.expectedEvidence.includes(e.logId));
  const missed = scenario.expectedEvidence.length - correctEvidence.length;
  const hyp = scenario.hypotheses.find(h => h.id === state.selectedHypothesis);
  const correctRemediations = state.appliedRemediations.filter(rId => scenario.remediationActions.find(a => a.id === rId)?.isAppropriate);
  const unnecessaryRemediations = state.appliedRemediations.filter(rId => !scenario.remediationActions.find(a => a.id === rId)?.isAppropriate);
  const quizCorrect = scenario.quizQuestions.filter(q => { const c = q.options.find(o => o.isCorrect); return state.quizAnswers[q.id] === c?.id; }).length;

  return {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    analyst: 'Analyst',
    timestamp: new Date().toISOString(),
    evidenceIdentified: correctEvidence.length,
    evidenceTotal: scenario.expectedEvidence.length,
    evidenceMissed: missed,
    incorrectEvidence: incorrectEvidence.length,
    timelineAccuracy: score.timelineMax > 0 ? Math.round((score.timelineScore / score.timelineMax) * 100) : 0,
    hypothesis: hyp?.label || 'Not submitted',
    hypothesisCorrect: hyp?.isCorrect || false,
    remediationsApplied: state.appliedRemediations.map(rId => scenario.remediationActions.find(a => a.id === rId)?.label || rId),
    remediationsCorrect: correctRemediations.length,
    remediationsUnnecessary: unnecessaryRemediations.length,
    quizCorrect,
    quizTotal: scenario.quizQuestions.length,
    finalRisk: score.accuracy >= 80 ? 'LOW' : score.accuracy >= 60 ? 'MEDIUM' : score.accuracy >= 40 ? 'HIGH' : 'CRITICAL',
    score,
  };
}
