'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glitchVertexShader, glitchFragmentShader } from '@/lib/shaders/holographic';

interface GlitchMeshProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

export default function GlitchMesh({
  children,
  color = '#ef4444',
  intensity = 0.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: GlitchMeshProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uIntensity: { value: intensity },
  }), [color, intensity]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {children}
      <shaderMaterial
        ref={materialRef}
        vertexShader={glitchVertexShader}
        fragmentShader={glitchFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
