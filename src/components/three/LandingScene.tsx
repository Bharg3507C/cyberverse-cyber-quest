'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';
import FloatingGrid from './FloatingGrid';

export default function LandingScene() {
  const cityRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cityRef.current) {
      cityRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#060912', 5, 35]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 10, 5]} intensity={0.2} color="#8b5cf6" />

      {/* Floating city structure */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={cityRef} position={[0, -1, 0]}>
          {/* Central tower */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
            <meshStandardMaterial color="#0a0e1a" emissive="#00f0ff" emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Surrounding buildings */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 2 + Math.random() * 1.5;
            const height = 0.5 + Math.random() * 2.5;
            return (
              <mesh key={i} position={[Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius]}>
                <boxGeometry args={[0.3 + Math.random() * 0.3, height, 0.3 + Math.random() * 0.3]} />
                <meshStandardMaterial
                  color="#0f1525"
                  emissive={i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#00f0ff' : '#ec4899'}
                  emissiveIntensity={0.15}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            );
          })}

          {/* Platform */}
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[5, 64]} />
            <meshStandardMaterial color="#080c18" emissive="#00f0ff" emissiveIntensity={0.05} metalness={0.9} roughness={0.3} />
          </mesh>

          {/* Outer ring */}
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4.8, 5, 64]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </Float>

      {/* World orbs in distance */}
      {[
        { pos: [-8, 3, -10] as [number, number, number], color: '#8b5cf6' },
        { pos: [9, 4, -12] as [number, number, number], color: '#ec4899' },
        { pos: [-6, 5, -15] as [number, number, number], color: '#10b981' },
        { pos: [7, 2, -8] as [number, number, number], color: '#f59e0b' },
      ].map((orb, i) => (
        <Float key={i} speed={0.5 + i * 0.2} floatIntensity={0.5}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#0a0e1a" emissive={orb.color} emissiveIntensity={0.3} />
          </mesh>
          <pointLight position={orb.pos} color={orb.color} distance={4} intensity={0.5} />
        </Float>
      ))}

      {/* Particles */}
      <Particles count={150} spread={30} color="#00f0ff" size={0.015} speed={0.1} />
      <Particles count={80} spread={25} color="#8b5cf6" size={0.01} speed={0.08} />

      {/* Grid */}
      <FloatingGrid y={-2} />

      {/* Lights */}
      <pointLight position={[0, 3, 0]} color="#00f0ff" intensity={1} distance={15} />
      <pointLight position={[-5, 5, -5]} color="#8b5cf6" intensity={0.5} distance={20} />
      <pointLight position={[5, 4, -3]} color="#ec4899" intensity={0.3} distance={15} />
    </>
  );
}
