import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import img1 from "../../../imports/Frame2018777277/e3eb4661b97b81082e40df3d4f1174b0aea7db51.png";
import img2 from "../../../imports/Frame2018777277/1a9b8e3e6a6fcf035174d4eff5134a0e69d0f764.png";
import img3 from "../../../imports/Frame2018777277/2ce616839d265c7c0bed0934fdf95b358ca1c8ca.png";
import img4 from "../../../imports/Frame2018777277/0eaff19e55ab85516b9e9d7c840de6a621c74f4e.png";
import img5 from "../../../imports/Frame2018777277/880cf8cab87837e9196d1181b801314384177a64.png";
import img6 from "../../../imports/Frame2018777277/9276719b3744a7e3b8ef1ce6f1ebb68e2bf7aa1d.png";
import img7 from "../../../imports/Frame2018777277/c7d2253291f23405686d47e8c56d93efe0470a32.png";

const FRAME_URLS = [img1, img2, img3, img4, img5, img6, img7];

/* ─── Gallery Wall Config ────────────────────────────────────────────── */
const WALL_CENTER_X = -4.5;      // Shifted further LEFT for better visual alignment
const WALL_CENTER_Y = 0.6;       // Lowered slightly for better balance
const WALL_Z = -6.0;             // Pushed slightly further back to accommodate full cylinder
const FRAME_W = 1.4;             // Reduced frame width
const FRAME_H = 0.9;             // Reduced frame height
const GAP = 0.4;                 // Slightly smaller gap
const PAN_SPEED = 0.12;          // How fast the wall pans horizontally

const ROWS = 2;                  // Reduced to 2 rows as requested
const COLS = 16;                 // 16 columns ensures a nice large cylinder
const TOTAL_FRAMES = ROWS * COLS;

// Calculate the perfect radius so the frames form a closed continuous loop
const WALL_CURVE_RADIUS = (COLS * (FRAME_W + GAP)) / (Math.PI * 2);

// Build the full frame list by repeating the source images
const ALL_FRAME_URLS: string[] = [];
for (let i = 0; i < TOTAL_FRAMES; i++) {
  ALL_FRAME_URLS.push(FRAME_URLS[i % FRAME_URLS.length]);
}

/* ─── Single Gallery Frame ───────────────────────────────────────────── */
function GalleryFrame({
  url,
  col,
  row,
}: {
  url: string;
  col: number;
  row: number;
}) {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
  }, [texture]);

  // Exact angle increment per column to form a closed circle
  const arcPerCol = (Math.PI * 2) / COLS;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Continuous pan
    const panOffset = t * PAN_SPEED;

    // Angle around the cylinder
    const angle = col * arcPerCol + panOffset;

    // 3D position on the closed cylinder
    const x = WALL_CENTER_X + Math.sin(angle) * WALL_CURVE_RADIUS;
    const z = WALL_Z + Math.cos(angle) * WALL_CURVE_RADIUS;
    
    // Y position for the 2 rows, shifted UP
    const rowHeight = FRAME_H + GAP;
    const y = WALL_CENTER_Y + (row - (ROWS - 1) / 2) * rowHeight;

    meshRef.current.position.set(x, y, z);

    // Face outward from the center of the cylinder
    meshRef.current.rotation.set(0, angle, 0);

    // Depth-based opacity: hide frames that rotate to the back of the cylinder
    const facingCamera = Math.cos(angle);
    const fade = THREE.MathUtils.smoothstep(facingCamera, -0.2, 0.8);
    material.opacity = 0.05 + fade * 0.9;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[FRAME_W, FRAME_H]} />
    </mesh>
  );
}

/* ─── Exported Group ─────────────────────────────────────────────────── */
export function FloatingFrames() {
  // Build grid data: col/row pairs
  const gridData = useMemo(() => {
    const items: { url: string; col: number; row: number }[] = [];
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        const idx = c * ROWS + r;
        items.push({
          url: ALL_FRAME_URLS[idx],
          col: c,
          row: r,
        });
      }
    }
    return items;
  }, []);

  return (
    <group>
      {gridData.map((data, i) => (
        <GalleryFrame key={i} url={data.url} col={data.col} row={data.row} />
      ))}
    </group>
  );
}

FRAME_URLS.forEach((url) => useTexture.preload(url));
