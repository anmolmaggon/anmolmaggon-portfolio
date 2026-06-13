import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";
import jarImage from "../../imports/ab0a2d4e-fbaa-400d-9653-656a49eaf18a 1.png";

import antigravitySvg from "../../imports/antigravity-color.svg";
import claudeSvg from "../../imports/claude.svg";
import claudecodeSvg from "../../imports/claudecode.svg";
import figmaSvg from "../../imports/figma-color.svg";
import geminiSvg from "../../imports/gemini-color.svg";
import githubSvg from "../../imports/github.svg";
import midjourneySvg from "../../imports/midjourney.svg";
import notebooklmSvg from "../../imports/notebooklm.svg";
import notionSvg from "../../imports/notion.svg";
import openaiSvg from "../../imports/openai.svg";
import runwaySvg from "../../imports/runway.svg";
import supabaseSvg from "../../imports/supabase-icon.svg";
import granolaSvg from "../../imports/Granola.svg";
import penSvg from "../../imports/Pen & paper.svg";
import todoistSvg from "../../imports/Todoist.svg";
import cameraSvg from "../../imports/Camera.svg";

const svgAssets: Record<string, string> = {
  antigravity: antigravitySvg,
  claude: claudeSvg,
  claudecode: claudecodeSvg,
  figma: figmaSvg,
  gemini: geminiSvg,
  github: githubSvg,
  midjourney: midjourneySvg,
  notebooklm: notebooklmSvg,
  notion: notionSvg,
  chatgpt: openaiSvg,
  runway: runwaySvg,
  supabase: supabaseSvg,
  granola: granolaSvg,
  pen: penSvg,
  todoist: todoistSvg,
  camera: cameraSvg,
};

type LogoKind =
  | "figma"
  | "claude"
  | "gemini"
  | "supabase"
  | "notion"
  | "chatgpt"
  | "todoist"
  | "granola"
  | "pen"
  | "antigravity"
  | "claudecode"
  | "github"
  | "midjourney"
  | "notebooklm"
  | "runway"
  | "camera";

type Tool = {
  id: string;
  name: string;
  role: string;
  logo: LogoKind;
  glow: string;
  accent: string;
  base: [number, number, number];
  amp: [number, number, number];
  speed: number;
  phase: number;
  radius: number;
};

const tools: Tool[] = [
  { id: "antigravity", name: "Antigravity", role: "Agentic workflows", logo: "antigravity", glow: "#ffe8a1", accent: "#75b8ff", base: [0.0, 1.3, -0.1], amp: [0.1, 0.15, 0.1], speed: 0.78, phase: 2.1, radius: 0.32 },
  { id: "claude", name: "Claude", role: "Thinking partner", logo: "claude", glow: "#ffd485", accent: "#d97757", base: [-0.65, 0.9, 0.2], amp: [0.1, 0.1, 0.1], speed: 0.62, phase: 1.4, radius: 0.3 },
  { id: "gemini", name: "Gemini", role: "For quick prototyping", logo: "gemini", glow: "#ffdb70", accent: "#4c8bf5", base: [0.55, 0.7, -0.2], amp: [0.08, 0.12, 0.08], speed: 0.72, phase: 3.2, radius: 0.28 },
  { id: "chatgpt", name: "ChatGPT", role: "Image Generation", logo: "chatgpt", glow: "#ffe699", accent: "#10a37f", base: [0.75, 0.2, 0.1], amp: [0.12, 0.08, 0.1], speed: 0.66, phase: 0.8, radius: 0.27 },
  { id: "figma", name: "Figma", role: "Design surface", logo: "figma", glow: "#ffdb70", accent: "#ff7262", base: [-0.75, 0.3, -0.1], amp: [0.09, 0.13, 0.1], speed: 0.72, phase: 0.2, radius: 0.31 },
  { id: "claudecode", name: "Claude Code", role: "Coding", logo: "claudecode", glow: "#ffcc66", accent: "#d97757", base: [-0.3, -0.1, 0.2], amp: [0.1, 0.1, 0.1], speed: 0.8, phase: 5.1, radius: 0.26 },
  { id: "todoist", name: "Todoist", role: "Daily to do", logo: "todoist", glow: "#ffd27f", accent: "#e44332", base: [0.2, -0.35, -0.2], amp: [0.08, 0.1, 0.08], speed: 0.7, phase: 7.2, radius: 0.25 },
  { id: "notion", name: "Notion", role: "Documentation", logo: "notion", glow: "#fff0b3", accent: "#e0e0e0", base: [-0.65, -0.6, 0.0], amp: [0.1, 0.12, 0.1], speed: 0.65, phase: 2.5, radius: 0.28 },
  { id: "notebooklm", name: "NotebookLM", role: "Research synthesis", logo: "notebooklm", glow: "#ffeb99", accent: "#4285f4", base: [0.65, -0.7, 0.1], amp: [0.07, 0.1, 0.08], speed: 0.76, phase: 4.8, radius: 0.26 },
  { id: "granola", name: "Granola", role: "Meeting notes", logo: "granola", glow: "#ffd485", accent: "#f5a623", base: [-0.2, -1.0, -0.1], amp: [0.1, 0.1, 0.1], speed: 0.82, phase: 6.3, radius: 0.24 },
  { id: "supabase", name: "Supabase", role: "Fast backends", logo: "supabase", glow: "#ffdc7a", accent: "#3ecf8e", base: [0.5, -1.2, 0.2], amp: [0.08, 0.12, 0.08], speed: 0.74, phase: 8.1, radius: 0.3 },
  { id: "github", name: "GitHub", role: "Version control", logo: "github", glow: "#ffeb99", accent: "#fafbfc", base: [-0.65, -1.35, 0.0], amp: [0.07, 0.09, 0.07], speed: 0.6, phase: 1.1, radius: 0.27 },
  { id: "pen", name: "Pen & Paper", role: "detangling brain", logo: "pen", glow: "#ffcc66", accent: "#d3d3d3", base: [0.35, -1.6, -0.1], amp: [0.06, 0.08, 0.06], speed: 0.58, phase: 3.5, radius: 0.22 },
  { id: "midjourney", name: "Midjourney", role: "Visual imagination", logo: "midjourney", glow: "#ffdb70", accent: "#a8b8ff", base: [-0.1, -1.75, 0.1], amp: [0.05, 0.06, 0.05], speed: 0.5, phase: 9.0, radius: 0.28 },
  { id: "runway", name: "Runway", role: "Video generation", logo: "runway", glow: "#ffd485", accent: "#e8e8e8", base: [0.75, -1.6, 0.15], amp: [0.06, 0.08, 0.06], speed: 0.55, phase: 4.2, radius: 0.26 },
  { id: "camera", name: "Sony A6700", role: "Photography & Films", logo: "camera", glow: "#ffcc66", accent: "#ffffff", base: [-0.4, 1.1, 0.1], amp: [0.08, 0.1, 0.08], speed: 0.68, phase: 1.8, radius: 0.27 },
];



function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createGlowTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, rgba(color, 1));
  gradient.addColorStop(0.2, rgba(color, 0.4));
  gradient.addColorStop(0.5, rgba(color, 0.05));
  gradient.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createLogoTexture(logo: LogoKind, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  if (svgAssets[logo]) {
    const img = new Image();
    img.src = svgAssets[logo];
    img.onload = () => {
      ctx.clearRect(0, 0, 256, 256);
      
      const size = 160;
      let drawW = size;
      let drawH = size;
      
      if (img.width && img.height) {
        const aspect = img.width / img.height;
        if (aspect > 1) {
          drawH = size / aspect;
        } else if (aspect < 1) {
          drawW = size * aspect;
        }
      }

      const offsetX = 48 + (size - drawW) / 2;
      const offsetY = 48 + (size - drawH) / 2;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 256;
      tempCanvas.height = 256;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.drawImage(img, offsetX, offsetY, drawW, drawH);
      tempCtx.globalCompositeOperation = "source-in";
      tempCtx.fillStyle = "#fffbf0";
      tempCtx.fillRect(0, 0, 256, 256);

      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.drawImage(tempCanvas, 0, 0);

      texture.needsUpdate = true;
    };
  }

  return texture;
}




function Firefly({
  tool,
  active,
  isAnyActive,
  reduceMotion,
  portalRef,
  onHover,
  onLeave,
  onPin,
}: {
  tool: Tool;
  active: boolean;
  isAnyActive: boolean;
  reduceMotion: boolean;
  portalRef: React.RefObject<HTMLElement>;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
  onPin: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const spriteMatRef = useRef<THREE.SpriteMaterial>(null);
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const logoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const particlesGroupRef = useRef<THREE.Group>(null);
  const hoverState = useRef(0);
  const glowTexture = useMemo(() => createGlowTexture(tool.glow), [tool.glow]);
  const logoTexture = useMemo(() => createLogoTexture(tool.logo, tool.accent), [tool.logo, tool.accent]);
  const color = useMemo(() => new THREE.Color(tool.glow), [tool.glow]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const pulse = 0.72 + Math.sin(t * 2.2 + tool.phase) * 0.18;

    hoverState.current = THREE.MathUtils.damp(hoverState.current, active ? 1 : 0, 4, delta);

    if (!reduceMotion) {
      const wanderX = Math.sin(t * tool.speed * 0.73 + tool.phase) * tool.amp[0] + Math.sin(t * 0.31 + tool.phase * 1.7) * 0.04;
      const wanderY = Math.cos(t * tool.speed * 0.82 + tool.phase) * tool.amp[1] + Math.sin(t * 0.47 + tool.phase * 2.3) * 0.05;
      const wanderZ = Math.sin(t * tool.speed * 0.68 + tool.phase * 1.3) * tool.amp[2] + Math.cos(t * 0.59 + tool.phase) * 0.03;

      const currentWanderX = wanderX * (1 - hoverState.current);
      const currentWanderY = wanderY * (1 - hoverState.current);
      const currentWanderZ = wanderZ * (1 - hoverState.current) + (hoverState.current * 0.5);

      groupRef.current.position.set(
        tool.base[0] + currentWanderX,
        tool.base[1] + currentWanderY,
        tool.base[2] + currentWanderZ
      );

      groupRef.current.rotation.set(
        Math.sin(t * 0.45 + tool.phase) * 0.25 * (1 - hoverState.current),
        Math.cos(t * 0.32 + tool.phase) * 0.35 * (1 - hoverState.current),
        Math.sin(t * 0.54 + tool.phase) * 0.15 * (1 - hoverState.current),
      );
    } else {
      groupRef.current.position.set(tool.base[0], tool.base[1], tool.base[2] + hoverState.current * 0.5);
      groupRef.current.rotation.set(0, 0, 0);
    }

    if (lightRef.current) {
      lightRef.current.intensity = 1.25 + pulse + (hoverState.current * 4.75);
    }

    const nPulse = Math.pow(Math.sin(t * (0.8 + tool.speed * 0.5) + tool.phase), 4);
    const baseOpacityModifier = (isAnyActive && !active) ? 0.2 : 1.0;

    if (spriteMatRef.current) {
      spriteMatRef.current.opacity = (0.15 + nPulse * 0.7) * baseOpacityModifier + (hoverState.current * 0.85);
    }
    if (logoMatRef.current) {
      logoMatRef.current.opacity = (0.5 + nPulse * 0.5) * baseOpacityModifier + (hoverState.current * 0.5);
    }
    if (spriteRef.current) {
      spriteRef.current.scale.setScalar(tool.radius * 4.2 * (1 + hoverState.current * 0.6));
    }
    if (logoMeshRef.current) {
      logoMeshRef.current.scale.setScalar(1 + hoverState.current * 0.4);
    }
    if (particlesGroupRef.current) {
      particlesGroupRef.current.rotation.z -= delta * (0.2 + hoverState.current * 4.0);
      particlesGroupRef.current.scale.setScalar(1 + hoverState.current * 0.4);
    }
  });

  return (
    <group ref={groupRef} position={tool.base}>
      <pointLight ref={lightRef} color={color} intensity={1.5} distance={3.5} decay={2} />
      
      <sprite ref={spriteRef} scale={[tool.radius * 4.2, tool.radius * 4.2, 1]}>
        <spriteMaterial
          ref={spriteMatRef}
          map={glowTexture}
          color={color}
          transparent
          opacity={active ? 1.0 : 0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(tool.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onLeave(tool.id);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onPin(tool.id);
        }}
      >
        <sphereGeometry args={[tool.radius, 16, 16]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <Billboard follow>
        <mesh ref={logoMeshRef} position={[0, 0, 0]}>
          <planeGeometry args={[tool.radius * 1.8, tool.radius * 1.8]} />
          <meshBasicMaterial
            ref={logoMatRef}
            map={logoTexture}
            transparent
            opacity={active ? 1.0 : 0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <group ref={particlesGroupRef}>
          {[
            [-0.9, -0.58, 0.42],
            [0.72, -0.42, 0.34],
            [0.46, 0.78, 0.25],
          ].map(([x, y, scale], index) => (
            <mesh key={index} position={[tool.radius * x, tool.radius * y, 0]}>
              <sphereGeometry args={[tool.radius * 0.035 * scale, 10, 10]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
            </mesh>
          ))}
        </group>
        {active && (
          <Html portal={portalRef} position={[0, tool.radius * 1.6, 0]} center zIndexRange={[100, 0]} pointerEvents="none">
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="pointer-events-none whitespace-nowrap rounded-full border border-[#ffe8a3]/25 bg-[#07110f]/88 px-4 py-2.5 text-center shadow-[0_18px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl"
            >
              <p className="font-sans text-[12px] font-medium leading-none text-[#fff5cf]">
                {tool.name}
                <span className="ml-2 text-[#fff5cf]/48">/ {tool.role}</span>
              </p>
            </motion.div>
          </Html>
        )}
      </Billboard>
    </group>
  );
}

function FireflyJarScene({
  activeId,
  pinnedId,
  reduceMotion,
  portalRef,
  onHover,
  onLeave,
  onPin,
}: {
  activeId: string | null;
  pinnedId: string | null;
  reduceMotion: boolean;
  portalRef: React.RefObject<HTMLElement>;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
  onPin: (id: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.28} color="#fff3c4" />
      <pointLight position={[0, -0.1, 2.2]} color="#ffe28a" intensity={2.2} distance={4.8} />

      <group position={[0, 0, 0]} scale={1.02}>
        {tools.map((tool) => (
          <Firefly
            key={tool.id}
            tool={tool}
            active={activeId === tool.id || pinnedId === tool.id}
            isAnyActive={!!activeId || !!pinnedId}
            reduceMotion={reduceMotion}
            portalRef={portalRef}
            onHover={onHover}
            onLeave={onLeave}
            onPin={onPin}
          />
        ))}
      </group>
    </>
  );
}

function FireflyJarCanvas({
  activeId,
  pinnedId,
  reduceMotion,
  portalRef,
  onHover,
  onLeave,
  onPin,
  onClear,
}: {
  activeId: string | null;
  pinnedId: string | null;
  reduceMotion: boolean;
  portalRef: React.RefObject<HTMLElement>;
  onHover: (id: string) => void;
  onLeave: (id: string) => void;
  onPin: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.6], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={onClear}
      onCreated={({ gl }) => {
        gl.setClearColor("#06110f", 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Suspense fallback={null}>
        <FireflyJarScene
          activeId={activeId}
          pinnedId={pinnedId}
          reduceMotion={reduceMotion}
          portalRef={portalRef}
          onHover={onHover}
          onLeave={onLeave}
          onPin={onPin}
        />
      </Suspense>
    </Canvas>
  );
}

export function TechStackJar() {
  const portalRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const activeId = hoveredId ?? pinnedId;
  const activeTool = tools.find((tool) => tool.id === activeId) ?? null;

  // On touch there's no hover; tapping a firefly fires pointerover→pointerout
  // and would flicker the hover state. Gate the hover setters behind a real
  // hover-capable pointer so tap (pin) drives selection cleanly on mobile.
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section
      id="stack"
      className="relative isolate overflow-hidden bg-[#fafaf7] px-6 pb-14 pt-20 text-[#171613] md:px-10 md:pb-20 md:pt-28"
      onClick={(e) => {
        // Tap-outside-to-deselect: clear unless the tap landed on the 3D canvas
        // (firefly taps keep their pin; empty-canvas taps are cleared by the
        // Canvas's onPointerMissed). R3F's stopPropagation doesn't stop the DOM
        // click, so guard on the canvas element here.
        if (!(e.target as HTMLElement).closest("canvas")) {
          setHoveredId(null);
          setPinnedId(null);
        }
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-[64vw] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 38% 48%, rgba(223, 186, 97, 0.22), rgba(243, 213, 134, 0.1) 36%, rgba(250,250,247,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[560px] max-w-[1680px] items-center gap-12 lg:grid-cols-[minmax(500px,0.9fr)_minmax(480px,600px)] lg:gap-[clamp(56px,6vw,124px)]">
        <div className="relative mx-auto aspect-[1122/1402] w-full max-w-[540px] overflow-visible md:max-w-[550px] scale-[1.18] md:scale-100 origin-center">
          
          <img
            src={jarImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain drop-shadow-[0_30px_80px_rgba(35,26,12,0.18)]"
          />

          <div ref={portalRef} className="absolute inset-[15%_15%_10%] z-50 pointer-events-none" />
          
          <div className="absolute inset-[15%_15%_10%] z-20">
            <FireflyJarCanvas
              portalRef={portalRef}
              activeId={activeId}
              pinnedId={pinnedId}
              reduceMotion={reduceMotion}
              onHover={(id) => { if (canHover) setHoveredId(id); }}
              onLeave={(id) => { if (canHover) setHoveredId((current) => (current === id ? null : current)); }}
              onPin={(id) => setPinnedId((current) => (current === id ? null : id))}
              onClear={() => {
                setHoveredId(null);
                setPinnedId(null);
              }}
            />
          </div>
          
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[22%_20%_15%] z-[25] opacity-50 mix-blend-screen"
            style={{
              background:
                "radial-gradient(ellipse 50% 45% at 50% 45%, rgba(255, 217, 105, 0.25) 0%, rgba(255, 198, 88, 0.08) 45%, transparent 80%)",
            }}
          />
          <img
            src={jarImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain opacity-[0.38] mix-blend-screen"
          />
        </div>

        <div className="relative z-20 max-w-[600px] pb-4 lg:pb-0">
          <h2
            className="font-[Nyght_Serif] text-[#171613] text-fluid-h2 leading-[1] font-normal tracking-[0]"
          >
            Borrowed light.
          </h2>

          <div className="mt-7 space-y-5 font-sans text-[16px] leading-[1.7] text-[#4d4a43] md:text-[18px]">
            <p>
              Tools are fireflies. They glow for a while, pull everyone closer, and make the dark feel easier to read.
            </p>
            <p>
              I catch what helps, study it closely, and use it to see further. But I try not to mistake the glow for the craft.
            </p>
            <p className="text-[#5b4512]">
              The tools move on. The taste, judgment, and care have to stay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
