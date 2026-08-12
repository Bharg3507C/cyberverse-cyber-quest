'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingGridProps {
  size?: number;
  divisions?: number;
  color?: string;
  y?: number;
}

export default function FloatingGrid({ size = 40, divisions = 40, color = '#00f0ff', y = -0.5 }: FloatingGridProps) {
  const ref = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.elapsedTime * 0.3) % (size / divisions);
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[size, divisions, color, color]}
      position={[0, y, 0]}
      material-opacity={0.08}
      material-transparent={true}
      material-blending={THREE.AdditiveBlending}
    />
  );
}
