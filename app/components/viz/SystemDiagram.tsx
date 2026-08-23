"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const SIZE = 560;
const C = SIZE / 2;
const GAP = 64;
const ORIGIN = 72;

type Node = { x: number; y: number; active?: boolean };

function buildNodes(): Node[] {
  const nodes: Node[] = [];
  const activeSet = new Set(["1,1", "5,1", "3,2", "1,5", "5,4", "4,5", "3,4"]);
  for (let ix = 0; ix < 7; ix++) {
    for (let iy = 0; iy < 7; iy++) {
      const x = ORIGIN + ix * GAP;
      const y = ORIGIN + iy * GAP;
      if (Math.hypot(x - C, y - C) > 236) continue;
      nodes.push({ x, y, active: activeSet.has(`${ix},${iy}`) });
    }
  }
  return nodes;
}

const NODES = buildNodes();
const LINKS: [number, number][] = [
  [0, 3],
  [3, 9],
  [9, 12],
  [12, 16],
  [16, 19],
  [19, 23],
  [23, 26],
  [26, 21],
  [21, 14],
  [14, 8],
  [8, 4],
];

export default function SystemDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: C, y: C });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 60, damping: 20 });
  const sy = useSpring(rawY, { stiffness: 60, damping: 20 });
  const farX = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const farY = useTransform(sy, [-0.5, 0.5], [-9, 9]);
  const nearX = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const nearY = useTransform(sy, [-0.5, 0.5], [-4, 4]);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px);
    rawY.set(py);
    setCoords({
      x: Math.round(((e.clientX - rect.left) / rect.width) * SIZE),
      y: Math.round(((e.clientY - rect.top) / rect.height) * SIZE),
    });
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
    setCoords({ x: C, y: C });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative aspect-square w-full max-w-[520px] select-none"
      aria-hidden
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none" className="h-full w-full">
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => {
            const v = ORIGIN / 2 + i * ((SIZE - ORIGIN) / 8);
            return (
              <g key={v}>
                <line x1={v} y1={ORIGIN - 14} x2={v} y2={ORIGIN - 8} />
                <line x1={v} y1={SIZE - ORIGIN + 8} x2={v} y2={SIZE - ORIGIN + 14} />
                <line x1={ORIGIN - 14} y1={v} x2={ORIGIN - 8} y2={v} />
                <line x1={SIZE - ORIGIN + 8} y1={v} x2={SIZE - ORIGIN + 14} y2={v} />
              </g>
            );
          })}
        </g>
        <rect
          x={ORIGIN}
          y={ORIGIN}
          width={SIZE - ORIGIN * 2}
          height={SIZE - ORIGIN * 2}
          stroke="rgba(255,255,255,0.08)"
        />

        <motion.g style={{ x: farX, y: farY }}>
          <circle
            cx={C}
            cy={C}
            r={196}
            stroke="rgba(91,140,255,0.22)"
            strokeDasharray="2 10"
            className="dash-rotate"
          />
          <circle cx={C} cy={C} r={148} stroke="rgba(255,255,255,0.05)" />
        </motion.g>

        <motion.g style={{ x: nearX, y: nearY }}>
          {LINKS.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke={
                NODES[a].active || NODES[b].active
                  ? "rgba(91,140,255,0.28)"
                  : "rgba(255,255,255,0.08)"
              }
            />
          ))}
          {NODES.map((n, i) =>
            n.active ? (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={3.2}
                fill="#5b8cff"
                className="node-pulse"
                style={{ animationDelay: `${(i % 7) * 0.45}s` }}
              />
            ) : (
              <rect key={i} x={n.x - 1.5} y={n.y - 1.5} width={3} height={3} fill="rgba(255,255,255,0.22)" />
            ),
          )}
          <circle cx={C} cy={C} r={4.5} fill="#f5f5f5" />
        </motion.g>

        <g fontFamily="var(--font-jetbrains-mono), monospace" fontSize="10" letterSpacing="2">
          <text x={ORIGIN} y={40} fill="rgba(138,138,138,0.85)">SYS.DIAGRAM</text>
          <text x={SIZE - 150} y={40} fill="#5b8cff">CORE ACTIVE</text>
          <text x={ORIGIN} y={SIZE - 24} fill="rgba(138,138,138,0.6)">
            {`X:${String(coords.x).padStart(3, "0")} Y:${String(coords.y).padStart(3, "0")}`}
          </text>
          <text x={SIZE - 118} y={SIZE - 24} fill="rgba(138,138,138,0.6)">N=26</text>
        </g>
      </svg>
    </div>
  );
}
