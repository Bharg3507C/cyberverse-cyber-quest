'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LOCATIONS, LocationId } from '@/store/cyberStore';
import CityBuilding from './CityBuilding';
import Particles from './Particles';
import FloatingGrid from './FloatingGrid';
import DataStream from './DataStream';
import InstancedBuildings from './InstancedBuildings';
import CityEnvironment from './CityEnvironment';
import ScreenEffects from './PostProcessing';

interface CyberCitySceneProps {
  onLocationClick: (id: LocationId) => void;
  onLocationHover: (id: LocationId | null) => void;
  hoveredLocation: LocationId | null;
}

export default function CyberCityScene({ onLocationClick, onLocationHover, hoveredLocation }: CyberCitySceneProps) {
  const dronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (dronRef.current) {
      const t = state.clock.elapsedTime;
      dronRef.current.position.x = Math.sin(t * 0.3) * 5;
      dronRef.current.position.z = Math.cos(t * 0.3) * 5;
      dronRef.current.position.y = 4 + Math.sin(t * 0.8) * 0.3;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#060912', 12, 45]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[10, 15, 5]} intensity={0.25} color="#ffffff" castShadow />
      <pointLight position={[0, 4, 0]} color="#00f0ff" intensity={0.8} distance={15} />
      <pointLight position={[-6, 3, -5]} color="#8b5cf6" intensity={0.4} distance={12} />
      <pointLight position={[6, 3, 5]} color="#ec4899" intensity={0.3} distance={10} />

      {/* OrbitControls for cinematic exploration */}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={6}
        maxDistance={25}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#070b15" metalness={0.9} roughness={0.4} />
      </mesh>

      {/* City buildings (locations) */}
      {LOCATIONS.map((loc) => (
        <CityBuilding
          key={loc.id}
          location={loc}
          onClick={() => onLocationClick(loc.id)}
          isActive={hoveredLocation === loc.id}
        />
      ))}

      {/* Background buildings (instanced - single draw call) */}
      <InstancedBuildings count={80} radius={12} maxHeight={5} />

      {/* City environment (drones, billboards, cameras) */}
      <CityEnvironment />

      {/* Roads */}
      {[0, Math.PI / 2].map((rot, i) => (
        <mesh key={`road-${i}`} rotation={[-Math.PI / 2, 0, rot]} position={[0, -0.48, 0]}>
          <planeGeometry args={[0.6, 20]} />
          <meshBasicMaterial color="#0d1225" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Road glow lines */}
      {[0.32, -0.32].map((offset, i) => (
        <mesh key={`line-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[offset, -0.47, 0]}>
          <planeGeometry args={[0.02, 20]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Drone */}
      <mesh ref={dronRef} position={[0, 4, 0]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#0a0e1a" emissive="#00f0ff" emissiveIntensity={0.5} />
      </mesh>

      {/* Data streams */}
      <DataStream start={[-3, 1, -2]} end={[3, 2, 2]} color="#8b5cf6" speed={0.8} />
      <DataStream start={[4, 1, -1]} end={[-2, 3, 3]} color="#00f0ff" speed={0.6} />
      <DataStream start={[0, 0.5, 5]} end={[0, 3, -5]} color="#ec4899" speed={0.7} />

      {/* Particles */}
      <Particles count={120} spread={20} color="#00f0ff" size={0.012} speed={0.08} />
      <Particles count={60} spread={15} color="#8b5cf6" size={0.008} speed={0.05} />

      {/* Grid */}
      <FloatingGrid y={-0.49} size={50} divisions={50} color="#00f0ff" />

      {/* Screen effects overlay (vignette + scanlines) */}
      <ScreenEffects />
    </>
  );
}
