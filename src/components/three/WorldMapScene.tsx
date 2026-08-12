'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { WORLDS } from '@/store/cyberStore';
import Particles from './Particles';
import FloatingGrid from './FloatingGrid';

export default function WorldMapScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const worldPositions: [number, number, number][] = [
    [0, 0, 0],       // Cyber City - center
    [-3, 1.5, -2],   // Password Kingdom
    [3.5, 0.8, -1],  // Network Jungle
    [-2, 2.5, 1],    // Web City
    [4, 1.8, 2],     // Malware Swamp
    [-4, 0.5, -3],   // Forensics Island
    [2, 3, -3],      // SOC Station
    [-3, 3.5, 3],    // Cloud Kingdom
    [3, 2.8, 3.5],   // AI Lab
    [0, 4, -4],      // Glitch Citadel
  ];

  return (
    <>
      <fog attach="fog" args={['#060912', 10, 40]} />
      <ambientLight intensity={0.08} />

      <group ref={groupRef} position={[0, -1, 0]}>
        {WORLDS.map((world, i) => {
          const pos = worldPositions[i];
          const size = i === 0 ? 0.8 : 0.4 + Math.random() * 0.2;

          return (
            <Float key={world.id} speed={0.5 + i * 0.1} floatIntensity={0.3} rotationIntensity={0.1}>
              <group position={pos}>
                {/* World sphere */}
                <mesh>
                  <icosahedronGeometry args={[size, i === 0 ? 2 : 1]} />
                  <meshStandardMaterial
                    color="#0a0e1a"
                    emissive={world.color}
                    emissiveIntensity={world.active ? 0.4 : 0.1}
                    metalness={0.7}
                    roughness={0.3}
                    wireframe={!world.active}
                  />
                </mesh>

                {/* Ring */}
                {world.active && (
                  <mesh rotation={[Math.PI / 3, 0, 0]}>
                    <ringGeometry args={[size + 0.2, size + 0.3, 32]} />
                    <meshBasicMaterial color={world.color} transparent opacity={0.4} side={THREE.DoubleSide} />
                  </mesh>
                )}

                {/* Glow */}
                <pointLight position={[0, 0, 0]} color={world.color} distance={world.active ? 5 : 2} intensity={world.active ? 1.5 : 0.3} />
              </group>
            </Float>
          );
        })}

        {/* Connection lines between worlds */}
        {WORLDS.slice(1).map((_, i) => {
          const start = worldPositions[0];
          const end = worldPositions[i + 1];
          const mid = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 0.5, (start[2] + end[2]) / 2];
          return (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([...start, mid[0], mid[1], mid[2], ...end]), 3]}
                  count={3}
                  array={new Float32Array([...start, mid[0], mid[1], mid[2], ...end])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#00f0ff" transparent opacity={0.06} />
            </line>
          );
        })}
      </group>

      <Particles count={100} spread={20} color="#00f0ff" size={0.01} speed={0.05} />
      <FloatingGrid y={-3} size={30} color="#8b5cf6" />

      <pointLight position={[0, 5, 5]} color="#00f0ff" intensity={0.4} distance={20} />
      <pointLight position={[-5, 3, -5]} color="#8b5cf6" intensity={0.3} distance={15} />
    </>
  );
}
