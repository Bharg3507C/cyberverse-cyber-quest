// MITRE ATT&CK Technique Mapping for CYBERVERSE scenarios

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
}

export const MITRE_MAP: Record<string, MitreTechnique[]> = {
  'account-takeover': [
    { id: 'T1110', name: 'Brute Force', tactic: 'Credential Access', description: 'Repeated authentication attempts to guess credentials.' },
    { id: 'T1078', name: 'Valid Accounts', tactic: 'Persistence', description: 'Using compromised credentials to maintain access.' },
    { id: 'T1098', name: 'Account Manipulation', tactic: 'Persistence', description: 'Modifying account permissions to escalate privileges.' },
    { id: 'T1567', name: 'Exfiltration Over Web Service', tactic: 'Exfiltration', description: 'Transferring data out via web-based channels.' },
  ],
  'privilege-escalation': [
    { id: 'T1068', name: 'Exploitation for Privilege Escalation', tactic: 'Privilege Escalation', description: 'Exploiting software vulnerability to gain elevated access.' },
    { id: 'T1078', name: 'Valid Accounts', tactic: 'Initial Access', description: 'Using legitimate credentials for initial entry.' },
    { id: 'T1530', name: 'Data from Cloud Storage', tactic: 'Collection', description: 'Accessing sensitive data from storage systems.' },
  ],
  'suspicious-login': [
    { id: 'T1078', name: 'Valid Accounts', tactic: 'Initial Access', description: 'Stolen credentials used from foreign location.' },
    { id: 'T1114', name: 'Email Collection', tactic: 'Collection', description: 'Accessing email or project data after compromise.' },
    { id: 'T1005', name: 'Data from Local System', tactic: 'Collection', description: 'Downloading files from compromised account.' },
  ],
  'compromised-device': [
    { id: 'T1071', name: 'Application Layer Protocol', tactic: 'Command and Control', description: 'Using HTTPS for C2 communication.' },
    { id: 'T1046', name: 'Network Service Discovery', tactic: 'Discovery', description: 'Scanning internal network for targets.' },
    { id: 'T1059', name: 'Command and Scripting Interpreter', tactic: 'Execution', description: 'Executing malicious binary on endpoint.' },
    { id: 'T1048', name: 'Exfiltration Over Alternative Protocol', tactic: 'Exfiltration', description: 'Sending data to external C2 server.' },
  ],
  'web-attack': [
    { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', description: 'SQL injection against web application.' },
    { id: 'T1059.007', name: 'JavaScript', tactic: 'Execution', description: 'Cross-site scripting (XSS) payload execution.' },
    { id: 'T1530', name: 'Data from Cloud Storage', tactic: 'Collection', description: 'Accessing user database through SQLi.' },
  ],
  'data-breach': [
    { id: 'T1078', name: 'Valid Accounts', tactic: 'Initial Access', description: 'Compromised API key for authentication.' },
    { id: 'T1119', name: 'Automated Collection', tactic: 'Collection', description: 'Scripted pagination through all records.' },
    { id: 'T1567', name: 'Exfiltration Over Web Service', tactic: 'Exfiltration', description: 'Mass export via API endpoint.' },
  ],
};

export function getTechniquesForScenario(scenarioId: string): MitreTechnique[] {
  return MITRE_MAP[scenarioId] || [];
}
