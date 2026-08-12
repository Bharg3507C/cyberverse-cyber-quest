'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { holographicVertexShader, holographicFragmentShader } from '@/lib/shaders/holographic';

interface HolographicMaterialProps {
  color?: string;
  opacity?: number;
  scanSpeed?: number;
  fresnelPower?: number;
  glitchIntensity?: number;
}

export function useHolographicMaterial({
  color = '#00f0ff',
  opacity = 0.8,
  scanSpeed = 3.0,
  fresnelPower = 2.5,
  glitchIntensity = 0.0,
}: HolographicMaterialProps = {}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: opacity },
    uScanSpeed: { value: scanSpeed },
    uFresnelPower: { value: fresnelPower },
    uGlitchIntensity: { value: glitchIntensity },
  }), [color, opacity, scanSpeed, fresnelPower, glitchIntensity]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return { materialRef, uniforms };
}

interface HolographicMeshProps {
  children: React.ReactNode;
  color?: string;
  opacity?: number;
  scanSpeed?: number;
  fresnelPower?: number;
  glitchIntensity?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

export default function HolographicMesh({
  children,
  color = '#00f0ff',
  opacity = 0.8,
  scanSpeed = 3.0,
  fresnelPower = 2.5,
  glitchIntensity = 0.0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: HolographicMeshProps) {
  const { materialRef, uniforms } = useHolographicMaterial({
    color, opacity, scanSpeed, fresnelPower, glitchIntensity,
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      {children}
      <shaderMaterial
        ref={materialRef}
        vertexShader={holographicVertexShader}
        fragmentShader={holographicFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
