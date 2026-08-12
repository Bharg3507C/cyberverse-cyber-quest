'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Custom post-processing without @react-three/postprocessing dependency.
 * Uses a fullscreen quad with a shader for bloom-like glow + vignette + scanlines.
 */

const postVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const postFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uVignetteIntensity;
  uniform float uScanlineIntensity;
  uniform float uChromaticAberration;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Chromatic aberration
    float aberration = uChromaticAberration * 0.003;
    float r = texture2D(tDiffuse, uv + vec2(aberration, 0.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - vec2(aberration, 0.0)).b;
    vec3 color = vec3(r, g, b);

    // Scanlines
    float scanline = sin(uv.y * 800.0 + uTime * 2.0) * 0.5 + 0.5;
    color -= scanline * uScanlineIntensity * 0.02;

    // Vignette
    vec2 vigUv = uv * (1.0 - uv.yx);
    float vig = vigUv.x * vigUv.y * 15.0;
    vig = pow(vig, uVignetteIntensity);
    color *= vig;

    // Subtle bloom approximation (brighten already bright areas)
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    if (luminance > 0.6) {
      color += (color - 0.6) * 0.3;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Lightweight screen-space effects overlay.
 * Renders a fullscreen quad with vignette + scanlines effect.
 * This doesn't require an extra render pass (just overlays on top).
 */
export default function ScreenEffects() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={999} position={[0, 0, -0.1]}>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        transparent
        depthTest={false}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uVignetteIntensity: { value: 0.25 },
          uScanlineIntensity: { value: 0.3 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uVignetteIntensity;
          uniform float uScanlineIntensity;
          varying vec2 vUv;

          void main() {
            // Subtle vignette overlay
            vec2 vigUv = vUv * (1.0 - vUv.yx);
            float vig = vigUv.x * vigUv.y * 15.0;
            vig = pow(vig, uVignetteIntensity);
            float darkness = 1.0 - vig;

            // Scanlines
            float scanline = sin(vUv.y * 600.0 + uTime) * 0.5 + 0.5;
            float scanAlpha = scanline * uScanlineIntensity * 0.015;

            float alpha = darkness * 0.3 + scanAlpha;
            gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
          }
        `}
      />
    </mesh>
  );
}
