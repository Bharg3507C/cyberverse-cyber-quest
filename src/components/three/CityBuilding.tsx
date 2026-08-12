'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LocationData, LocationId } from '@/store/cyberStore';

interface CityBuildingProps {
  location: LocationData;
  onClick: () => void;
  isActive: boolean;
}

export default function CityBuilding({ location, onClick, isActive }: CityBuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.PointLight>(null);
  const lit = hovered || isActive;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = lit ? Math.sin(t * 2) * 0.04 : 0;
    if (glowRef.current) {
      glowRef.current.intensity = lit ? 2.5 : 0.5 + Math.sin(t * 1.5) * 0.2;
    }
  });

  const handlePointerEnter = () => { setHovered(true); document.body.style.cursor = 'pointer'; };
  const handlePointerLeave = () => { setHovered(false); document.body.style.cursor = 'default'; };
  const handleClick = (e: THREE.Event) => { (e as unknown as { stopPropagation: () => void }).stopPropagation(); onClick(); };

  const mat = (emissiveBoost = 1) => ({
    color: lit ? location.color : '#1a1f35',
    emissive: location.color,
    emissiveIntensity: (lit ? 0.35 : 0.08) * emissiveBoost,
    metalness: 0.8,
    roughness: 0.2,
  });

  const glassMat = {
    color: location.color,
    transparent: true,
    opacity: lit ? 0.3 : 0.1,
    emissive: location.color,
    emissiveIntensity: lit ? 0.5 : 0.15,
    metalness: 0.9,
    roughness: 0.1,
  };

  return (
    <group
      position={[location.position[0], location.position[1], location.position[2]]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <group ref={groupRef}>
        <BuildingModel id={location.id} mat={mat} glassMat={glassMat} lit={lit} color={location.color} />

        {/* Top glow light */}
        <pointLight ref={glowRef} position={[0, 3.5, 0]} color={location.color} distance={4} intensity={0.5} />
      </group>

      {/* Base ring marker */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial color={location.color} transparent opacity={lit ? 0.5 : 0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Hover pulse ring */}
      {lit && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.05, 32]} />
          <meshBasicMaterial color={location.color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// ---- Per-location building models ----

interface ModelProps {
  id: LocationId;
  mat: (boost?: number) => Record<string, unknown>;
  glassMat: Record<string, unknown>;
  lit: boolean;
  color: string;
}

function BuildingModel({ id, mat, glassMat, lit, color }: ModelProps) {
  switch (id) {
    case 'cyber-plaza': return <PlazaModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'cyberbank': return <BankModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'digital-life-centre': return <ShowroomModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'cyber-cafe': return <CafeModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'smarthome-district': return <HomeModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'network-tower': return <TowerModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'security-hq': return <HQModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'digital-transit': return <MetroModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'corporate-tower': return <CorporateModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    case 'incident-alley': return <IncidentModel mat={mat} glassMat={glassMat} lit={lit} color={color} />;
    default: return null;
  }
}

type BModelProps = { mat: (b?: number) => Record<string, unknown>; glassMat: Record<string, unknown>; lit: boolean; color: string };

// 1. CYBER PLAZA — Open circular platform with holographic pillar
function PlazaModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Circular platform */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Central holographic pillar */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color="#0a0e1a" emissive={color} emissiveIntensity={lit ? 0.8 : 0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Holographic ring at top */}
      <mesh position={[0, 2.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.6 : 0.25} />
      </mesh>
      {/* Steps */}
      {[0.6, 0.9, 1.2].map((r, i) => (
        <mesh key={i} position={[0, 0.02 * (3 - i), 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.05, r, 32]} />
          <meshStandardMaterial color="#0f1525" emissive={color} emissiveIntensity={0.05} />
        </mesh>
      ))}
    </group>
  );
}

// 2. CYBERBANK — Vault-style with columns and heavy door
function BankModel({ mat, glassMat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Main structure */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.6, 2, 1.2]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Roof overhang */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1.8, 0.15, 1.4]} />
        <meshStandardMaterial {...mat(1.2)} />
      </mesh>
      {/* Columns */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 1, 0.65]}>
          <cylinderGeometry args={[0.06, 0.08, 2, 8]} />
          <meshStandardMaterial color="#0f1525" emissive={color} emissiveIntensity={lit ? 0.3 : 0.1} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Vault door */}
      <mesh position={[0, 0.8, 0.62]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 24]} />
        <meshStandardMaterial {...glassMat} />
      </mesh>
      {/* Vault door ring */}
      <mesh position={[0, 0.8, 0.65]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.5 : 0.2} />
      </mesh>
    </group>
  );
}

// 3. DIGITAL LIFE CENTRE — Glass showroom dome
function ShowroomModel({ mat, glassMat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.8, 1.4]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Glass dome */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...glassMat} side={THREE.DoubleSide} />
      </mesh>
      {/* Display items inside */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.08]} />
          <meshStandardMaterial color="#0a0e1a" emissive={i === 1 ? color : '#8b5cf6'} emissiveIntensity={lit ? 0.6 : 0.2} />
        </mesh>
      ))}
      {/* Entrance sign */}
      <mesh position={[0, 0.85, 0.72]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.5 : 0.2} />
      </mesh>
    </group>
  );
}

// 4. CYBER CAFE — Low building with awning and chairs
function CafeModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Main cafe structure */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.4, 1.2, 1.0]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Awning */}
      <mesh position={[0, 1.1, 0.7]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.6, 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={lit ? 0.3 : 0.1} side={THREE.DoubleSide} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Window (glowing screen) */}
      <mesh position={[0, 0.7, 0.52]}>
        <planeGeometry args={[1.0, 0.6]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.4 : 0.15} />
      </mesh>
      {/* Tables outside */}
      {[-0.4, 0.4].map((x) => (
        <group key={x} position={[x, 0, 0.8]}>
          {/* Table */}
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.03, 8]} />
            <meshStandardMaterial color="#1a1f35" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 6]} />
            <meshStandardMaterial color="#1a1f35" />
          </mesh>
          {/* Chair */}
          <mesh position={[0, 0.15, 0.18]}>
            <boxGeometry args={[0.1, 0.12, 0.1]} />
            <meshStandardMaterial color="#0f1525" />
          </mesh>
        </group>
      ))}
      {/* Coffee cup on counter */}
      <mesh position={[0.3, 1.22, 0]}>
        <cylinderGeometry args={[0.04, 0.03, 0.08, 8]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// 5. SMARTHOME DISTRICT — House with pitched roof and antenna
function HomeModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* House base */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.0]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Pitched roof */}
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.9, 0.6, 4]} />
        <meshStandardMaterial color="#0d1225" emissive={color} emissiveIntensity={lit ? 0.15 : 0.05} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.35, 0.52]}>
        <boxGeometry args={[0.25, 0.55, 0.03]} />
        <meshStandardMaterial color="#0a0e1a" emissive={color} emissiveIntensity={lit ? 0.4 : 0.1} />
      </mesh>
      {/* Windows */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.7, 0.52]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial color={color} transparent opacity={lit ? 0.4 : 0.1} />
        </mesh>
      ))}
      {/* Antenna / IoT */}
      <mesh position={[0.4, 1.8, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.5, 4]} />
        <meshStandardMaterial color="#333" emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.4, 2.05, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Smart device glow (WiFi symbol concept) */}
      {lit && (
        <pointLight position={[0.4, 2.1, 0]} color={color} intensity={1} distance={1.5} />
      )}
    </group>
  );
}

// 6. NETWORK TOWER — Tall communications tower with dishes
function TowerModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Tower base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Tower shaft */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 3.5, 6]} />
        <meshStandardMaterial color="#0f1525" emissive={color} emissiveIntensity={lit ? 0.3 : 0.1} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Lattice wireframe */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 3.5, 6]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={lit ? 0.25 : 0.08} />
      </mesh>
      {/* Dishes */}
      {[1.5, 2.5, 3.5].map((y, i) => (
        <mesh key={i} position={[0.2, y, 0]} rotation={[0, 0, -0.3]}>
          <sphereGeometry args={[0.12, 8, 6, 0, Math.PI]} />
          <meshStandardMaterial color="#1a1f35" emissive={color} emissiveIntensity={lit ? 0.4 : 0.1} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Blinking light at top */}
      <mesh position={[0, 4.3, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={lit ? color : '#ff0000'} />
      </mesh>
      <pointLight position={[0, 4.3, 0]} color={color} intensity={lit ? 1.5 : 0.3} distance={2} />
    </group>
  );
}

// 7. SECURITY HQ — Fortress-style with shield emblem
function HQModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Main building */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.6, 2.0, 1.2]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Reinforced corners */}
      {[[-0.8, -0.6], [-0.8, 0.6], [0.8, -0.6], [0.8, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.0, z]}>
          <cylinderGeometry args={[0.1, 0.1, 2.1, 6]} />
          <meshStandardMaterial color="#0f1525" emissive={color} emissiveIntensity={lit ? 0.2 : 0.05} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      {/* Shield emblem (front face) */}
      <mesh position={[0, 1.2, 0.62]}>
        <circleGeometry args={[0.25, 6]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.5 : 0.2} />
      </mesh>
      {/* Watchtower */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial {...mat(1.3)} />
      </mesh>
      {/* Surveillance light */}
      <mesh position={[0, 2.9, 0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.15, 0.8, 8, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.08 : 0.02} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 8. DIGITAL TRANSIT — Metro station with curved roof
function MetroModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Platform base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.0, 0.4, 0.8]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Curved roof */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 2.0, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#0d1225" emissive={color} emissiveIntensity={lit ? 0.15 : 0.05} metalness={0.7} roughness={0.3} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Rail tracks */}
      {[-0.2, 0.2].map((z) => (
        <mesh key={z} position={[0, 0.05, z]}>
          <boxGeometry args={[2.5, 0.02, 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} emissive={color} emissiveIntensity={0.05} />
        </mesh>
      ))}
      {/* Entrance pillars */}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.7, 0.4]}>
          <boxGeometry args={[0.08, 1.0, 0.08]} />
          <meshStandardMaterial color="#0f1525" emissive={color} emissiveIntensity={lit ? 0.3 : 0.1} />
        </mesh>
      ))}
      {/* Digital sign */}
      <mesh position={[0, 1.0, 0.42]}>
        <planeGeometry args={[1.0, 0.2]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.4 : 0.15} />
      </mesh>
    </group>
  );
}

// 9. CORPORATE TOWER — Tall multi-floor skyscraper
function CorporateModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Main tower */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.9, 3.6, 0.9]} />
        <meshStandardMaterial {...mat()} />
      </mesh>
      {/* Floor separators */}
      {[0.6, 1.2, 1.8, 2.4, 3.0].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.95, 0.03, 0.95]} />
          <meshStandardMaterial color="#0a0e1a" emissive={color} emissiveIntensity={lit ? 0.2 : 0.05} />
        </mesh>
      ))}
      {/* Windows per floor (front) */}
      {[0.4, 0.9, 1.5, 2.1, 2.7].map((y) => (
        <mesh key={y} position={[0, y, 0.46]}>
          <planeGeometry args={[0.7, 0.4]} />
          <meshBasicMaterial color={color} transparent opacity={lit ? 0.2 : 0.06} />
        </mesh>
      ))}
      {/* Rooftop helipad */}
      <mesh position={[0, 3.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.3 : 0.1} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 3.9, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 4]} />
        <meshStandardMaterial color="#333" emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// 10. INCIDENT ALLEY — Dark area with warning lights and barricades
function IncidentModel({ mat, color, lit }: BModelProps) {
  return (
    <group>
      {/* Damaged/dark building */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.3, 1.8, 1.0]} />
        <meshStandardMaterial color="#0a0505" emissive={color} emissiveIntensity={lit ? 0.3 : 0.08} metalness={0.7} roughness={0.5} />
      </mesh>
      {/* Cracks / damage lines */}
      <mesh position={[0.2, 1.2, 0.52]}>
        <planeGeometry args={[0.4, 0.6]} />
        <meshBasicMaterial color={color} transparent opacity={lit ? 0.15 : 0.05} />
      </mesh>
      {/* Warning barricades */}
      {[-0.5, 0.5].map((x) => (
        <group key={x} position={[x, 0, 0.7]}>
          <mesh position={[0, 0.3, 0]}>
            <coneGeometry args={[0.08, 0.4, 6]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={lit ? 0.4 : 0.1} />
          </mesh>
        </group>
      ))}
      {/* Warning light on top */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={lit ? color : '#ff0000'} />
      </mesh>
      {/* Caution tape (horizontal bar) */}
      <mesh position={[0, 0.5, 0.75]}>
        <boxGeometry args={[1.2, 0.04, 0.02]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
      {/* Red alert glow */}
      <pointLight position={[0, 1.9, 0]} color={color} intensity={lit ? 2 : 0.5} distance={2.5} />
    </group>
  );
}
