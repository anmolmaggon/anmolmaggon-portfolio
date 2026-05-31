import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { Label } from "./Label";

type Tool = {
  name: string;
  role: string;
  icon: string;
  bg?: string;
};

const tools: Tool[] = [
  { name: "Figma", role: "Design surface · daily driver", icon: "https://cdn.simpleicons.org/figma", bg: "#1a1a1a" },
  { name: "Figma Make", role: "Prompt → production", icon: "https://cdn.simpleicons.org/figma", bg: "#0F172A" },
  { name: "Claude Code", role: "Vibe-coding daily driver", icon: "https://cdn.simpleicons.org/anthropic/D97757", bg: "#FFF6EE" },
  { name: "Antigravity", role: "AI agent IDE · workflows", icon: "https://cdn.simpleicons.org/googlegemini/4285F4", bg: "#0B0B0B" },
  { name: "Figma MCP", role: "Design ↔ code bridge", icon: "https://cdn.simpleicons.org/figma", bg: "#FAFAFA" },
  { name: "React", role: "Front-end of choice", icon: "https://cdn.simpleicons.org/react/61DAFB", bg: "#0B132B" },
  { name: "Tailwind", role: "Styling system", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4", bg: "#0F172A" },
  { name: "Supabase", role: "Quick-and-honest backends", icon: "https://cdn.simpleicons.org/supabase/3ECF8E", bg: "#1E1E1E" },
  { name: "Notion", role: "PRDs, specs, second brain", icon: "https://cdn.simpleicons.org/notion/000000", bg: "#FFFFFF" },
  { name: "DaVinci Resolve", role: "Films · color · cuts", icon: "https://cdn.simpleicons.org/davinciresolve/FFFFFF", bg: "#1A1A1A" },
  { name: "Sony A7 III", role: "Photography · travel", icon: "https://cdn.simpleicons.org/sony/FFFFFF", bg: "#000000" },
];

const BASE = 72;
const MAX = 148;
const RANGE = 200;

function DockItem({
  tool,
  mouseX,
}: {
  tool: Tool;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE };
    return val - rect.x - rect.width / 2;
  });

  const sizeSync = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 180, damping: 14 });

  const liftSync = useTransform(distance, [-RANGE, 0, RANGE], [0, -18, 0]);
  const lift = useSpring(liftSync, { mass: 0.1, stiffness: 180, damping: 14 });

  const labelOpacity = useTransform(distance, [-40, 0, 40], [0, 1, 0]);

  return (
    <div className="group relative flex flex-col items-center">
      <motion.div
        style={{ y: lift, opacity: labelOpacity }}
        className="absolute -top-12 whitespace-nowrap pointer-events-none"
      >
        <Label variant="dark" size="md">
          {tool.name}
          <span className="opacity-60 ml-2">· {tool.role}</span>
        </Label>
      </motion.div>

      <motion.div
        ref={ref}
        style={{ width: size, height: size, y: lift, backgroundColor: tool.bg ?? "#fff" }}
        className="rounded-2xl shadow-md flex items-center justify-center overflow-hidden ring-1 ring-black/10"
      >
        <img src={tool.icon} alt={tool.name} className="w-1/2 h-1/2 object-contain" draggable={false} />
      </motion.div>
    </div>
  );
}

export function TechStack() {
  const mouseX = useMotionValue(Infinity);

  return (
    <section id="stack" className="px-6 md:px-10 py-24 md:py-40">
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex justify-center pt-20 pb-4"
      >
        <motion.div className="flex items-end gap-3 md:gap-4 min-h-[180px] overflow-visible">
          {tools.map((t) => (
            <DockItem key={t.name} tool={t} mouseX={mouseX} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
