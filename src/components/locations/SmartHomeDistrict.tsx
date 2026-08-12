'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberStore } from '@/store/cyberStore';
import HolographicPanel from '@/components/ui/HolographicPanel';
import CyberButton from '@/components/ui/CyberButton';

type Phase = 'network' | 'scan' | 'inspect' | 'risk' | 'fix' | 'result';

interface DeviceData {
  name: string;
  icon: string;
  ip: string;
  model: string;
  firmware: string;
  firmwareLatest: string;
  credentials: string;
  encryption: string;
  ports: { port: number; service: string; status: 'open' | 'closed'; risky: boolean }[];
  connectedTo: string;
  lastUpdate: string;
  scanOutput: string[];
  findings: { id: string; label: string; detail: string; isVulnerability: boolean }[];
  fixes: { id: string; command: string; description: string; isCorrect: boolean; points: number; explanation: string }[];
}

const DEVICES: DeviceData[] = [
  {
    name: 'SMART CAMERA', icon: '📹', ip: '192.168.1.40',
    model: 'CyberCam Pro v2', firmware: '1.2.1', firmwareLatest: '2.4.0',
    credentials: 'admin:admin', encryption: 'NONE',
    ports: [
      { port: 80, service: 'HTTP', status: 'open', risky: false },
      { port: 8080, service: 'RTSP', status: 'open', risky: false },
      { port: 23, service: 'Telnet', status: 'open', risky: true },
      { port: 443, service: 'HTTPS', status: 'closed', risky: false },
    ],
    connectedTo: 'Main LAN (192.168.1.0/24)',
    lastUpdate: '18 months ago',
    scanOutput: [
      'Scanning 192.168.1.40...',
      'PORT     STATE   SERVICE',
      '23/tcp   open    telnet',
      '80/tcp   open    http',
      '8080/tcp open    rtsp-alt',
      '',
      'OS: Linux 3.x | Device: IoT Camera',
      'MAC: DC:A6:32:XX:XX:40',
      'Firmware: CyberCam v1.2.1 (OUTDATED)',
      'Auth: HTTP Basic (default credentials detected)',
      'Encryption: None (stream unencrypted)',
    ],
    findings: [
      { id: 'v1', label: 'Default credentials active (admin:admin)', detail: 'Factory login never changed', isVulnerability: true },
      { id: 'v2', label: 'Firmware 1.2.1 — 6 known CVEs unpatched', detail: 'Latest is 2.4.0, 18 months behind', isVulnerability: true },
      { id: 'v3', label: 'Telnet (port 23) exposed', detail: 'Unencrypted remote shell access', isVulnerability: true },
      { id: 'v4', label: 'Video stream unencrypted', detail: 'RTSP without TLS — can be intercepted', isVulnerability: true },
      { id: 'v5', label: 'No network segmentation', detail: 'Same subnet as personal devices', isVulnerability: true },
      { id: 'd1', label: 'HTTP management interface on port 80', detail: 'Standard admin panel access', isVulnerability: false },
      { id: 'd2', label: 'RTSP on port 8080', detail: 'Required for video streaming functionality', isVulnerability: false },
      { id: 'd3', label: 'Device has a static IP assignment', detail: 'Normal for IoT devices on LAN', isVulnerability: false },
    ],
    fixes: [
      { id: 'f1', command: 'passwd --set admin $(openssl rand -base64 16)', description: 'Change default password', isCorrect: true, points: 30, explanation: 'Eliminates #1 IoT attack vector.' },
      { id: 'f2', command: 'firmware --update --version 2.4.0', description: 'Update firmware', isCorrect: true, points: 25, explanation: 'Patches 6 known CVEs.' },
      { id: 'f3', command: 'service telnet disable && port 23 close', description: 'Disable Telnet', isCorrect: true, points: 20, explanation: 'Removes unencrypted remote access.' },
      { id: 'f4', command: 'stream --encryption tls --cert auto', description: 'Enable TLS on stream', isCorrect: true, points: 15, explanation: 'Encrypts video to prevent interception.' },
      { id: 'f5', command: 'network --vlan iot --isolate', description: 'Move to IoT VLAN', isCorrect: true, points: 20, explanation: 'Limits blast radius if compromised.' },
      { id: 'f6', command: 'factory-reset --confirm', description: 'Factory reset device', isCorrect: false, points: -10, explanation: 'Reverts to default creds — makes it worse.' },
      { id: 'f7', command: 'device --shutdown --permanent', description: 'Disable camera permanently', isCorrect: false, points: -5, explanation: 'Removes functionality instead of securing it.' },
    ],
  },
  {
    name: 'ROUTER', icon: '📡', ip: '192.168.1.1',
    model: 'NetSecure AX-4200', firmware: '3.1.0', firmwareLatest: '3.8.2',
    credentials: 'admin:password123', encryption: 'WPA2',
    ports: [
      { port: 80, service: 'HTTP Admin', status: 'open', risky: false },
      { port: 443, service: 'HTTPS', status: 'open', risky: false },
      { port: 53, service: 'DNS', status: 'open', risky: false },
      { port: 8443, service: 'WPS', status: 'open', risky: true },
    ],
    connectedTo: 'ISP Gateway (WAN)',
    lastUpdate: '14 months ago',
    scanOutput: [
      'Scanning 192.168.1.1...',
      'PORT     STATE   SERVICE',
      '53/tcp   open    dns',
      '80/tcp   open    http-admin',
      '443/tcp  open    https',
      '8443/tcp open    wps-service',
      '',
      'OS: RouterOS | Device: Wireless Router',
      'MAC: AA:BB:CC:XX:XX:01',
      'Firmware: NetSecure v3.1.0 (OUTDATED)',
      'WiFi: WPA2 (WPS PIN enabled)',
      'Admin: password123 (WEAK)',
      'UPnP: ENABLED',
    ],
    findings: [
      { id: 'v1', label: 'Admin password "password123"', detail: 'Easily guessable — top 10 common passwords', isVulnerability: true },
      { id: 'v2', label: 'WPS enabled (brute-forceable PIN)', detail: 'Can be cracked in hours with reaver', isVulnerability: true },
      { id: 'v3', label: 'Firmware 14 months outdated', detail: 'Missing critical security patches', isVulnerability: true },
      { id: 'v4', label: 'UPnP enabled', detail: 'Allows any device to open firewall ports', isVulnerability: true },
      { id: 'v5', label: 'WPA2 instead of WPA3', detail: 'Vulnerable to KRACK attacks', isVulnerability: true },
      { id: 'd1', label: 'HTTPS admin on port 443', detail: 'Encrypted management interface', isVulnerability: false },
      { id: 'd2', label: 'DNS on port 53', detail: 'Required for name resolution', isVulnerability: false },
      { id: 'd3', label: 'DHCP server active', detail: 'Normal router function for IP assignment', isVulnerability: false },
    ],
    fixes: [
      { id: 'f1', command: 'admin --password "$(pwgen -s 20 1)"', description: 'Set strong 20-char password', isCorrect: true, points: 30, explanation: 'Prevents brute-force of admin panel.' },
      { id: 'f2', command: 'wps --disable', description: 'Disable WPS', isCorrect: true, points: 25, explanation: 'Removes brute-forceable PIN attack vector.' },
      { id: 'f3', command: 'firmware --upgrade 3.8.2 --auto-reboot', description: 'Update firmware', isCorrect: true, points: 20, explanation: 'Patches known vulnerabilities.' },
      { id: 'f4', command: 'upnp --disable', description: 'Disable UPnP', isCorrect: true, points: 15, explanation: 'Prevents unauthorized port forwarding.' },
      { id: 'f5', command: 'wifi --security wpa3-personal', description: 'Upgrade to WPA3', isCorrect: true, points: 15, explanation: 'Strongest WiFi encryption available.' },
      { id: 'f6', command: 'wifi --disable-all', description: 'Turn off WiFi entirely', isCorrect: false, points: -10, explanation: 'Destroys usability — overkill.' },
      { id: 'f7', command: 'firewall --allow-all --no-rules', description: 'Remove all firewall rules', isCorrect: false, points: -15, explanation: 'Completely exposes network.' },
    ],
  },
  {
    name: 'SMART LOCK', icon: '🔐', ip: '192.168.1.55',
    model: 'SecureEntry X1', firmware: '2.0.3', firmwareLatest: '2.2.1',
    credentials: 'PIN: 1234', encryption: 'BLE (no encryption)',
    ports: [
      { port: 0, service: 'Bluetooth LE', status: 'open', risky: true },
    ],
    connectedTo: 'Hub via Bluetooth',
    lastUpdate: '6 months ago',
    scanOutput: [
      'Scanning 192.168.1.55 (BLE)...',
      'SERVICE        STATE',
      'BLE-GATT       active (unencrypted)',
      '',
      'Device: Smart Lock',
      'Model: SecureEntry X1',
      'Firmware: 2.0.3 (latest: 2.2.1)',
      'PIN: 4-digit (default detected: 1234)',
      'Failed attempt lockout: DISABLED',
      'Remote unlock: ENABLED (no MFA)',
      'BLE encryption: NONE',
    ],
    findings: [
      { id: 'v1', label: 'Default PIN 1234 still set', detail: 'First code any attacker tries', isVulnerability: true },
      { id: 'v2', label: 'BLE communication unencrypted', detail: 'Can be sniffed and replayed', isVulnerability: true },
      { id: 'v3', label: 'No failed attempt lockout', detail: 'Unlimited brute-force attempts', isVulnerability: true },
      { id: 'v4', label: 'Remote unlock without MFA', detail: 'Internet access without second factor', isVulnerability: true },
      { id: 'd1', label: 'Uses Bluetooth Low Energy', detail: 'Standard smart lock protocol', isVulnerability: false },
      { id: 'd2', label: 'Connected to local hub only', detail: 'Not directly internet-exposed', isVulnerability: false },
    ],
    fixes: [
      { id: 'f1', command: 'pin --set $(shuf -i 10000000-99999999 -n 1)', description: 'Set random 8-digit PIN', isCorrect: true, points: 30, explanation: 'Eliminates guessable default.' },
      { id: 'f2', command: 'ble --encryption aes-128-ccm', description: 'Enable BLE encryption', isCorrect: true, points: 25, explanation: 'Prevents sniffing/replay attacks.' },
      { id: 'f3', command: 'lockout --enable --max-attempts 5 --duration 30m', description: 'Enable lockout after 5 fails', isCorrect: true, points: 20, explanation: 'Stops brute-force PIN guessing.' },
      { id: 'f4', command: 'remote --require-mfa totp', description: 'Require TOTP for remote unlock', isCorrect: true, points: 20, explanation: 'Adds verification for internet access.' },
      { id: 'f5', command: 'device --remove --factory-reset', description: 'Remove smart lock entirely', isCorrect: false, points: -10, explanation: 'Removes security instead of fixing it.' },
    ],
  },
];

export default function SmartHomeDistrict() {
  const { setActiveLocation, learnConcept, completeLocation, completeSimulation, unlockAchievement, updateSecurityScore, addXp } = useCyberStore();
  const [phase, setPhase] = useState<Phase>('network');
  const [activeDevice, setActiveDevice] = useState(0);
  const [discoveredDevices, setDiscoveredDevices] = useState<number[]>([]);
  const [scanningDevice, setScanningDevice] = useState<number | null>(null);
  const [scanComplete, setScanComplete] = useState<number[]>([]);
  const [scanLines, setScanLines] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['$ ready']);
  const [inspectedFindings, setInspectedFindings] = useState<Record<number, string[]>>({});
  const [markedVulns, setMarkedVulns] = useState<Record<number, string[]>>({});
  const [biggestRisk, setBiggestRisk] = useState<string | null>(null);
  const [executedFixes, setExecutedFixes] = useState<Record<number, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  const device = DEVICES[activeDevice];

  // ---- Network discovery: user types scan command ----
  const handleNetworkCommand = (cmd: string) => {
    const normalized = cmd.trim().toLowerCase();
    setTerminalHistory(prev => [...prev, `$ ${cmd}`]);

    if (normalized.includes('scan') || normalized.includes('nmap') || normalized.includes('discover') || normalized.includes('arp')) {
      setTerminalHistory(prev => [...prev, 'Discovering devices on 192.168.1.0/24...', '']);
      setTimeout(() => {
        DEVICES.forEach((d, i) => {
          setTimeout(() => {
            setDiscoveredDevices(prev => prev.includes(i) ? prev : [...prev, i]);
            setTerminalHistory(prev => [...prev, `  ${d.ip}  ${d.name} (${d.model})`]);
          }, (i + 1) * 600);
        });
        setTimeout(() => {
          setTerminalHistory(prev => [...prev, '', `${DEVICES.length} devices found.`, '$ ready']);
        }, (DEVICES.length + 1) * 600);
      }, 400);
    } else if (normalized === 'help') {
      setTerminalHistory(prev => [...prev, 'Commands: scan, nmap, discover, help', '$ ready']);
    } else {
      setTerminalHistory(prev => [...prev, `Unknown command: ${cmd}`, 'Type "scan" to discover network devices', '$ ready']);
    }
    setTerminalInput('');
    setTimeout(() => termRef.current?.scrollTo(0, termRef.current.scrollHeight), 100);
  };

  // ---- Port scan animation ----
  const runPortScan = (deviceIdx: number) => {
    setScanningDevice(deviceIdx);
    setScanLines([]);
    const output = DEVICES[deviceIdx].scanOutput;
    output.forEach((line, i) => {
      setTimeout(() => {
        setScanLines(prev => [...prev, line]);
        if (i === output.length - 1) {
          setTimeout(() => {
            setScanComplete(prev => [...prev, deviceIdx]);
            setScanningDevice(null);
          }, 500);
        }
      }, i * 200);
    });
  };

  // ---- Inspect a finding (click to read it — not check it) ----
  const inspectFinding = (deviceIdx: number, findingId: string) => {
    setInspectedFindings(prev => {
      const current = prev[deviceIdx] || [];
      return { ...prev, [deviceIdx]: current.includes(findingId) ? current : [...current, findingId] };
    });
  };

  // ---- After inspecting, user flags it as vulnerable or not ----
  const flagAsVulnerable = (deviceIdx: number, findingId: string) => {
    setMarkedVulns(prev => {
      const current = prev[deviceIdx] || [];
      return { ...prev, [deviceIdx]: current.includes(findingId) ? current.filter(f => f !== findingId) : [...current, findingId] };
    });
  };

  // ---- Execute a fix (user clicks to run the command) ----
  const executeFix = (deviceIdx: number, fixId: string) => {
    setExecutedFixes(prev => {
      const current = prev[deviceIdx] || [];
      return { ...prev, [deviceIdx]: current.includes(fixId) ? current : [...current, fixId] };
    });
  };

  // ---- Submit ----
  const handleSubmit = () => {
    setSubmitted(true);
    let totalPts = 0;
    DEVICES.forEach((d, i) => {
      const marked = markedVulns[i] || [];
      marked.forEach(fId => {
        const finding = d.findings.find(f => f.id === fId);
        if (finding?.isVulnerability) totalPts += 15;
        else totalPts -= 10;
      });
      // Missed vulns
      d.findings.filter(f => f.isVulnerability && !marked.includes(f.id)).forEach(() => { totalPts -= 5; });
      // Fixes
      const fixes = executedFixes[i] || [];
      fixes.forEach(fxId => {
        const fix = d.fixes.find(f => f.id === fxId);
        if (fix) totalPts += fix.points;
      });
    });
    if (biggestRisk === 'default-credentials') totalPts += 40;

    addXp(Math.max(0, Math.round(totalPts * 0.5)));
    const pct = Math.min(100, Math.max(0, Math.round((totalPts / 450) * 100)));
    updateSecurityScore(Math.max(pct, 40));
    learnConcept('IoT Security');
    learnConcept('Attack Surface');
    learnConcept('Network Scanning');
    learnConcept('Vulnerability Assessment');
    learnConcept('Default Credentials');
    completeSimulation('smarthome-investigation');
    completeLocation('smarthome-district');
    if (pct >= 80) unlockAchievement('secure-home');
    setPhase('result');
  };

  const allInspected = DEVICES.every((_, i) => (inspectedFindings[i] || []).length >= 3);
  const allFixed = DEVICES.every((_, i) => (executedFixes[i] || []).length >= 1);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #051a12 0%, #060912 100%)' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-4xl h-[85vh] flex flex-col">
        <HolographicPanel title="SMARTHOME DISTRICT" subtitle="IoT Security Lab" onClose={() => setActiveLocation(null)} size="full" variant="success">
          {/* Phase bar */}
          <div className="flex gap-1 mb-3">
            {(['network','scan','inspect','risk','fix','result'] as Phase[]).map((p,i) => (
              <div key={p} className={`flex-1 h-1 rounded-full transition-all ${phase === p ? 'bg-green-400' : (['network','scan','inspect','risk','fix','result'].indexOf(phase) > i) ? 'bg-green-400/30' : 'bg-white/5'}`} />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* PHASE 1: NETWORK DISCOVERY — user types command */}
              {phase === 'network' && (
                <motion.div key="net" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <p className="text-xs text-white/50 mb-3">You're connected to the smart home network. Use the terminal to discover devices.</p>
                  {/* Terminal */}
                  <div className="rounded border border-green-400/20 mb-4" style={{background:'rgba(0,0,0,0.5)'}}>
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-green-400/10">
                      <div className="w-2 h-2 rounded-full bg-green-400/60" />
                      <span className="text-[9px] text-green-400/60 font-mono">cyberverse@smarthome:~</span>
                    </div>
                    <div ref={termRef} className="p-3 h-40 overflow-y-auto font-mono text-[11px] text-green-400/80 space-y-0.5">
                      {terminalHistory.map((line, i) => <p key={i} className={line.startsWith('$') ? 'text-green-400' : 'text-green-400/50'}>{line}</p>)}
                    </div>
                    <div className="flex items-center border-t border-green-400/10 px-3 py-2">
                      <span className="text-green-400 text-xs font-mono mr-2">$</span>
                      <input
                        value={terminalInput}
                        onChange={e => setTerminalInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && terminalInput.trim()) handleNetworkCommand(terminalInput); }}
                        placeholder="Type 'scan' to discover devices..."
                        className="flex-1 bg-transparent text-green-400 text-xs font-mono outline-none placeholder:text-green-400/20"
                        autoFocus
                      />
                    </div>
                  </div>
                  {discoveredDevices.length >= DEVICES.length && (
                    <CyberButton onClick={() => setPhase('scan')} size="sm">PROCEED TO PORT SCANNING →</CyberButton>
                  )}
                </motion.div>
              )}

              {/* PHASE 2: PORT SCAN — user clicks devices to run scan */}
              {phase === 'scan' && (
                <motion.div key="scan" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <p className="text-xs text-white/50 mb-3">Run a port scan on each device to discover services and configuration. Click a device to scan.</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {DEVICES.map((d, i) => (
                      <button key={i} onClick={() => { if (!scanComplete.includes(i) && scanningDevice === null) { setActiveDevice(i); runPortScan(i); } else { setActiveDevice(i); } }}
                        className={`p-3 border rounded text-center transition-all ${scanComplete.includes(i) ? 'border-green-400/30 bg-green-400/5' : scanningDevice === i ? 'border-yellow-400/30 bg-yellow-400/5' : 'border-white/10 hover:border-white/30 cursor-pointer'}`}>
                        <span className="text-xl">{d.icon}</span>
                        <p className="text-[9px] text-white/50 mt-1">{d.name}</p>
                        <p className="text-[8px] text-white/25">{d.ip}</p>
                        {scanComplete.includes(i) && <p className="text-[8px] text-green-400 mt-1">SCANNED ✓</p>}
                        {scanningDevice === i && <p className="text-[8px] text-yellow-400 mt-1 animate-pulse">SCANNING...</p>}
                      </button>
                    ))}
                  </div>
                  {/* Live scan output */}
                  {(scanningDevice !== null || scanComplete.includes(activeDevice)) && (
                    <div className="rounded border border-green-400/10 p-3 mb-4 font-mono text-[10px] text-green-400/70 max-h-36 overflow-y-auto" style={{background:'rgba(0,0,0,0.4)'}}>
                      {(scanningDevice !== null ? scanLines : DEVICES[activeDevice].scanOutput).map((line, i) => (
                        <motion.p key={i} initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={{delay: scanningDevice !== null ? 0 : i*0.03}}>
                          {line || '\u00A0'}
                        </motion.p>
                      ))}
                    </div>
                  )}
                  {scanComplete.length >= DEVICES.length && (
                    <CyberButton onClick={() => setPhase('inspect')} size="sm">PROCEED TO INSPECTION →</CyberButton>
                  )}
                </motion.div>
              )}

              {/* PHASE 3: INSPECT — user clicks findings to read, then flags as vuln */}
              {phase === 'inspect' && (
                <motion.div key="inspect" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <p className="text-xs text-white/50 mb-2">Review scan results. Click each finding to inspect it, then flag items you believe are vulnerabilities.</p>
                  <div className="flex gap-2 mb-3">
                    {DEVICES.map((d,i) => (
                      <button key={i} onClick={() => setActiveDevice(i)} className={`px-3 py-1.5 text-[9px] border rounded ${activeDevice===i ? 'border-green-400/40 bg-green-400/5 text-green-400' : 'border-white/10 text-white/40'}`}>
                        {d.icon} {d.name}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5 mb-4">
                    {device.findings.map(f => {
                      const inspected = (inspectedFindings[activeDevice] || []).includes(f.id);
                      const flagged = (markedVulns[activeDevice] || []).includes(f.id);
                      return (
                        <div key={f.id} className={`p-3 border rounded transition-all ${flagged ? 'border-red-400/30 bg-red-400/5' : inspected ? 'border-white/15 bg-white/3' : 'border-white/5'}`}>
                          <div className="flex items-center justify-between">
                            <button onClick={() => inspectFinding(activeDevice, f.id)} className="text-left flex-1">
                              <p className="text-xs text-white/70">{f.label}</p>
                              {inspected && <p className="text-[9px] text-white/30 mt-0.5">{f.detail}</p>}
                              {!inspected && <p className="text-[9px] text-cyan-400/40 mt-0.5">Click to inspect →</p>}
                            </button>
                            {inspected && (
                              <button onClick={() => flagAsVulnerable(activeDevice, f.id)}
                                className={`ml-3 px-2 py-1 text-[9px] border rounded transition-all shrink-0 ${flagged ? 'border-red-400/50 bg-red-400/20 text-red-400' : 'border-white/10 text-white/30 hover:border-red-400/30 hover:text-red-400/60'}`}>
                                {flagged ? '⚠ FLAGGED' : 'FLAG'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <CyberButton onClick={() => setPhase('risk')} size="sm" disabled={!allInspected}>PROCEED TO RISK ASSESSMENT →</CyberButton>
                </motion.div>
              )}

              {/* PHASE 4: RISK IDENTIFICATION */}
              {phase === 'risk' && (
                <motion.div key="risk" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <p className="text-xs text-white/50 mb-4">Based on your investigation, what is the SINGLE BIGGEST security risk across all devices?</p>
                  <div className="space-y-2 mb-6">
                    {[
                      { id: 'default-credentials', label: 'Default/weak credentials on critical devices' },
                      { id: 'outdated-firmware', label: 'Outdated firmware with known CVEs' },
                      { id: 'open-services', label: 'Unnecessary services exposed (Telnet, WPS)' },
                      { id: 'no-encryption', label: 'Lack of encryption on communications' },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setBiggestRisk(opt.id)}
                        className={`w-full text-left p-4 border rounded transition-all ${biggestRisk === opt.id ? 'border-cyan-400/40 bg-cyan-400/5' : 'border-white/5 hover:border-white/20'}`}>
                        <p className="text-xs text-white/70">{opt.label}</p>
                      </button>
                    ))}
                  </div>
                  <CyberButton onClick={() => setPhase('fix')} size="sm" disabled={!biggestRisk}>PROCEED TO REMEDIATION →</CyberButton>
                </motion.div>
              )}

              {/* PHASE 5: FIX — user executes commands */}
              {phase === 'fix' && (
                <motion.div key="fix" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <p className="text-xs text-white/50 mb-2">Execute security fixes. Run appropriate commands — wrong actions will hurt your score.</p>
                  <div className="flex gap-2 mb-3">
                    {DEVICES.map((d,i) => (
                      <button key={i} onClick={() => setActiveDevice(i)} className={`px-3 py-1.5 text-[9px] border rounded ${activeDevice===i ? 'border-green-400/40 bg-green-400/5 text-green-400' : 'border-white/10 text-white/40'}`}>
                        {d.icon} {d.name}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5 mb-4 max-h-[250px] overflow-y-auto">
                    {device.fixes.map(fix => {
                      const executed = (executedFixes[activeDevice] || []).includes(fix.id);
                      return (
                        <div key={fix.id} className={`p-3 border rounded transition-all ${executed ? 'border-green-400/20 bg-green-400/5' : 'border-white/5 hover:border-white/20'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-white/60">{fix.description}</p>
                              <p className="text-[9px] font-mono text-green-400/40 mt-0.5">$ {fix.command}</p>
                            </div>
                            <button onClick={() => executeFix(activeDevice, fix.id)} disabled={executed}
                              className={`ml-3 px-3 py-1.5 text-[9px] border rounded transition-all shrink-0 ${executed ? 'border-green-400/30 text-green-400/50 cursor-default' : 'border-white/10 text-white/40 hover:border-green-400/40 hover:text-green-400 cursor-pointer'}`}>
                              {executed ? '✓ EXECUTED' : 'RUN'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <CyberButton onClick={handleSubmit} size="sm" disabled={!allFixed}>SUBMIT INVESTIGATION</CyberButton>
                </motion.div>
              )}

              {/* PHASE 6: RESULT — full answer key */}
              {phase === 'result' && (
                <motion.div key="result" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}}>
                  <div className="text-center mb-4">
                    <p className="text-2xl mb-2">🏠</p>
                    <p className="text-sm font-bold text-green-400">INVESTIGATION COMPLETE</p>
                  </div>

                  {/* Risk answer */}
                  <div className={`p-3 border rounded mb-4 ${biggestRisk === 'default-credentials' ? 'border-green-400/30 bg-green-400/5' : 'border-yellow-400/30 bg-yellow-400/5'}`}>
                    <p className="text-[9px] tracking-[2px] text-white/30 mb-1">BIGGEST RISK</p>
                    <p className={`text-xs ${biggestRisk === 'default-credentials' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {biggestRisk === 'default-credentials' ? '✓ Correct' : '✗ Incorrect'} — Default credentials are the #1 IoT attack vector.
                    </p>
                  </div>

                  {/* Full answer key per device */}
                  <div className="space-y-3 max-h-[250px] overflow-y-auto mb-4">
                    {DEVICES.map((d, i) => {
                      const userFlags = markedVulns[i] || [];
                      const userFixes = executedFixes[i] || [];
                      return (
                        <div key={i} className="p-3 border border-white/5 rounded" style={{background:'rgba(0,0,0,0.2)'}}>
                          <p className="text-[10px] font-bold text-cyan-400 mb-2">{d.icon} {d.name}</p>
                          <p className="text-[8px] tracking-[1px] text-white/20 mb-1">FINDINGS</p>
                          <div className="space-y-0.5 mb-2">
                            {d.findings.map(f => {
                              const flagged = userFlags.includes(f.id);
                              const correct = flagged === f.isVulnerability;
                              return (
                                <div key={f.id} className="flex items-start gap-2 text-[9px]">
                                  <span className={correct ? 'text-green-400' : 'text-red-400'}>{correct ? '✓' : '✗'}</span>
                                  <span className="text-white/50">{f.label}</span>
                                  <span className={`ml-auto shrink-0 ${f.isVulnerability ? 'text-red-400/60' : 'text-white/20'}`}>{f.isVulnerability ? 'VULN' : 'OK'}</span>
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[8px] tracking-[1px] text-white/20 mb-1">FIXES</p>
                          <div className="space-y-0.5">
                            {d.fixes.map(fx => {
                              const ran = userFixes.includes(fx.id);
                              return (
                                <div key={fx.id} className="flex items-start gap-2 text-[9px]">
                                  <span className={fx.isCorrect ? (ran ? 'text-green-400' : 'text-yellow-400') : (ran ? 'text-red-400' : 'text-white/10')}>{ran ? (fx.isCorrect ? '✓' : '✗') : (fx.isCorrect ? '○' : '—')}</span>
                                  <span className={`${ran ? 'text-white/60' : fx.isCorrect ? 'text-white/30' : 'text-white/10'}`}>{fx.description}</span>
                                  {(ran || fx.isCorrect) && <span className="text-white/20 ml-auto text-[8px]">{fx.explanation}</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Key takeaways */}
                  <div className="p-3 border border-cyan-400/10 rounded mb-4" style={{background:'rgba(0,240,255,0.02)'}}>
                    <p className="text-[9px] tracking-[2px] text-cyan-400/60 mb-1">KEY TAKEAWAYS</p>
                    <div className="space-y-1 text-[10px] text-white/50">
                      <p>• <span className="text-white/70">Always change default credentials</span> — they are publicly documented.</p>
                      <p>• <span className="text-white/70">Keep firmware updated</span> — patches fix actively exploited vulnerabilities.</p>
                      <p>• <span className="text-white/70">Disable unnecessary services</span> — every open port is an attack surface.</p>
                      <p>• <span className="text-white/70">Segment IoT devices</span> — isolate them from personal/work networks.</p>
                      <p>• <span className="text-white/70">Not everything is a vulnerability</span> — DHCP, static IPs, and standard ports are normal.</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <CyberButton onClick={() => setActiveLocation(null)} variant="ghost" size="sm">Return to City</CyberButton>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </HolographicPanel>
      </motion.div>
    </div>
  );
}
