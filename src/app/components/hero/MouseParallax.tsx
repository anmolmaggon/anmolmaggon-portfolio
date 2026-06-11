import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export function MouseParallax({ children }: { children: React.ReactNode }) {
  const { size, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -(e.clientY / size.height) * 2 + 1;
    };

    // Attach to the canvas parent to ensure we catch all moves
    const element = gl.domElement.parentElement;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [size, gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Determine target rotation based on mouse position
    // Subtle movement: max 0.15 radians (~8.5 degrees)
    targetRotation.current.x = mouse.current.y * 0.15;
    targetRotation.current.y = mouse.current.x * 0.15;

    // Smoothly interpolate current rotation toward target
    // Using a fixed lerp factor scaled by delta time for framerate independence
    const lerpFactor = 1.0 - Math.exp(-5.0 * delta);
    
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * lerpFactor;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * lerpFactor;
  });

  return <group ref={groupRef}>{children}</group>;
}
