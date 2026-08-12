// CYBERVERSE — Cinematic Camera Controller
// Uses GSAP for smooth, film-quality camera transitions

import gsap from 'gsap';
import * as THREE from 'three';

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration?: number;
  ease?: string;
  onComplete?: () => void;
}

export class CinematicCameraController {
  private camera: THREE.PerspectiveCamera | null = null;
  private isAnimating = false;
  private currentTween: gsap.core.Tween | null = null;
  private idleAnimation: gsap.core.Tween | null = null;
  private lookAtTarget = new THREE.Vector3();

  attach(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.lookAtTarget.set(0, 0, 0);
  }

  transitionTo({ position, lookAt, duration = 1.5, ease = 'power3.inOut', onComplete }: CameraTarget) {
    if (!this.camera) return;

    this.stopIdle();
    if (this.currentTween) this.currentTween.kill();
    this.isAnimating = true;

    const cam = this.camera;
    const target = { x: cam.position.x, y: cam.position.y, z: cam.position.z };
    const look = { x: this.lookAtTarget.x, y: this.lookAtTarget.y, z: this.lookAtTarget.z };

    this.currentTween = gsap.to(target, {
      x: position[0], y: position[1], z: position[2],
      duration,
      ease,
      onUpdate: () => {
        cam.position.set(target.x, target.y, target.z);
        cam.lookAt(look.x, look.y, look.z);
      },
      onComplete: () => {
        this.isAnimating = false;
        onComplete?.();
      },
    });

    gsap.to(look, {
      x: lookAt[0], y: lookAt[1], z: lookAt[2],
      duration,
      ease,
      onUpdate: () => {
        this.lookAtTarget.set(look.x, look.y, look.z);
      },
    });
  }

  // Subtle idle sway for cinematic feel
  startIdle() {
    if (!this.camera || this.isAnimating) return;
    const cam = this.camera;
    const baseY = cam.position.y;
    const baseX = cam.position.x;

    this.idleAnimation = gsap.to(cam.position, {
      y: baseY + 0.15,
      x: baseX + 0.1,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  stopIdle() {
    if (this.idleAnimation) {
      this.idleAnimation.kill();
      this.idleAnimation = null;
    }
  }

  // Dolly zoom effect (Hitchcock zoom)
  dollyZoom(targetFov: number, duration = 1.0) {
    if (!this.camera) return;
    gsap.to(this.camera, { fov: targetFov, duration, ease: 'power2.inOut', onUpdate: () => this.camera!.updateProjectionMatrix() });
  }

  // Shake effect for alerts/incidents
  shake(intensity = 0.1, duration = 0.5) {
    if (!this.camera) return;
    const cam = this.camera;
    const origin = { x: cam.position.x, y: cam.position.y, z: cam.position.z };

    gsap.to(cam.position, {
      x: origin.x + (Math.random() - 0.5) * intensity,
      y: origin.y + (Math.random() - 0.5) * intensity,
      z: origin.z + (Math.random() - 0.5) * intensity,
      duration: 0.05,
      repeat: Math.floor(duration / 0.05),
      yoyo: true,
      ease: 'none',
      onComplete: () => cam.position.set(origin.x, origin.y, origin.z),
    });
  }

  getIsAnimating() { return this.isAnimating; }
}

export const cinematicCamera = new CinematicCameraController();
