// CYBERVERSE — XP & Leveling System

import { CyberRank, getRank } from './types';

export interface LevelInfo {
  level: number;
  rank: CyberRank;
  title: string;
  xpRequired: number;
  xpNext: number;
  progress: number; // 0-100
}

const LEVELS: { xp: number; level: number; title: string }[] = [
  { xp: 0, level: 1, title: 'Rookie' },
  { xp: 100, level: 2, title: 'Trainee' },
  { xp: 250, level: 3, title: 'Junior Analyst' },
  { xp: 450, level: 4, title: 'Analyst' },
  { xp: 700, level: 5, title: 'Senior Analyst' },
  { xp: 1000, level: 6, title: 'Defender' },
  { xp: 1350, level: 7, title: 'Cyber Investigator' },
  { xp: 1750, level: 8, title: 'Security Specialist' },
  { xp: 2200, level: 9, title: 'Cyber Guardian' },
  { xp: 2800, level: 10, title: 'Elite Defender' },
];

export function getLevelInfo(xp: number): LevelInfo {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }

  const xpInLevel = xp - currentLevel.xp;
  const xpNeeded = nextLevel.xp - currentLevel.xp;
  const progress = xpNeeded > 0 ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  return {
    level: currentLevel.level,
    rank: getRank(xp),
    title: currentLevel.title,
    xpRequired: currentLevel.xp,
    xpNext: nextLevel.xp,
    progress,
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'investigation' | 'phishing' | 'network' | 'iot' | 'web' | 'mastery';
}

export const ALL_BADGES: Badge[] = [
  { id: 'phishing-hunter', title: 'PHISHING HUNTER', description: 'Completed phishing investigation', icon: '🎣', category: 'phishing' },
  { id: 'log-detective', title: 'LOG DETECTIVE', description: 'Identified suspicious event in logs', icon: '🔍', category: 'investigation' },
  { id: 'iot-defender', title: 'IoT DEFENDER', description: 'Secured all smart home devices', icon: '🏠', category: 'iot' },
  { id: 'network-guardian', title: 'NETWORK GUARDIAN', description: 'Completed network security missions', icon: '🌐', category: 'network' },
  { id: 'web-guardian', title: 'WEB GUARDIAN', description: 'Completed Web City labs', icon: '🛡️', category: 'web' },
  { id: 'incident-responder', title: 'INCIDENT RESPONDER', description: 'Successfully contained an incident', icon: '🚨', category: 'investigation' },
  { id: 'cyberverse-master', title: 'CYBERVERSE MASTER', description: 'Completed all major worlds', icon: '⭐', category: 'mastery' },
  { id: 'first-investigation', title: 'FIRST INVESTIGATION', description: 'Completed first security investigation', icon: '📋', category: 'investigation' },
];
