import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import silhouetteImg from "../../../imports/floral-glass.png";

/* ─── Vertex Shader ──────────────────────────────────────────────────────── */
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* ─── Fragment Shader: Liquid Refraction ───────────────────────────────────── */
const fragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Calculate distance from UV to Mouse
  // We need to account for aspect ratio so the distortion is circular, not squished
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 distVec = (uv - uMouse) * aspect;
  float dist = length(distVec);

  // Liquid Refraction Physics
  // We want a ripple effect only close to the mouse
  float radius = 0.15; // How wide the ripple is
  float intensity = 0.05; // How strong the bend is
  
  // Smoothstep creates a soft falloff around the mouse pointer
  float influence = 1.0 - smoothstep(0.0, radius, dist);
  
  // Apply a sine wave distortion to the UVs based on time and distance
  // The distortion points away from the mouse center
  if (influence > 0.0) {
    vec2 direction = normalize(distVec);
    uv += direction * influence * intensity * sin(dist * 20.0 - uTime * 5.0);
  }

  vec4 color = texture2D(uTexture, uv);
  
  // Subtle breathing pulse (ranges from 0.8 to 1.2 brightness)
  float pulse = 1.0 + sin(uTime * 1.5) * 0.15;
  
  // Apply pulse
  vec3 finalColor = color.rgb * pulse;

  gl_FragColor = vec4(finalColor, color.a);
}
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
export function SilhouetteOutline() {
  const texture = useTexture(silhouetteImg);
  const targetUV = useRef(new THREE.Vector2(-1, -1)); // Default off-screen

  const material = useMemo(() => {
    const img = texture.image as HTMLImageElement;
    const w = img?.naturalWidth || 1024;
    const h = img?.naturalHeight || 1024;

    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uResolution: { value: new THREE.Vector2(w, h) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending, // Additive blending makes the crystal glints intensely bright
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [texture]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Smoothly interpolate the mouse uniform for fluid drag
    material.uniforms.uMouse.value.lerp(targetUV.current, 0.1);
  });

  const img = texture.image as HTMLImageElement;
  const aspect = (img?.naturalWidth || 1) / (img?.naturalHeight || 1);
  const scaleY = 6.5;
  const scaleX = scaleY * aspect;

  return (
    // Sits directly on top of the particles
    <mesh 
      position={[0, 0, 0.05]}
      onPointerMove={(e) => {
        if (e.uv) targetUV.current.copy(e.uv);
      }}
      onPointerLeave={() => {
        targetUV.current.set(-1, -1);
      }}
    >
      <planeGeometry args={[scaleX, scaleY]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

useTexture.preload(silhouetteImg);
