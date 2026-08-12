// ============================================================
// CYBERVERSE — Core State Management
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 'landing' | 'world-map' | 'cyber-city' | 'location' | 'portfolio';

export type LocationId = 
  | 'cyber-plaza'
  | 'cyberbank'
  | 'digital-life-centre'
  | 'cyber-cafe'
  | 'smarthome-district'
  | 'network-tower'
  | 'security-hq'
  | 'digital-transit'
  | 'corporate-tower'
  | 'incident-alley';

export type WorldId = 
  | 'cyber-city'
  | 'password-kingdom'
  | 'network-jungle'
  | 'web-city'
  | 'malware-swamp'
  | 'forensics-island'
  | 'soc-station'
  | 'cloud-kingdom'
  | 'ai-lab'
  | 'glitch-citadel';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface LocationData {
  id: LocationId;
  name: string;
  description: string;
  topic: string;
  explored: boolean;
  completed: boolean;
  position: [number, number, number];
  color: string;
}

interface CyberStore {
  // Navigation
  screen: Screen;
  setScreen: (s: Screen) => void;
  
  // Current location
  activeLocation: LocationId | null;
  setActiveLocation: (loc: LocationId | null) => void;
  
  // Progress
  locationsExplored: LocationId[];
  locationsCompleted: LocationId[];
  conceptsLearned: string[];
  simulationsCompleted: string[];
  securityScore: number;
  xp: number;
  addXp: (amount: number) => void;
  
  exploreLocation: (loc: LocationId) => void;
  completeLocation: (loc: LocationId) => void;
  learnConcept: (concept: string) => void;
  completeSimulation: (sim: string) => void;
  updateSecurityScore: (score: number) => void;
  
  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  
  // Settings
  musicEnabled: boolean;
  reducedMotion: boolean;
  toggleMusic: () => void;
  toggleReducedMotion: () => void;
  
  // Camera
  cameraTarget: [number, number, number] | null;
  setCameraTarget: (target: [number, number, number] | null) => void;
  
  // Transition
  isTransitioning: boolean;
  setTransitioning: (t: boolean) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-discovery', title: 'FIRST DISCOVERY', description: 'Explore your first location', unlocked: false },
  { id: 'phishing-detective', title: 'PHISHING DETECTIVE', description: 'Identify 5 phishing clues', unlocked: false },
  { id: 'privacy-aware', title: 'PRIVACY AWARE', description: 'Complete Digital Life Centre', unlocked: false },
  { id: 'secure-home', title: 'SECURE HOME', description: 'Secure every smart-home device', unlocked: false },
  { id: 'network-navigator', title: 'NETWORK NAVIGATOR', description: 'Explore the Network Tower', unlocked: false },
  { id: 'incident-investigator', title: 'INCIDENT INVESTIGATOR', description: 'Complete Incident Alley', unlocked: false },
  { id: 'city-explorer', title: 'CITY EXPLORER', description: 'Explore all 10 locations', unlocked: false },
  { id: 'cyber-defender', title: 'CYBER DEFENDER', description: 'Reach 90% security score', unlocked: false },
];

export const useCyberStore = create<CyberStore>()(
  persist(
    (set, get) => ({
      screen: 'landing',
      setScreen: (s) => set({ screen: s }),
      
      activeLocation: null,
      setActiveLocation: (loc) => set({ activeLocation: loc, screen: loc ? 'location' : 'cyber-city' }),
      
      locationsExplored: [],
      locationsCompleted: [],
      conceptsLearned: [],
      simulationsCompleted: [],
      securityScore: 0,
      xp: 0,
      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
      
      exploreLocation: (loc) => {
        const state = get();
        if (!state.locationsExplored.includes(loc)) {
          const newExplored = [...state.locationsExplored, loc];
          set({ locationsExplored: newExplored });
          // First discovery achievement
          if (newExplored.length === 1) {
            get().unlockAchievement('first-discovery');
          }
          if (newExplored.length === 10) {
            get().unlockAchievement('city-explorer');
          }
        }
      },
      
      completeLocation: (loc) => {
        const state = get();
        if (!state.locationsCompleted.includes(loc)) {
          set({ locationsCompleted: [...state.locationsCompleted, loc] });
        }
      },
      
      learnConcept: (concept) => {
        const state = get();
        if (!state.conceptsLearned.includes(concept)) {
          set({ conceptsLearned: [...state.conceptsLearned, concept] });
        }
      },
      
      completeSimulation: (sim) => {
        const state = get();
        if (!state.simulationsCompleted.includes(sim)) {
          set({ simulationsCompleted: [...state.simulationsCompleted, sim] });
        }
      },
      
      updateSecurityScore: (score) => {
        set({ securityScore: Math.min(100, Math.max(0, score)) });
        if (score >= 90) get().unlockAchievement('cyber-defender');
      },
      
      achievements: DEFAULT_ACHIEVEMENTS,
      unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(a => 
          a.id === id ? { ...a, unlocked: true } : a
        )
      })),
      
      musicEnabled: true,
      reducedMotion: false,
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      
      cameraTarget: null,
      setCameraTarget: (target) => set({ cameraTarget: target }),
      
      isTransitioning: false,
      setTransitioning: (t) => set({ isTransitioning: t }),
    }),
    {
      name: 'cyberverse-progress',
      partialize: (state) => ({
        locationsExplored: state.locationsExplored,
        locationsCompleted: state.locationsCompleted,
        conceptsLearned: state.conceptsLearned,
        simulationsCompleted: state.simulationsCompleted,
        securityScore: state.securityScore,
        xp: state.xp,
        achievements: state.achievements,
        musicEnabled: state.musicEnabled,
        reducedMotion: state.reducedMotion,
      }),
    }
  )
);

// Location data
export const LOCATIONS: LocationData[] = [
  { id: 'cyber-plaza', name: 'CYBER PLAZA', description: 'Central hub of Cyber City', topic: 'Overview & Navigation', explored: false, completed: false, position: [0, 0, 0], color: '#00f0ff' },
  { id: 'cyberbank', name: 'CYBERBANK', description: 'Authentication & Access Control', topic: 'Authentication & MFA', explored: false, completed: false, position: [4, 0, -3], color: '#8b5cf6' },
  { id: 'digital-life-centre', name: 'DIGITAL LIFE CENTRE', description: 'Privacy & Data Protection', topic: 'Digital Privacy', explored: false, completed: false, position: [-4, 0, -2], color: '#ec4899' },
  { id: 'cyber-cafe', name: 'CYBER CAFE', description: 'Phishing Detection Training', topic: 'Phishing', explored: false, completed: false, position: [3, 0, 3], color: '#f59e0b' },
  { id: 'smarthome-district', name: 'SMARTHOME DISTRICT', description: 'IoT Security', topic: 'IoT Security', explored: false, completed: false, position: [-3, 0, 4], color: '#10b981' },
  { id: 'network-tower', name: 'NETWORK TOWER', description: 'Networking Fundamentals', topic: 'Networking', explored: false, completed: false, position: [6, 0, 0], color: '#06b6d4' },
  { id: 'security-hq', name: 'SECURITY HQ', description: 'Cyber Hygiene Assessment', topic: 'Cyber Hygiene', explored: false, completed: false, position: [-6, 0, 0], color: '#22c55e' },
  { id: 'digital-transit', name: 'DIGITAL TRANSIT', description: 'Social Engineering Awareness', topic: 'Social Engineering', explored: false, completed: false, position: [2, 0, -5], color: '#a855f7' },
  { id: 'corporate-tower', name: 'CORPORATE TOWER', description: 'Enterprise Security Policies', topic: 'Corporate Security', explored: false, completed: false, position: [-2, 0, -5], color: '#3b82f6' },
  { id: 'incident-alley', name: 'INCIDENT ALLEY', description: 'Incident Response Training', topic: 'Incident Response', explored: false, completed: false, position: [0, 0, 6], color: '#ef4444' },
];

export const WORLDS = [
  { id: 'cyber-city', name: 'CYBER CITY', topic: 'Digital Safety', color: '#00f0ff', active: true },
  { id: 'password-kingdom', name: 'PASSWORD KINGDOM', topic: 'Authentication', color: '#8b5cf6', active: false },
  { id: 'network-jungle', name: 'NETWORK JUNGLE', topic: 'Networking', color: '#10b981', active: false },
  { id: 'web-city', name: 'WEB CITY', topic: 'Web Security', color: '#f59e0b', active: false },
  { id: 'malware-swamp', name: 'MALWARE SWAMP', topic: 'Malware & Threats', color: '#ef4444', active: false },
  { id: 'forensics-island', name: 'FORENSICS ISLAND', topic: 'Digital Forensics', color: '#06b6d4', active: false },
  { id: 'soc-station', name: 'SOC STATION', topic: 'Security Operations', color: '#22c55e', active: false },
  { id: 'cloud-kingdom', name: 'CLOUD KINGDOM', topic: 'Cloud Security', color: '#a855f7', active: false },
  { id: 'ai-lab', name: 'AI LAB', topic: 'AI Security', color: '#ec4899', active: false },
  { id: 'glitch-citadel', name: 'GLITCH CITADEL', topic: 'Advanced Challenge', color: '#ff0040', active: false },
];
