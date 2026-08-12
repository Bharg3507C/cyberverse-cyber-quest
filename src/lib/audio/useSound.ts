'use client';

import { useCallback, useEffect } from 'react';
import { soundManager } from './SoundManager';
import { useCyberStore } from '@/store/cyberStore';

export function useSound() {
  const { musicEnabled } = useCyberStore();

  useEffect(() => {
    soundManager.setEnabled(musicEnabled);
  }, [musicEnabled]);

  const hover = useCallback(() => soundManager.hover(), []);
  const click = useCallback(() => soundManager.click(), []);
  const success = useCallback(() => soundManager.success(), []);
  const error = useCallback(() => soundManager.error(), []);
  const transition = useCallback(() => soundManager.transition(), []);
  const achievement = useCallback(() => soundManager.achievement(), []);
  const alert = useCallback(() => soundManager.alert(), []);
  const startAmbient = useCallback(() => soundManager.startAmbient(), []);
  const stopAmbient = useCallback(() => soundManager.stopAmbient(), []);

  return { hover, click, success, error, transition, achievement, alert, startAmbient, stopAmbient };
}
