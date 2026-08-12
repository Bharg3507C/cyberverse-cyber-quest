import { IncidentScenario } from './types';
import { makeLog, normalLogs, timestamps } from './logGenerator';

export function getScenario(id: string): IncidentScenario {
  const s = SCENARIOS[id];
  if (!s) return SCENARIOS['account-takeover'];
  return s;
}

export function getAllScenarioMeta() {
  return Object.values(SCENARIOS).map(s => ({
    id: s.id, title: s.title, category: s.category,
    difficulty: s.difficulty, briefing: s.briefing,
  }));
}

// ============================================================
// SCENARIO 1: ACCOUNT TAKEOVER
// ============================================================
function buildAccountTakeover(): IncidentScenario {
  const user = 'alex.chen';
  const attackIp = '203.0.113.42';
  const ts = timestamps('2026-08-11T14:30:00', 25, 2, 60);

  const suspiciousLogs = [
    makeLog({ timestamp: ts[3], eventType: 'AUTH_FAILURE', user, sourceIp: attackIp, endpoint: '/login', statusCode: 401, severity: 'MEDIUM', result: 'FAILED', message: 'Invalid credentials', _isSuspicious: true, _evidenceTag: 'repeated-auth-fail' }),
    makeLog({ timestamp: ts[4], eventType: 'AUTH_FAILURE', user, sourceIp: attackIp, endpoint: '/login', statusCode: 401, severity: 'MEDIUM', result: 'FAILED', message: 'Invalid credentials', _isSuspicious: true, _evidenceTag: 'repeated-auth-fail' }),
    makeLog({ timestamp: ts[5], eventType: 'AUTH_FAILURE', user, sourceIp: attackIp, endpoint: '/login', statusCode: 401, severity: 'MEDIUM', result: 'FAILED', message: 'Invalid credentials', _isSuspicious: true, _evidenceTag: 'repeated-auth-fail' }),
    makeLog({ timestamp: ts[7], eventType: 'AUTH_SUCCESS', user, sourceIp: attackIp, endpoint: '/login', statusCode: 200, severity: 'INFO', result: 'SUCCESS', message: 'Login successful', _isSuspicious: true, _evidenceTag: 'suspicious-login' }),
    makeLog({ timestamp: ts[9], eventType: 'SESSION_CREATE', user, sourceIp: attackIp, device: 'Unknown Linux', severity: 'LOW', result: 'SUCCESS', message: 'New session from unrecognized device', _isSuspicious: true, _evidenceTag: 'new-device' }),
    makeLog({ timestamp: ts[12], eventType: 'PRIVILEGE_CHANGE', user, sourceIp: attackIp, action: 'admin_role_assigned', severity: 'HIGH', result: 'SUCCESS', message: 'Admin role assigned to user', _isSuspicious: true, _evidenceTag: 'priv-escalation' }),
    makeLog({ timestamp: ts[14], eventType: 'DATA_EXPORT', user, sourceIp: attackIp, endpoint: '/api/data/export', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Database export initiated (2.4GB)', _isSuspicious: true, _evidenceTag: 'data-exfil' }),
    makeLog({ timestamp: ts[16], eventType: 'CONFIG_CHANGE', user, sourceIp: attackIp, action: 'firewall_rule_added', severity: 'CRITICAL', result: 'SUCCESS', message: 'New outbound rule port 445', _isSuspicious: true, _evidenceTag: 'config-change' }),
  ];

  const normal = normalLogs(user, ts, 12);
  const allLogs = [...normal, ...suspiciousLogs].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    id: 'account-takeover',
    title: 'SUSPICIOUS ACCOUNT ACTIVITY',
    briefing: 'The SOC received an automated alert about unusual activity on a user account. You have been assigned to investigate. Review the logs and determine what happened.',
    objective: 'Identify the attack chain and recommend appropriate remediation.',
    category: 'account-takeover',
    difficulty: 'beginner',
    logs: allLogs,
    expectedEvidence: suspiciousLogs.map(l => l.id),
    correctTimelineOrder: suspiciousLogs.map(l => l.id),
    hypotheses: [
      { id: 'h1', label: 'Normal user activity', description: 'The user performed routine tasks', isCorrect: false },
      { id: 'h2', label: 'Credential attack leading to account takeover', description: 'Attacker brute-forced credentials and gained unauthorized access', isCorrect: true },
      { id: 'h3', label: 'System maintenance', description: 'IT team performed scheduled changes', isCorrect: false },
      { id: 'h4', label: 'User locked out accidentally', description: 'User forgot password and recovered', isCorrect: false },
    ],
    accountState: {
      user, mfaEnabled: false, activeSessions: 3, adminRole: true,
      passwordAgeDays: 180, accountLocked: false,
      lastLogin: ts[7], suspiciousSessionIds: ['sess-ext-001'],
    },
    remediationActions: [
      { id: 'r1', label: 'Enable MFA', description: 'Require multi-factor authentication', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r2', label: 'Revoke suspicious session', description: 'Terminate the session from unknown device', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'access' },
      { id: 'r3', label: 'Reset password', description: 'Force password reset', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r4', label: 'Remove admin privilege', description: 'Revoke the unauthorized role', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'access' },
      { id: 'r5', label: 'Lock account permanently', description: 'Disable the account entirely', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -10, category: 'access' },
      { id: 'r6', label: 'Create security alert', description: 'Notify security team', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'monitoring' },
      { id: 'r7', label: 'Delete user account', description: 'Permanently remove user', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -15, category: 'access' },
    ],
    quizQuestions: [
      { id: 'q1', question: 'Which pattern most strongly suggests a credential attack?', options: [
        { id: 'a', label: 'Single failed login', isCorrect: false },
        { id: 'b', label: 'Multiple rapid failed logins followed by success from same IP', isCorrect: true },
        { id: 'c', label: 'Successful login from known device', isCorrect: false },
        { id: 'd', label: 'User logout event', isCorrect: false },
      ], explanation: 'Rapid repeated failures followed by success from the same external IP indicates brute-force or credential stuffing.', points: 20 },
      { id: 'q2', question: 'Why was the privilege escalation event critical?', options: [
        { id: 'a', label: 'It happens during every login', isCorrect: false },
        { id: 'b', label: 'Admin access was granted without authorization after suspicious login', isCorrect: true },
        { id: 'c', label: 'The user requested it through proper channels', isCorrect: false },
        { id: 'd', label: 'It triggered a system restart', isCorrect: false },
      ], explanation: 'Privilege escalation immediately after a suspicious login indicates the attacker is expanding access.', points: 20 },
      { id: 'q3', question: 'Which remediation reduces the most immediate risk?', options: [
        { id: 'a', label: 'Update the company website', isCorrect: false },
        { id: 'b', label: 'Revoke suspicious session and remove unauthorized privileges', isCorrect: true },
        { id: 'c', label: 'Send an email to the user', isCorrect: false },
        { id: 'd', label: 'Restart the server', isCorrect: false },
      ], explanation: 'Immediate session revocation stops active unauthorized access. Privilege removal prevents further damage.', points: 20 },
    ],
    conceptsTaught: ['Credential Attack', 'Account Takeover', 'Privilege Escalation', 'Session Management', 'Incident Response'],
    explanation: 'The attacker performed a credential-stuffing attack against alex.chen, succeeding after multiple attempts. They immediately escalated privileges, exported data, and modified firewall rules to enable exfiltration.',
  };
}

// ============================================================
// SCENARIO 2: PRIVILEGE ESCALATION
// ============================================================
function buildPrivilegeEscalation(): IncidentScenario {
  const user = 'priya.sharma';
  const attackIp = '198.51.100.33';
  const ts = timestamps('2026-08-11T09:15:00', 20, 5, 90);

  const suspicious = [
    makeLog({ timestamp: ts[2], eventType: 'AUTH_SUCCESS', user, sourceIp: attackIp, endpoint: '/login', statusCode: 200, severity: 'INFO', result: 'SUCCESS', message: 'Login successful', _isSuspicious: true, _evidenceTag: 'external-login' }),
    makeLog({ timestamp: ts[5], eventType: 'HTTP_REQUEST', user, sourceIp: attackIp, endpoint: '/admin/users', httpMethod: 'GET', statusCode: 403, severity: 'MEDIUM', result: 'FAILED', message: 'Unauthorized access attempt', _isSuspicious: true, _evidenceTag: 'unauth-access' }),
    makeLog({ timestamp: ts[6], eventType: 'HTTP_REQUEST', user, sourceIp: attackIp, endpoint: '/admin/roles', httpMethod: 'POST', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Role modification', _isSuspicious: true, _evidenceTag: 'role-mod' }),
    makeLog({ timestamp: ts[8], eventType: 'PRIVILEGE_CHANGE', user, sourceIp: attackIp, action: 'super_admin_assigned', severity: 'CRITICAL', result: 'SUCCESS', message: 'Super admin role self-assigned', _isSuspicious: true, _evidenceTag: 'self-escalation' }),
    makeLog({ timestamp: ts[10], eventType: 'DATA_ACCESS', user, sourceIp: attackIp, endpoint: '/api/employees/salaries', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Accessed salary database', _isSuspicious: true, _evidenceTag: 'sensitive-access' }),
    makeLog({ timestamp: ts[12], eventType: 'FILE_DOWNLOAD', user, sourceIp: attackIp, endpoint: '/api/export/hr-records', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'HR records exported', _isSuspicious: true, _evidenceTag: 'data-download' }),
  ];

  const normal = normalLogs(user, ts, 10);
  const allLogs = [...normal, ...suspicious].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    id: 'privilege-escalation', title: 'UNAUTHORIZED PRIVILEGE ESCALATION',
    briefing: 'A user account is showing access to resources outside their normal scope. Investigate the activity and determine if this is authorized.',
    objective: 'Determine if the privilege change was legitimate and respond appropriately.',
    category: 'privilege-escalation', difficulty: 'intermediate',
    logs: allLogs, expectedEvidence: suspicious.map(l => l.id),
    correctTimelineOrder: suspicious.map(l => l.id),
    hypotheses: [
      { id: 'h1', label: 'Authorized role change by IT', description: 'IT granted new permissions', isCorrect: false },
      { id: 'h2', label: 'User exploited vulnerability to self-escalate', description: 'User bypassed controls to gain admin', isCorrect: true },
      { id: 'h3', label: 'Automated system process', description: 'Scheduled permission rotation', isCorrect: false },
      { id: 'h4', label: 'Testing by security team', description: 'Penetration test activity', isCorrect: false },
    ],
    accountState: { user, mfaEnabled: true, activeSessions: 2, adminRole: true, passwordAgeDays: 45, accountLocked: false, lastLogin: ts[2], suspiciousSessionIds: ['sess-ext-002'] },
    remediationActions: [
      { id: 'r1', label: 'Remove super admin privilege', description: 'Revoke unauthorized role immediately', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'access' },
      { id: 'r2', label: 'Revoke active session', description: 'Terminate current sessions', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'access' },
      { id: 'r3', label: 'Audit role modification endpoint', description: 'Review /admin/roles for vulnerabilities', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'monitoring' },
      { id: 'r4', label: 'Reset password', description: 'Force credential reset', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r5', label: 'Delete all HR data', description: 'Remove sensitive records', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -15, category: 'access' },
      { id: 'r6', label: 'Block external IP', description: 'Add IP to blocklist', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'network' },
    ],
    quizQuestions: [
      { id: 'q1', question: 'What indicated the privilege escalation was unauthorized?', options: [
        { id: 'a', label: 'User self-assigned super admin without a change request', isCorrect: true },
        { id: 'b', label: 'User logged in successfully', isCorrect: false },
        { id: 'c', label: 'Session was from internal IP', isCorrect: false },
        { id: 'd', label: 'MFA was already enabled', isCorrect: false },
      ], explanation: 'Self-assigned admin roles without proper authorization workflow is a key indicator of privilege escalation attacks.', points: 20 },
      { id: 'q2', question: 'Why was accessing /admin/roles significant?', options: [
        { id: 'a', label: 'It is a public endpoint', isCorrect: false },
        { id: 'b', label: 'It allowed direct role manipulation bypassing approval', isCorrect: true },
        { id: 'c', label: 'All users access it daily', isCorrect: false },
        { id: 'd', label: 'It only shows read-only data', isCorrect: false },
      ], explanation: 'Direct POST to role modification endpoints suggests exploitation of insufficient access controls.', points: 20 },
    ],
    conceptsTaught: ['Privilege Escalation', 'Broken Access Control', 'Least Privilege', 'Audit Logging'],
    explanation: 'The user exploited an improperly secured admin endpoint to self-assign super admin privileges, then accessed and exported sensitive HR data.',
  };
}

// ============================================================
// SCENARIO 3: SUSPICIOUS LOGIN
// ============================================================
function buildSuspiciousLogin(): IncidentScenario {
  const user = 'marco.rossi';
  const foreignIp = '192.0.2.88';
  const ts = timestamps('2026-08-11T02:05:00', 18, 10, 120);

  const suspicious = [
    makeLog({ timestamp: ts[1], eventType: 'AUTH_SUCCESS', user, sourceIp: foreignIp, device: 'Firefox/Linux', severity: 'INFO', result: 'SUCCESS', message: 'Login from unusual location', userAgent: 'Firefox/128 Linux', _isSuspicious: true, _evidenceTag: 'unusual-location' }),
    makeLog({ timestamp: ts[2], eventType: 'DEVICE_REGISTER', user, sourceIp: foreignIp, device: 'New Linux Workstation', severity: 'MEDIUM', result: 'SUCCESS', message: 'New device registered', _isSuspicious: true, _evidenceTag: 'new-device' }),
    makeLog({ timestamp: ts[4], eventType: 'SESSION_CREATE', user, sourceIp: foreignIp, severity: 'LOW', result: 'SUCCESS', message: 'Session created at 02:12 AM', _isSuspicious: true, _evidenceTag: 'odd-hours' }),
    makeLog({ timestamp: ts[7], eventType: 'DATA_ACCESS', user, sourceIp: foreignIp, endpoint: '/api/projects/confidential', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Accessed confidential project files', _isSuspicious: true, _evidenceTag: 'sensitive-access' }),
    makeLog({ timestamp: ts[9], eventType: 'FILE_DOWNLOAD', user, sourceIp: foreignIp, endpoint: '/api/download/project-alpha', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Downloaded project-alpha archive (850MB)', _isSuspicious: true, _evidenceTag: 'large-download' }),
  ];

  const normal = normalLogs(user, ts, 8);
  const allLogs = [...normal, ...suspicious].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    id: 'suspicious-login', title: 'UNUSUAL LOGIN ACTIVITY',
    briefing: 'Monitoring detected a login from an unusual geographic location during off-hours. The user typically works from the office during business hours. Investigate.',
    objective: 'Determine if this login is legitimate or compromised credentials.',
    category: 'suspicious-login', difficulty: 'beginner',
    logs: allLogs, expectedEvidence: suspicious.map(l => l.id),
    correctTimelineOrder: suspicious.map(l => l.id),
    hypotheses: [
      { id: 'h1', label: 'User is traveling and working remotely', description: 'Legitimate remote access', isCorrect: false },
      { id: 'h2', label: 'Compromised credentials used from foreign location', description: 'Stolen credentials in use', isCorrect: true },
      { id: 'h3', label: 'VPN routing issue showing wrong location', description: 'Technical glitch', isCorrect: false },
      { id: 'h4', label: 'Shared account used by colleague', description: 'Password sharing', isCorrect: false },
    ],
    accountState: { user, mfaEnabled: false, activeSessions: 2, adminRole: false, passwordAgeDays: 220, accountLocked: false, lastLogin: ts[1], suspiciousSessionIds: ['sess-foreign-001'] },
    remediationActions: [
      { id: 'r1', label: 'Enable MFA', description: 'Add second factor requirement', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r2', label: 'Revoke foreign session', description: 'Terminate the suspicious session', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'access' },
      { id: 'r3', label: 'Force password reset', description: 'Require new credentials', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r4', label: 'Contact user to verify', description: 'Confirm if login was legitimate', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'monitoring' },
      { id: 'r5', label: 'Delete downloaded files from server', description: 'Remove project files entirely', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -10, category: 'access' },
      { id: 'r6', label: 'Block source IP', description: 'Add to firewall blocklist', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'network' },
    ],
    quizQuestions: [
      { id: 'q1', question: 'What combination of factors made this login suspicious?', options: [
        { id: 'a', label: 'Off-hours + unusual location + new device + sensitive data access', isCorrect: true },
        { id: 'b', label: 'Successful login only', isCorrect: false },
        { id: 'c', label: 'Using Firefox browser', isCorrect: false },
        { id: 'd', label: 'Accessing the dashboard', isCorrect: false },
      ], explanation: 'Multiple anomalies together — unusual time, location, device, and accessing sensitive data — strongly indicate compromise.', points: 20 },
      { id: 'q2', question: 'Why is the 220-day-old password relevant?', options: [
        { id: 'a', label: 'Old passwords are more likely to have been leaked or cracked', isCorrect: true },
        { id: 'b', label: 'Passwords never expire', isCorrect: false },
        { id: 'c', label: 'It means the user is inactive', isCorrect: false },
        { id: 'd', label: 'It has no security relevance', isCorrect: false },
      ], explanation: 'Stale passwords increase risk of credential compromise from data breaches or brute-force over time.', points: 20 },
    ],
    conceptsTaught: ['Impossible Travel', 'Credential Compromise', 'Behavioral Analysis', 'Session Security'],
    explanation: 'Stolen credentials were used from a foreign IP during off-hours. The attacker registered a new device and exfiltrated confidential project data.',
  };
}

// ============================================================
// SCENARIO 4: COMPROMISED DEVICE
// ============================================================
function buildCompromisedDevice(): IncidentScenario {
  const user = 'sarah.oconnor';
  const c2Ip = '203.0.113.157';
  const ts = timestamps('2026-08-11T11:00:00', 20, 15, 180);

  const suspicious = [
    makeLog({ timestamp: ts[3], eventType: 'DNS_QUERY', user, sourceIp: '10.0.1.22', destination: 'update-service-cdn.xyz', severity: 'LOW', result: 'SUCCESS', message: 'DNS query to unknown domain', _isSuspicious: true, _evidenceTag: 'suspicious-dns' }),
    makeLog({ timestamp: ts[5], eventType: 'NETWORK_SCAN', user, sourceIp: '10.0.1.22', destination: '10.0.0.0/24', severity: 'HIGH', result: 'SUCCESS', message: 'Internal network scan detected', _isSuspicious: true, _evidenceTag: 'lateral-scan' }),
    makeLog({ timestamp: ts[7], eventType: 'FIREWALL_ALLOW', user, sourceIp: '10.0.1.22', destination: c2Ip, statusCode: 200, severity: 'MEDIUM', result: 'SUCCESS', message: 'Outbound connection to external host on port 443', _isSuspicious: true, _evidenceTag: 'c2-connection' }),
    makeLog({ timestamp: ts[9], eventType: 'FILE_DOWNLOAD', user, sourceIp: '10.0.1.22', endpoint: '/tmp/svc-update.bin', severity: 'HIGH', result: 'SUCCESS', message: 'Binary downloaded from external host', _isSuspicious: true, _evidenceTag: 'malware-download' }),
    makeLog({ timestamp: ts[12], eventType: 'PRIVILEGE_CHANGE', user, sourceIp: '10.0.1.22', action: 'local_admin_added', severity: 'CRITICAL', result: 'SUCCESS', message: 'Local admin privilege escalation', _isSuspicious: true, _evidenceTag: 'local-priv-esc' }),
    makeLog({ timestamp: ts[14], eventType: 'DATA_EXPORT', user, sourceIp: '10.0.1.22', destination: c2Ip, severity: 'CRITICAL', result: 'SUCCESS', message: 'Large data transfer to external IP (3.1GB)', _isSuspicious: true, _evidenceTag: 'exfiltration' }),
  ];

  const normal = normalLogs(user, ts, 10);
  const allLogs = [...normal, ...suspicious].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    id: 'compromised-device', title: 'ENDPOINT COMPROMISE',
    briefing: 'EDR flagged anomalous network behavior from an employee workstation. The device is making unusual outbound connections. Investigate the endpoint activity.',
    objective: 'Identify if the device is compromised and determine the attack vector.',
    category: 'compromised-device', difficulty: 'intermediate',
    logs: allLogs, expectedEvidence: suspicious.map(l => l.id),
    correctTimelineOrder: suspicious.map(l => l.id),
    hypotheses: [
      { id: 'h1', label: 'User running authorized security tools', description: 'Legitimate scan', isCorrect: false },
      { id: 'h2', label: 'Malware infection with C2 communication', description: 'Device compromised by malware', isCorrect: true },
      { id: 'h3', label: 'Software update process', description: 'Automatic updates', isCorrect: false },
      { id: 'h4', label: 'Network misconfiguration', description: 'Routing error', isCorrect: false },
    ],
    accountState: { user, mfaEnabled: true, activeSessions: 1, adminRole: false, passwordAgeDays: 30, accountLocked: false, lastLogin: ts[0], suspiciousSessionIds: [] },
    remediationActions: [
      { id: 'r1', label: 'Isolate device from network', description: 'Quarantine the endpoint immediately', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'network' },
      { id: 'r2', label: 'Block C2 IP at firewall', description: 'Prevent further communication', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'network' },
      { id: 'r3', label: 'Run full malware scan', description: 'Identify and remove malicious files', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'monitoring' },
      { id: 'r4', label: 'Block suspicious domain', description: 'Add DNS block for update-service-cdn.xyz', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'network' },
      { id: 'r5', label: 'Wipe and reimage device', description: 'Clean rebuild of workstation', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'access' },
      { id: 'r6', label: 'Disable all user accounts', description: 'Lock every account in the org', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -15, category: 'access' },
    ],
    quizQuestions: [
      { id: 'q1', question: 'What indicated command-and-control (C2) activity?', options: [
        { id: 'a', label: 'DNS query to unknown domain + outbound connection + data exfiltration', isCorrect: true },
        { id: 'b', label: 'User logged in normally', isCorrect: false },
        { id: 'c', label: 'File was opened', isCorrect: false },
        { id: 'd', label: 'DNS query to google.com', isCorrect: false },
      ], explanation: 'C2 indicators: suspicious DNS → connection to external host → binary download → data exfiltration pattern.', points: 20 },
      { id: 'q2', question: 'Why was network isolation the priority?', options: [
        { id: 'a', label: 'To prevent lateral movement and stop data exfiltration', isCorrect: true },
        { id: 'b', label: 'To speed up the computer', isCorrect: false },
        { id: 'c', label: 'Standard IT procedure for all devices', isCorrect: false },
        { id: 'd', label: 'To update the firmware', isCorrect: false },
      ], explanation: 'Isolation contains the threat by stopping lateral scanning and cutting off C2 communication.', points: 20 },
    ],
    conceptsTaught: ['Malware', 'Command & Control', 'Lateral Movement', 'Network Forensics', 'Endpoint Security'],
    explanation: 'The workstation was infected with malware that established C2 communication, performed internal reconnaissance, escalated privileges, and exfiltrated data.',
  };
}

// ============================================================
// SCENARIO 5: WEB ATTACK
// ============================================================
function buildWebAttack(): IncidentScenario {
  const attackIp = '203.0.113.99';
  const ts = timestamps('2026-08-11T16:45:00', 22, 1, 30);

  const suspicious = [
    makeLog({ timestamp: ts[2], eventType: 'HTTP_REQUEST', user: 'anonymous', sourceIp: attackIp, endpoint: "/api/users?id=1' OR '1'='1", httpMethod: 'GET', statusCode: 500, severity: 'HIGH', result: 'FAILED', message: 'SQL syntax error in request', _isSuspicious: true, _evidenceTag: 'sqli-attempt' }),
    makeLog({ timestamp: ts[3], eventType: 'HTTP_REQUEST', user: 'anonymous', sourceIp: attackIp, endpoint: "/api/users?id=1 UNION SELECT * FROM credentials--", httpMethod: 'GET', statusCode: 200, severity: 'CRITICAL', result: 'SUCCESS', message: 'Unusual query returned data', _isSuspicious: true, _evidenceTag: 'sqli-success' }),
    makeLog({ timestamp: ts[5], eventType: 'HTTP_REQUEST', user: 'anonymous', sourceIp: attackIp, endpoint: '/api/admin/config', httpMethod: 'GET', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Admin config accessed without auth', _isSuspicious: true, _evidenceTag: 'broken-access' }),
    makeLog({ timestamp: ts[8], eventType: 'HTTP_REQUEST', user: 'anonymous', sourceIp: attackIp, endpoint: "/search?q=<script>fetch('http://evil.test')</script>", httpMethod: 'GET', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Reflected input in response', _isSuspicious: true, _evidenceTag: 'xss-attempt' }),
    makeLog({ timestamp: ts[11], eventType: 'DATA_ACCESS', user: 'anonymous', sourceIp: attackIp, endpoint: '/api/users/export', statusCode: 200, severity: 'CRITICAL', result: 'SUCCESS', message: 'Full user database accessed', _isSuspicious: true, _evidenceTag: 'data-breach' }),
  ];

  const normal = normalLogs('dev.patel', ts, 12);
  const allLogs = [...normal, ...suspicious].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    id: 'web-attack', title: 'WEB APPLICATION ATTACK',
    briefing: 'WAF alerts detected unusual request patterns against the web application. Multiple suspicious payloads observed. Analyze the traffic.',
    objective: 'Identify the attack types and assess the damage.',
    category: 'web-attack', difficulty: 'advanced',
    logs: allLogs, expectedEvidence: suspicious.map(l => l.id),
    correctTimelineOrder: suspicious.map(l => l.id),
    hypotheses: [
      { id: 'h1', label: 'Automated vulnerability scanner', description: 'Routine security testing', isCorrect: false },
      { id: 'h2', label: 'SQL injection + XSS attack with data breach', description: 'Attacker exploited web vulnerabilities', isCorrect: true },
      { id: 'h3', label: 'Developer testing API endpoints', description: 'Internal QA testing', isCorrect: false },
      { id: 'h4', label: 'Bot crawling public pages', description: 'Search engine indexing', isCorrect: false },
    ],
    accountState: { user: 'web-app-service', mfaEnabled: false, activeSessions: 0, adminRole: false, passwordAgeDays: 0, accountLocked: false, lastLogin: '', suspiciousSessionIds: [] },
    remediationActions: [
      { id: 'r1', label: 'Block attacker IP', description: 'Add to WAF blocklist', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'network' },
      { id: 'r2', label: 'Fix SQL injection vulnerability', description: 'Implement parameterized queries', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'access' },
      { id: 'r3', label: 'Fix XSS vulnerability', description: 'Implement output encoding', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'access' },
      { id: 'r4', label: 'Add authentication to admin endpoints', description: 'Require auth for /admin/*', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r5', label: 'Notify affected users', description: 'Disclosure of data breach', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'documentation' },
      { id: 'r6', label: 'Shut down entire web server', description: 'Take everything offline', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -10, category: 'access' },
    ],
    quizQuestions: [
      { id: 'q1', question: "What does the payload \"1' OR '1'='1\" indicate?", options: [
        { id: 'a', label: 'SQL injection attempt', isCorrect: true },
        { id: 'b', label: 'Normal search query', isCorrect: false },
        { id: 'c', label: 'Password reset request', isCorrect: false },
        { id: 'd', label: 'JavaScript function', isCorrect: false },
      ], explanation: "This is a classic SQL injection payload that attempts to bypass authentication or extract data by manipulating the SQL query.", points: 20 },
      { id: 'q2', question: 'What is the most critical vulnerability to fix first?', options: [
        { id: 'a', label: 'SQL injection — it enabled direct database access', isCorrect: true },
        { id: 'b', label: 'Change the server color scheme', isCorrect: false },
        { id: 'c', label: 'Update the logo', isCorrect: false },
        { id: 'd', label: 'Add more logging', isCorrect: false },
      ], explanation: 'SQL injection gave direct database access leading to full data breach — highest severity fix.', points: 20 },
    ],
    conceptsTaught: ['SQL Injection', 'XSS', 'Broken Access Control', 'WAF', 'Web Application Security'],
    explanation: 'Attacker exploited SQL injection to extract credentials, accessed unprotected admin endpoints, attempted XSS, and exfiltrated the user database.',
  };
}

// ============================================================
// SCENARIO 6: DATA BREACH
// ============================================================
function buildDataBreach(): IncidentScenario {
  const user = 'jamie.wong';
  const extIp = '198.51.100.33';
  const ts = timestamps('2026-08-11T22:00:00', 18, 30, 300);

  const suspicious = [
    makeLog({ timestamp: ts[2], eventType: 'AUTH_SUCCESS', user, sourceIp: extIp, severity: 'INFO', result: 'SUCCESS', message: 'Login via API key', _isSuspicious: true, _evidenceTag: 'api-key-login' }),
    makeLog({ timestamp: ts[4], eventType: 'DATA_ACCESS', user, sourceIp: extIp, endpoint: '/api/customers', statusCode: 200, severity: 'MEDIUM', result: 'SUCCESS', message: 'Customer records queried (page 1-50)', _isSuspicious: true, _evidenceTag: 'bulk-query' }),
    makeLog({ timestamp: ts[5], eventType: 'DATA_ACCESS', user, sourceIp: extIp, endpoint: '/api/customers', statusCode: 200, severity: 'MEDIUM', result: 'SUCCESS', message: 'Customer records queried (page 51-100)', _isSuspicious: true, _evidenceTag: 'bulk-query' }),
    makeLog({ timestamp: ts[6], eventType: 'DATA_ACCESS', user, sourceIp: extIp, endpoint: '/api/customers', statusCode: 200, severity: 'HIGH', result: 'SUCCESS', message: 'Customer records queried (page 101-200)', _isSuspicious: true, _evidenceTag: 'bulk-query' }),
    makeLog({ timestamp: ts[8], eventType: 'DATA_EXPORT', user, sourceIp: extIp, endpoint: '/api/export/all-customers', statusCode: 200, severity: 'CRITICAL', result: 'SUCCESS', message: 'Full customer database exported (45K records)', _isSuspicious: true, _evidenceTag: 'mass-export' }),
    makeLog({ timestamp: ts[10], eventType: 'SESSION_DESTROY', user, sourceIp: extIp, severity: 'INFO', result: 'SUCCESS', message: 'Session terminated by user', _isSuspicious: true, _evidenceTag: 'cleanup' }),
  ];

  const normal = normalLogs(user, ts, 8);
  const allLogs = [...normal, ...suspicious].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return {
    id: 'data-breach', title: 'UNUSUAL DATA ACCESS PATTERN',
    briefing: 'DLP monitoring detected an unusually large data export from the customer database during off-hours. A service account was used. Investigate the activity.',
    objective: 'Determine if this was authorized access or a data breach.',
    category: 'data-breach', difficulty: 'intermediate',
    logs: allLogs, expectedEvidence: suspicious.map(l => l.id),
    correctTimelineOrder: suspicious.map(l => l.id),
    hypotheses: [
      { id: 'h1', label: 'Scheduled backup process', description: 'Automated system backup', isCorrect: false },
      { id: 'h2', label: 'Compromised API key used for data exfiltration', description: 'Stolen credentials used to steal customer data', isCorrect: true },
      { id: 'h3', label: 'Marketing team pulling reports', description: 'Authorized analytics export', isCorrect: false },
      { id: 'h4', label: 'Database migration', description: 'IT moving data between systems', isCorrect: false },
    ],
    accountState: { user, mfaEnabled: false, activeSessions: 0, adminRole: false, passwordAgeDays: 365, accountLocked: false, lastLogin: ts[2], suspiciousSessionIds: [] },
    remediationActions: [
      { id: 'r1', label: 'Rotate API keys', description: 'Invalidate all existing API credentials', isAppropriate: true, pointsCorrect: 30, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r2', label: 'Enable rate limiting', description: 'Prevent bulk data extraction', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'network' },
      { id: 'r3', label: 'Add MFA to API access', description: 'Require additional verification', isAppropriate: true, pointsCorrect: 20, pointsIncorrect: -5, category: 'authentication' },
      { id: 'r4', label: 'Notify affected customers', description: 'Data breach disclosure', isAppropriate: true, pointsCorrect: 25, pointsIncorrect: -5, category: 'documentation' },
      { id: 'r5', label: 'Audit API access logs', description: 'Review all recent API usage', isAppropriate: true, pointsCorrect: 15, pointsIncorrect: -5, category: 'monitoring' },
      { id: 'r6', label: 'Delete all customer data', description: 'Remove records to prevent future breach', isAppropriate: false, pointsCorrect: 0, pointsIncorrect: -15, category: 'access' },
    ],
    quizQuestions: [
      { id: 'q1', question: 'What pattern indicated data exfiltration rather than normal use?', options: [
        { id: 'a', label: 'Sequential bulk pagination + full export during off-hours', isCorrect: true },
        { id: 'b', label: 'Single record access', isCorrect: false },
        { id: 'c', label: 'User logged out afterward', isCorrect: false },
        { id: 'd', label: 'Used an API key', isCorrect: false },
      ], explanation: 'Systematic pagination through all records followed by a mass export, especially during off-hours, indicates deliberate data theft.', points: 20 },
      { id: 'q2', question: 'Why is API key rotation critical after this incident?', options: [
        { id: 'a', label: 'The compromised key still grants access until rotated', isCorrect: true },
        { id: 'b', label: 'It makes the API faster', isCorrect: false },
        { id: 'c', label: 'It changes the database schema', isCorrect: false },
        { id: 'd', label: 'It is only needed annually', isCorrect: false },
      ], explanation: 'Until the API key is rotated, the attacker can continue accessing data using the same credentials.', points: 20 },
    ],
    conceptsTaught: ['Data Loss Prevention', 'API Security', 'Credential Management', 'Data Breach Response'],
    explanation: 'A compromised API key was used to systematically extract all customer records. The attacker paginated through data and performed a full export during off-hours to avoid detection.',
  };
}

// ============================================================
// SCENARIO REGISTRY
// ============================================================
const SCENARIOS: Record<string, IncidentScenario> = {
  'account-takeover': buildAccountTakeover(),
  'privilege-escalation': buildPrivilegeEscalation(),
  'suspicious-login': buildSuspiciousLogin(),
  'compromised-device': buildCompromisedDevice(),
  'web-attack': buildWebAttack(),
  'data-breach': buildDataBreach(),
};
