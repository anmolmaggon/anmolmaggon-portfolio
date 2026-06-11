import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_NOISE_3D } from "./noise";

const PARTICLE_COUNT = 150;

const vertexShader = /* glsl */ `
${SIMPLEX_NOISE_3D}

uniform float uTime;

attribute float aPhase;
attribute float aSpeed;
attribute float aSize;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;

  // Very slow, gentle ambient drift
  float nx = snoise(vec3(pos.y * 0.1, pos.z * 0.1, uTime * aSpeed));
  float ny = snoise(vec3(pos.x * 0.1, pos.z * 0.1, uTime * aSpeed + 10.0));
  
  pos.x += nx * 0.5;
  pos.y += ny * 0.5;

  // Firefly Glowing Logic
  // Most of the time it's dim. Occasionally it flares up bright.
  // We use a steep power curve on a sine wave to create short, sharp flashes
  float pulse = sin(uTime * aSpeed * 2.0 + aPhase);
  float flare = pow(max(0.0, pulse), 8.0); // 8.0 exponent means it's 0 most of the time, then spikes to 1
  
  // Base ambient alpha (much brighter now so they are always visible) + the flare
  vAlpha = 0.4 + (flare * 0.6);

  // Warm firefly colors (gold, soft orange, pale yellow)
  vec3 baseColor = mix(vec3(1.0, 0.7, 0.2), vec3(1.0, 0.9, 0.6), aPhase / 6.28);
  vColor = baseColor * (1.0 + flare * 2.0); // Boost color when flaring for Bloom pickup

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Size flares up slightly when glowing
  gl_PointSize = aSize * (1.0 + flare * 0.5) * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;

void main() {
  // Soft circular particle
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  if (dist > 0.5) discard;

  // Soft edge fade
  float alpha = pow(1.0 - dist * 2.0, 2.0) * vAlpha;
  
  gl_FragColor = vec4(vColor, alpha);
}
`;

export function AmbientFireflies() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scatter widely across the screen, but push them far back in Z space
      positions[i * 3] = (Math.random() - 0.5) * 20; // Wide X spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // Tall Y spread
      positions[i * 3 + 2] = -5 - Math.random() * 15; // Deep Z (-5 to -20)

      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.2 + Math.random() * 0.3; // Very slow drift and pulse
      sizes[i] = 0.12 + Math.random() * 0.15; // Increased base size so they are visible specs
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points geometry={geometry} material={material} />
  );
}
