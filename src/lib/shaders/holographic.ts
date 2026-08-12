// Custom Holographic Shader Material
// Creates a premium holographic effect with animated scan lines and fresnel glow

export const holographicVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const holographicFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScanSpeed;
  uniform float uFresnelPower;
  uniform float uGlitchIntensity;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    // Fresnel effect (edge glow)
    float fresnel = pow(1.0 - dot(vNormal, vViewDir), uFresnelPower);

    // Scan lines
    float scanLine = sin(vPosition.y * 40.0 - uTime * uScanSpeed) * 0.5 + 0.5;
    scanLine = pow(scanLine, 8.0) * 0.3;

    // Horizontal scan bar
    float scanBar = smoothstep(0.0, 0.02, abs(sin(uTime * 0.5) - vUv.y));
    scanBar = 1.0 - (1.0 - scanBar) * 0.3;

    // Glitch offset
    float glitch = 0.0;
    if (uGlitchIntensity > 0.0) {
      float glitchLine = step(0.98, random(vec2(floor(vUv.y * 20.0), floor(uTime * 3.0))));
      glitch = glitchLine * uGlitchIntensity * sin(uTime * 50.0);
    }

    // Combine
    vec3 color = uColor;
    float alpha = (fresnel * 0.6 + scanLine + 0.1) * uOpacity * scanBar;
    alpha += glitch;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Glitch effect shader for incident alley / warning states
export const glitchVertexShader = `
  uniform float uTime;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    // Vertex displacement for glitch
    float glitchStrength = step(0.95, fract(sin(dot(vec2(uTime * 2.0, position.y * 10.0), vec2(12.9898, 78.233))) * 43758.5453));
    pos.x += glitchStrength * uIntensity * sin(uTime * 50.0) * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const glitchFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform sampler2D uTexture;

  varying vec2 vUv;
  varying vec3 vPosition;

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // RGB split
    float shift = uIntensity * 0.01 * sin(uTime * 10.0);
    float r = random(vec2(floor(uv.y * 30.0), floor(uTime * 5.0)));

    if (r > 0.95) {
      uv.x += shift * 2.0;
    }

    // Scanline noise
    float noise = random(vec2(uv.y * 100.0, uTime)) * uIntensity * 0.1;

    // Color with noise
    vec3 color = uColor + vec3(noise, noise * 0.5, noise * 0.8);

    // Block glitch
    float block = step(0.97, random(vec2(floor(uv.y * 10.0), floor(uTime * 3.0))));
    color = mix(color, vec3(1.0, 0.0, 0.3), block * uIntensity * 0.5);

    float alpha = 0.8 + noise;
    gl_FragColor = vec4(color, alpha);
  }
`;

// Data stream shader - for animated flowing data
export const dataStreamVertexShader = `
  uniform float uTime;
  uniform float uSpeed;

  attribute float aOffset;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    vUv = uv;
    vProgress = fract(aOffset + uTime * uSpeed);

    vec3 pos = position;
    pos.y += sin(vProgress * 3.14159) * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = mix(1.0, 4.0, sin(vProgress * 3.14159));
  }
`;

export const dataStreamFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;

  varying vec2 vUv;
  varying float vProgress;

  void main() {
    float alpha = sin(vProgress * 3.14159) * 0.8;
    vec3 color = uColor * (1.0 + sin(uTime + vProgress * 6.28) * 0.3);
    gl_FragColor = vec4(color, alpha);
  }
`;
