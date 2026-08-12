// CYBERVERSE — Certificate Generator
// Generates a downloadable SVG certificate (no PDF library needed)

interface CertificateData {
  userName: string;
  completionDate: string;
  locationsCompleted: number;
  securityScore: number;
  conceptsLearned: string[];
}

export function generateCertificateSVG(data: CertificateData): string {
  const { userName, completionDate, locationsCompleted, securityScore, conceptsLearned } = data;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="800" height="560">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#060912"/>
      <stop offset="100%" style="stop-color:#0a0e1a"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00f0ff"/>
      <stop offset="50%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#ec4899"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="560" fill="url(#bgGrad)"/>

  <!-- Border -->
  <rect x="10" y="10" width="780" height="540" rx="4" fill="none" stroke="url(#borderGrad)" stroke-width="2" opacity="0.6"/>
  <rect x="20" y="20" width="760" height="520" rx="2" fill="none" stroke="#00f0ff" stroke-width="0.5" opacity="0.3"/>

  <!-- Corner decorations -->
  <path d="M 30 40 L 30 30 L 40 30" stroke="#00f0ff" stroke-width="2" fill="none"/>
  <path d="M 770 40 L 770 30 L 760 30" stroke="#00f0ff" stroke-width="2" fill="none"/>
  <path d="M 30 520 L 30 530 L 40 530" stroke="#8b5cf6" stroke-width="2" fill="none"/>
  <path d="M 770 520 L 770 530 L 760 530" stroke="#8b5cf6" stroke-width="2" fill="none"/>

  <!-- Header -->
  <text x="400" y="80" text-anchor="middle" fill="#00f0ff" font-family="monospace" font-size="10" letter-spacing="6" opacity="0.6">CYBERSECURITY AWARENESS</text>
  <text x="400" y="120" text-anchor="middle" fill="#00f0ff" font-family="Arial, sans-serif" font-size="32" font-weight="bold" letter-spacing="8">CERTIFICATE</text>

  <!-- Divider -->
  <line x1="200" y1="145" x2="600" y2="145" stroke="#00f0ff" stroke-width="0.5" opacity="0.4"/>

  <!-- Issued to -->
  <text x="400" y="180" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" letter-spacing="3" opacity="0.4">AWARDED TO</text>
  <text x="400" y="220" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="bold">${userName}</text>

  <!-- Achievement -->
  <text x="400" y="265" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" letter-spacing="2" opacity="0.5">FOR COMPLETING CYBERVERSE — CYBER CITY</text>

  <!-- Stats -->
  <rect x="150" y="290" width="150" height="60" rx="2" fill="none" stroke="#00f0ff" stroke-width="0.5" opacity="0.3"/>
  <text x="225" y="315" text-anchor="middle" fill="#00f0ff" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${locationsCompleted}/10</text>
  <text x="225" y="338" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" letter-spacing="2" opacity="0.4">LOCATIONS</text>

  <rect x="325" y="290" width="150" height="60" rx="2" fill="none" stroke="#8b5cf6" stroke-width="0.5" opacity="0.3"/>
  <text x="400" y="315" text-anchor="middle" fill="#8b5cf6" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${securityScore}%</text>
  <text x="400" y="338" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" letter-spacing="2" opacity="0.4">SECURITY SCORE</text>

  <rect x="500" y="290" width="150" height="60" rx="2" fill="none" stroke="#ec4899" stroke-width="0.5" opacity="0.3"/>
  <text x="575" y="315" text-anchor="middle" fill="#ec4899" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${conceptsLearned.length}</text>
  <text x="575" y="338" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" letter-spacing="2" opacity="0.4">CONCEPTS</text>

  <!-- Concepts list -->
  <text x="400" y="390" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" letter-spacing="2" opacity="0.3">CONCEPTS MASTERED</text>
  <text x="400" y="415" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" opacity="0.5">${conceptsLearned.slice(0, 6).join(' • ')}</text>
  ${conceptsLearned.length > 6 ? `<text x="400" y="435" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" opacity="0.5">${conceptsLearned.slice(6, 12).join(' • ')}</text>` : ''}

  <!-- Footer -->
  <line x1="200" y1="470" x2="600" y2="470" stroke="#8b5cf6" stroke-width="0.5" opacity="0.3"/>
  <text x="400" y="500" text-anchor="middle" fill="#00f0ff" font-family="Arial, sans-serif" font-size="14" font-weight="bold" letter-spacing="6">CYBERVERSE</text>
  <text x="400" y="525" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" letter-spacing="2" opacity="0.4">${completionDate} • EXPLORE THE DIGITAL WORLD</text>

  <!-- Scan line effect -->
  <rect x="20" y="275" width="760" height="1" fill="#00f0ff" opacity="0.05"/>
</svg>`;
}

export function downloadCertificate(data: CertificateData) {
  const svg = generateCertificateSVG(data);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CYBERVERSE_Certificate_${data.userName.replace(/\s+/g, '_')}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
