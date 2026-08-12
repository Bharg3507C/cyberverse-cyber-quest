'use client';

import { useCyberStore, LocationId } from '@/store/cyberStore';
import dynamic from 'next/dynamic';

const CyberPlaza = dynamic(() => import('./CyberPlaza'), { ssr: false });
const CyberBank = dynamic(() => import('./CyberBank'), { ssr: false });
const DigitalLifeCentre = dynamic(() => import('./DigitalLifeCentre'), { ssr: false });
const CyberCafe = dynamic(() => import('./CyberCafe'), { ssr: false });
const SmartHomeDistrict = dynamic(() => import('./SmartHomeDistrict'), { ssr: false });
const NetworkTower = dynamic(() => import('./NetworkTower'), { ssr: false });
const SecurityHQ = dynamic(() => import('./SecurityHQ'), { ssr: false });
const DigitalTransit = dynamic(() => import('./DigitalTransit'), { ssr: false });
const CorporateTower = dynamic(() => import('./CorporateTower'), { ssr: false });
const IncidentAlley = dynamic(() => import('./IncidentAlley'), { ssr: false });

const LOCATION_COMPONENTS: Record<LocationId, React.ComponentType> = {
  'cyber-plaza': CyberPlaza,
  'cyberbank': CyberBank,
  'digital-life-centre': DigitalLifeCentre,
  'cyber-cafe': CyberCafe,
  'smarthome-district': SmartHomeDistrict,
  'network-tower': NetworkTower,
  'security-hq': SecurityHQ,
  'digital-transit': DigitalTransit,
  'corporate-tower': CorporateTower,
  'incident-alley': IncidentAlley,
};

export default function LocationRouter() {
  const { activeLocation } = useCyberStore();

  if (!activeLocation) return null;

  const Component = LOCATION_COMPONENTS[activeLocation];
  if (!Component) return null;

  return <Component />;
}
