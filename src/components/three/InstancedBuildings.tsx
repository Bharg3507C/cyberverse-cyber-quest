'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InstancedBuildingsProps {
  count?: number;
  radius?: number;
  maxHeight?: number;
}

/**
 * High-performance instanced city buildings.
 * Renders hundreds of buildings with a single draw call.
 */
export default function InstancedBuildings({ count = 80, radius = 14, maxHeight = 5 }: InstancedBuildingsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const buildings = useMemo(() => {
    const data: { x: number; z: number; h: number; w: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const r = radius + Math.random() * 6;
      const h = 0.5 + Math.random() * maxHeight;
      const w = 0.3 + Math.random() * 0.5;
      data.push({ x: Math.cos(angle) * r, z: Math.sin(angle) * r, h, w });
    }
    return data;
  }, [count, radius, maxHeight]);

  useEffect(() => {
    if (!meshRef.current) return;
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2 - 0.5, b.z);
      dummy.scale.set(b.w, b.h, b.w);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings, dummy]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#0c1020"
        emissive="#00f0ff"
        emissiveIntensity={0.03}
        metalness={0.85}
        roughness={0.2}
      />
    </instancedMesh>
  );
}
