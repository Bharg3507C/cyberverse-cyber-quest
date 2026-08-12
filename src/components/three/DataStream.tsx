'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DataStreamProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  speed?: number;
  particleCount?: number;
}

export default function DataStream({ start, end, color = '#00f0ff', speed = 1, particleCount = 20 }: DataStreamProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      pos[i * 3] = start[0] + (end[0] - start[0]) * t;
      pos[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
      pos[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
    }
    return pos;
  }, [start, end, particleCount]);

  useFrame((state) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime * speed;

    for (let i = 0; i < particleCount; i++) {
      const progress = ((i / particleCount) + t * 0.5) % 1;
      arr[i * 3] = start[0] + (end[0] - start[0]) * progress;
      arr[i * 3 + 1] = start[1] + (end[1] - start[1]) * progress + Math.sin(progress * Math.PI) * 0.3;
      arr[i * 3 + 2] = start[2] + (end[2] - start[2]) * progress;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
