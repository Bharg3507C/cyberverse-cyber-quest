'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import HolographicMesh from './HolographicMaterial';

/**
 * City environment enhancements:
 * - Holographic billboards
 * - Animated drones
 * - Security cameras
 * - Atmospheric volumetric-style light cones
 */
export default function CityEnvironment() {
  const drone1Ref = useRef<THREE.Group>(null);
  const drone2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (drone1Ref.current) {
      drone1Ref.current.position.x = Math.sin(t * 0.4) * 6;
      drone1Ref.current.position.z = Math.cos(t * 0.4) * 6;
      drone1Ref.current.position.y = 4.5 + Math.sin(t * 1.2) * 0.2;
      drone1Ref.current.rotation.y = t * 0.4 + Math.PI;
    }
    if (drone2Ref.current) {
      drone2Ref.current.position.x = Math.cos(t * 0.3) * 8;
      drone2Ref.current.position.z = Math.sin(t * 0.3 + 1) * 5;
      drone2Ref.current.position.y = 5 + Math.sin(t * 0.9) * 0.3;
      drone2Ref.current.rotation.y = t * 0.3;
    }
  });

  return (
    <>
      {/* Holographic billboards */}
      <HolographicMesh position={[8, 3, -6]} rotation={[0, -0.5, 0]} color="#8b5cf6" opacity={0.5} scanSpeed={4}>
        <planeGeometry args={[2, 1.2]} />
      </HolographicMesh>

      <HolographicMesh position={[-7, 2.5, -4]} rotation={[0, 0.4, 0]} color="#00f0ff" opacity={0.4} scanSpeed={3}>
        <planeGeometry args={[1.5, 1]} />
      </HolographicMesh>

      <HolographicMesh position={[0, 4, -8]} rotation={[0, 0, 0]} color="#ec4899" opacity={0.3} scanSpeed={2}>
        <planeGeometry args={[3, 1.5]} />
      </HolographicMesh>

      {/* Drones */}
      <group ref={drone1Ref}>
        <mesh>
          <octahedronGeometry args={[0.12]} />
          <meshStandardMaterial color="#0a0e1a" emissive="#00f0ff" emissiveIntensity={0.8} />
        </mesh>
        {/* Drone light cone */}
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.3, 1, 8, 1, true]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#00f0ff" intensity={0.5} distance={3} />
      </group>

      <group ref={drone2Ref}>
        <mesh>
          <octahedronGeometry args={[0.1]} />
          <meshStandardMaterial color="#0a0e1a" emissive="#8b5cf6" emissiveIntensity={0.8} />
        </mesh>
        <pointLight color="#8b5cf6" intensity={0.3} distance={2} />
      </group>

      {/* Volumetric light cones (fake god rays) */}
      {[
        { pos: [3, 4, -2] as [number, number, number], color: '#00f0ff' },
        { pos: [-4, 3.5, 3] as [number, number, number], color: '#8b5cf6' },
        { pos: [0, 5, -5] as [number, number, number], color: '#ec4899' },
      ].map((light, i) => (
        <mesh key={i} position={light.pos}>
          <coneGeometry args={[0.8, 4, 16, 1, true]} />
          <meshBasicMaterial color={light.color} transparent opacity={0.015} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Ground reflective plane with subtle grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial
          color="#050810"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Security cameras (corner decorations) */}
      {[
        [5, 2.5, 5],
        [-5, 3, -4],
        [7, 2, -3],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.3]} />
            <meshStandardMaterial color="#1a1f35" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.08, 0.06, 0.06]} />
            <meshStandardMaterial color="#0a0e1a" emissive="#ef4444" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}
