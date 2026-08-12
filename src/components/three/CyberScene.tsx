'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';

interface CyberSceneProps {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
}

export default function CyberScene({ children, camera = { position: [0, 5, 12], fov: 60 } }: CyberSceneProps) {
  return (
    <Canvas
      camera={{ position: camera.position, fov: camera.fov }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={['#060912', 8, 50]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 10, 5]} intensity={0.3} color="#ffffff" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#00f0ff" distance={20} />
        {children}
      </Suspense>
    </Canvas>
  );
}
