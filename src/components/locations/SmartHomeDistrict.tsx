'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

interface SmartDevice {
  name: string;
  icon: string;
  settings: {
    label: string;
    key: string;
    enabled: boolean;
    description: string;
  }[];
}

const DEVICES: SmartDevice[] = [
  {
    name: 'SMART CAMERA',
    icon: '📹',
    settings: [
      { label: 'Change Default Password', key: 'cam-pass', enabled: false, description: 'Replace factory password with a strong unique one' },
      { label: 'Enable MFA', key: 'cam-mfa', enabled: false, description: 'Require second factor for access' },
      { label: 'Update Firmware', key: 'cam-fw', enabled: false, description: 'Install latest security patches' },
      { label: 'Network Isolation', key: 'cam-net', enabled: false, description: 'Place on separate network segment' },
    ],
  },
  {
    name: 'SMART TV',
    icon: '📺',
    settings: [
      { label: 'Disable Tracking', key: 'tv-track', enabled: false, description: 'Stop activity collection' },
      { label: 'Update Software', key: 'tv-fw', enabled: false, description: 'Install security updates' },
      { label: 'Disable Microphone', key: 'tv-mic', enabled: false, description: 'Turn off voice listening' },
      { label: 'Secure Network', key: 'tv-net', enabled: false, description: 'Use encrypted connection' },
    ],
  },
  {
    name: 'SMART LOCK',
    icon: '🔐',
    settings: [
      { label: 'Strong PIN Code', key: 'lock-pin', enabled: false, description: 'Use a complex PIN' },
      { label: 'Enable Alerts', key: 'lock-alert', enabled: false, description: 'Get notified on access attempts' },
      { label: 'Disable Remote Access', key: 'lock-remote', enabled: false, description: 'Prevent external unlocking' },
      { label: 'Update Firmware', key: 'lock-fw', enabled: false, description: 'Patch known vulnerabilities' },
    ],
  },
  {
    name: 'ROUTER',
    icon: '📡',
    settings: [
      { label: 'Change Admin Password', key: 'router-pass', enabled: false, description: 'Replace default credentials' },
      { label: 'Enable WPA3', key: 'router-wpa', enabled: false, description: 'Use strongest WiFi encryption' },
      { label: 'Disable WPS', key: 'router-wps', enabled: false, description: 'Remove brute-force attack vector' },
      { label: 'Update Firmware', key: 'router-fw', enabled: false, description: 'Install latest patches' },
    ],
  },
  {
    name: 'THERMOSTAT',
    icon: '🌡️',
    settings: [
      { label: 'Change Password', key: 'therm-pass', enabled: false, description: 'Set unique password' },
      { label: 'Disable Cloud Sync', key: 'therm-cloud', enabled: false, description: 'Keep data local' },
      { label: 'Network Isolation', key: 'therm-net', enabled: false, description: 'Separate from main network' },
      { label: 'Update Software', key: 'therm-fw', enabled: false, description: 'Patch security flaws' },
    ],
  },
  {
    name: 'SMART SPEAKER',
    icon: '🔊',
    settings: [
      { label: 'Disable Always Listening', key: 'speak-listen', enabled: false, description: 'Require manual activation' },
      { label: 'Delete Voice History', key: 'speak-hist', enabled: false, description: 'Remove stored recordings' },
      { label: 'Restrict Purchases', key: 'speak-buy', enabled: false, description: 'Require PIN for purchases' },
      { label: 'Network Isolation', key: 'speak-net', enabled: false, description: 'Limit network access' },
    ],
  },
];

export default function SmartHomeDistrict() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, unlockAchievement, updateSecurityScore } = useCyberStore();
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [deviceSettings, setDeviceSettings] = useState<Record<string, boolean>>({});

  const totalSettings = DEVICES.reduce((acc, d) => acc + d.settings.length, 0);
  const enabledCount = Object.values(deviceSettings).filter(Boolean).length;
  const securityPercentage = Math.round((enabledCount / totalSettings) * 100);

  const toggleSetting = (key: string) => {
    setDeviceSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isDeviceSecure = (device: SmartDevice) => {
    return device.settings.every(s => deviceSettings[s.key]);
  };

  const allSecured = DEVICES.every(isDeviceSecure);

  const handleComplete = () => {
    learnConcept('IoT Security');
    learnConcept('Device Hardening');
    completeSimulation('smarthome-security');
    completeLocation('smarthome-district');
    updateSecurityScore(Math.max(securityPercentage, 60));
    if (allSecured) unlockAchievement('secure-home');
    setActiveLocation(null);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #051a12 0%, #060912 100%)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-3xl">
        <HolographicPanel
          title="SMARTHOME DISTRICT"
          subtitle="IoT Security"
          onClose={() => setActiveLocation(null)}
          size="full"
          variant="success"
        >
          {/* Security meter */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] tracking-[2px] text-white/40">HOME SECURITY</span>
              <span className="text-xs font-bold" style={{ color: securityPercentage > 70 ? '#10b981' : securityPercentage > 40 ? '#f59e0b' : '#ef4444' }}>
                {securityPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: securityPercentage > 70 ? '#10b981' : securityPercentage > 40 ? '#f59e0b' : '#ef4444' }}
                animate={{ width: `${securityPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {selectedDevice === null ? (
            <>
              <p className="text-xs text-white/50 mb-4">Click each device to review and fix its security settings.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {DEVICES.map((device, i) => {
                  const secure = isDeviceSecure(device);
                  const partial = device.settings.some(s => deviceSettings[s.key]);
                  return (
                    <motion.button
                      key={device.name}
                      whileHover={{ scale: 1.03, y: -3 }}
                      onClick={() => setSelectedDevice(i)}
                      className={`p-4 border rounded text-center transition-all ${
                        secure ? 'border-green-400/40 bg-green-400/5' : partial ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-2xl">{device.icon}</span>
                      <p className="text-[9px] tracking-[1px] text-white/50 mt-2">{device.name}</p>
                      <p className="text-[8px] mt-1" style={{ color: secure ? '#10b981' : partial ? '#f59e0b' : '#ef4444' }}>
                        {secure ? '✓ SECURE' : partial ? '⚠ PARTIAL' : '✗ VULNERABLE'}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              {enabledCount > 0 && (
                <div className="text-center">
                  <CyberButton onClick={handleComplete} size="sm">
                    {allSecured ? 'Complete — All Secured!' : 'Complete with Current Settings'}
                  </CyberButton>
                </div>
              )}
            </>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setSelectedDevice(null)} className="text-[10px] text-white/40 hover:text-white/60 mb-4">
                ← Back to devices
              </button>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{DEVICES[selectedDevice].icon}</span>
                <div>
                  <p className="text-sm font-bold tracking-[2px] text-green-400">{DEVICES[selectedDevice].name}</p>
                  <p className="text-[10px] text-white/40">Security Settings</p>
                </div>
              </div>

              <div className="space-y-2">
                {DEVICES[selectedDevice].settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-3 border border-white/5 rounded"
                  >
                    <div>
                      <p className="text-xs font-medium text-white/70">{setting.label}</p>
                      <p className="text-[9px] text-white/30 mt-0.5">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(setting.key)}
                      className={`w-10 h-5 rounded-full transition-all relative ${
                        deviceSettings[setting.key] ? 'bg-green-400/30 border-green-400/50' : 'bg-red-400/10 border-red-400/30'
                      } border`}
                    >
                      <motion.div
                        className="absolute top-0.5 w-4 h-4 rounded-full"
                        style={{ background: deviceSettings[setting.key] ? '#10b981' : '#ef4444' }}
                        animate={{ left: deviceSettings[setting.key] ? '20px' : '2px' }}
                        transition={{ duration: 0.2 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
