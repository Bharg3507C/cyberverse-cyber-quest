'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full overflow-y-auto" style={{ background: '#060912', color: 'white' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="text-[10px] tracking-[3px] text-cyan-400/60 hover:text-cyan-400 transition-colors">
            ← BACK TO CYBERVERSE
          </Link>

          <h1 className="text-3xl font-bold tracking-[4px] mt-8 mb-2" style={{ color: '#00f0ff' }}>
            CYBERVERSE
          </h1>
          <p className="text-white/40 text-sm tracking-wide">
            Case Study — Interactive 3D Cybersecurity Learning Experience
          </p>
        </motion.div>

        {/* Overview */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-12">
          <h2 className="text-sm font-bold tracking-[3px] text-purple-400 mb-4">OVERVIEW</h2>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            CYBERVERSE is a premium interactive 3D experience that teaches cybersecurity
            fundamentals through exploration, visual storytelling, and hands-on simulations.
            Users explore a futuristic digital city where each building represents a cybersecurity domain.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            Unlike traditional e-learning platforms, CYBERVERSE prioritizes cinematic immersion,
            spatial interaction, and memorable visual metaphors to make cybersecurity concepts
            accessible and engaging.
          </p>
        </motion.section>

        {/* Tech Stack */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12">
          <h2 className="text-sm font-bold tracking-[3px] text-purple-400 mb-4">TECH STACK</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Framework', value: 'Next.js 15+ (App Router)' },
              { label: '3D Engine', value: 'Three.js + React Three Fiber' },
              { label: 'Animations', value: 'Framer Motion + GSAP' },
              { label: 'State', value: 'Zustand (persisted)' },
              { label: 'Styling', value: 'Tailwind CSS' },
              { label: 'Shaders', value: 'Custom GLSL' },
              { label: 'Audio', value: 'Web Audio API (synthesized)' },
              { label: 'i18n', value: '6 languages supported' },
              { label: 'PWA', value: 'Service Worker + Manifest' },
              { label: 'Analytics', value: 'Custom event tracking' },
            ].map((item) => (
              <div key={item.label} className="p-3 border border-white/5 rounded">
                <p className="text-[9px] tracking-[2px] text-white/30">{item.label.toUpperCase()}</p>
                <p className="text-xs text-white/60 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Architecture */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12">
          <h2 className="text-sm font-bold tracking-[3px] text-purple-400 mb-4">ARCHITECTURE</h2>
          <div className="p-4 border border-white/5 rounded font-mono text-[10px] text-white/40 leading-relaxed">
            <pre>{`src/
├── app/          → Next.js pages (App Router)
├── components/
│   ├── three/    → 3D scenes, shaders, materials
│   ├── locations/→ 10 interactive cyber locations
│   ├── simulations/ → Branching scenarios
│   └── ui/       → HolographicPanel, Buttons, Nav
├── lib/
│   ├── audio/    → Web Audio synthesized sounds
│   ├── camera/   → GSAP cinematic transitions
│   ├── certificate/ → SVG cert generator
│   ├── i18n/     → 6 language packs
│   ├── analytics/→ Event tracking
│   ├── pwa/      → Service worker registration
│   └── shaders/  → Custom GLSL shaders
└── store/        → Zustand global state`}</pre>
          </div>
        </motion.section>

        {/* Cybersecurity Topics */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12">
          <h2 className="text-sm font-bold tracking-[3px] text-purple-400 mb-4">CYBERSECURITY TOPICS COVERED</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Authentication & MFA', 'Authorization & Access Control',
              'Phishing Detection', 'Social Engineering',
              'IoT Security', 'Digital Privacy',
              'Networking Fundamentals', 'Cyber Hygiene',
              'Incident Response', 'Corporate Security Policies',
            ].map((topic) => (
              <div key={topic} className="flex items-center gap-2 p-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                <span className="text-xs text-white/50">{topic}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Design Decisions */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12">
          <h2 className="text-sm font-bold tracking-[3px] text-purple-400 mb-4">KEY DESIGN DECISIONS</h2>
          <div className="space-y-4 text-sm text-white/50 leading-relaxed">
            <p><span className="text-white/70 font-medium">No game mechanics</span> — Removed XP, health bars, and character movement. Users explore through cinematic camera and click interactions.</p>
            <p><span className="text-white/70 font-medium">Synthesized audio</span> — All sounds generated via Web Audio API oscillators. Zero external audio files, zero load time.</p>
            <p><span className="text-white/70 font-medium">Custom shaders</span> — Holographic materials with fresnel edge glow, animated scanlines, and glitch effects for visual polish.</p>
            <p><span className="text-white/70 font-medium">Consequence-driven learning</span> — Phishing simulation shows the full attack chain when users make wrong choices, not just &quot;incorrect&quot;.</p>
            <p><span className="text-white/70 font-medium">InstancedMesh</span> — Background city buildings rendered in a single draw call for 60fps performance with 80+ objects.</p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] tracking-[3px] text-white/20">CYBERVERSE — EXPLORE THE DIGITAL WORLD</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 border border-cyan-400/30 text-cyan-400 text-xs tracking-[2px] hover:bg-cyan-400/5 transition-colors rounded">
            LAUNCH EXPERIENCE
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
