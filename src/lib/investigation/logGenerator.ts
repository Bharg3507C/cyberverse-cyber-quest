import { SecurityLog, EventType, Severity } from './types';

let counter = 10000;
const nextId = () => `EVT-${++counter}`;
const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const EXTERNAL_IPS = ['203.0.113.42','203.0.113.99','203.0.113.157','198.51.100.33','192.0.2.88'];
const INTERNAL_IPS = ['10.0.1.15','10.0.1.22','10.0.2.5','10.0.2.18','10.0.3.7'];
const AGENTS = ['Chrome/125 Windows','Safari/17 macOS','Firefox/128 Linux','curl/8.7','python-requests/2.32'];
const USERS = ['alex.chen','priya.sharma','marco.rossi','sarah.oconnor','dev.patel','jamie.wong'];

export function timestamps(base: string, count: number, gapMin = 2, gapMax = 30): string[] {
  const out: string[] = [];
  let t = new Date(base).getTime();
  for (let i = 0; i < count; i++) {
    out.push(new Date(t).toISOString().replace('T', ' ').slice(0, 19));
    t += rand(gapMin, gapMax) * 1000;
  }
  return out;
}

export function makeLog(o: Partial<SecurityLog> & { _isSuspicious: boolean }): SecurityLog {
  return {
    id: o.id || nextId(),
    timestamp: o.timestamp || '',
    eventId: o.eventId || nextId(),
    eventType: o.eventType || 'HTTP_REQUEST',
    user: o.user || pick(USERS),
    sourceIp: o.sourceIp || pick(INTERNAL_IPS),
    destination: o.destination,
    endpoint: o.endpoint || '/dashboard',
    httpMethod: o.httpMethod,
    statusCode: o.statusCode ?? 200,
    severity: o.severity || 'INFO',
    action: o.action,
    device: o.device,
    userAgent: o.userAgent || pick(AGENTS),
    result: o.result || 'SUCCESS',
    message: o.message || '',
    _isSuspicious: o._isSuspicious,
    _evidenceTag: o._evidenceTag,
  };
}

export function normalLogs(user: string, ts: string[], count: number): SecurityLog[] {
  const normals: { t: EventType; m: string; s: Severity }[] = [
    { t: 'USER_LOGIN', m: 'Successful login', s: 'INFO' },
    { t: 'USER_LOGOUT', m: 'User logged out', s: 'INFO' },
    { t: 'HTTP_REQUEST', m: 'GET /dashboard', s: 'INFO' },
    { t: 'FILE_ACCESS', m: 'Viewed quarterly report', s: 'INFO' },
    { t: 'SESSION_CREATE', m: 'Session created', s: 'INFO' },
    { t: 'DNS_QUERY', m: 'DNS lookup internal', s: 'INFO' },
  ];
  return Array.from({ length: count }, (_, i) => {
    const e = pick(normals);
    return makeLog({
      timestamp: ts[i % ts.length],
      eventType: e.t, user: i % 3 === 0 ? pick(USERS) : user,
      sourceIp: pick(INTERNAL_IPS), severity: e.s, result: 'SUCCESS',
      statusCode: 200, message: e.m, _isSuspicious: false,
    });
  });
}
