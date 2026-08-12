'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import { downloadCertificate } from '@/lib/certificate/generateCertificate';
import HolographicPanel from './HolographicPanel';
import CyberButton from './CyberButton';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const { locationsCompleted, securityScore, conceptsLearned } = useCyberStore();
  const [name, setName] = useState('');

  const handleDownload = () => {
    if (!name.trim()) return;
    downloadCertificate({
      userName: name.trim(),
      completionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      locationsCompleted: locationsCompleted.length,
      securityScore,
      conceptsLearned,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(6,9,18,0.9)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <HolographicPanel title="GENERATE CERTIFICATE" onClose={onClose} size="md">
          <p className="text-xs text-white/50 mb-4">
            Download your Cybersecurity Awareness Certificate.
          </p>

          <div className="mb-4">
            <label className="text-[10px] tracking-[2px] text-white/30 block mb-2">YOUR NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 border border-white/5 rounded">
              <p className="text-lg font-bold text-cyan-400">{locationsCompleted.length}/10</p>
              <p className="text-[8px] text-white/30">LOCATIONS</p>
            </div>
            <div className="text-center p-3 border border-white/5 rounded">
              <p className="text-lg font-bold text-purple-400">{securityScore}%</p>
              <p className="text-[8px] text-white/30">SCORE</p>
            </div>
            <div className="text-center p-3 border border-white/5 rounded">
              <p className="text-lg font-bold text-pink-400">{conceptsLearned.length}</p>
              <p className="text-[8px] text-white/30">CONCEPTS</p>
            </div>
          </div>

          <CyberButton onClick={handleDownload} disabled={!name.trim()} className="w-full">
            Download Certificate (SVG)
          </CyberButton>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
