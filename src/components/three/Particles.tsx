'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  color?: string;
  spread?: number;
  speed?: number;
  size?: number;
}

export default function Particles({ count = 200, color = '#00f0ff', spread = 20, speed = 0.2, size = 0.02 }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = Math.random() * spread * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      vel[i * 3] = (Math.random() - 0.5) * speed * 0.1;
      vel[i * 3 + 1] = Math.random() * speed * 0.05 + 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.1;
    }
    return [pos, vel];
  }, [count, spread, speed]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta * 60;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;

      if (arr[i * 3 + 1] > spread * 0.5) {
        arr[i * 3] = (Math.random() - 0.5) * spread;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
