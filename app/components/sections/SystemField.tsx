"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const VB = 420;
const CX = 210;
const CY = 205;
const R = 148;

const NS = { vectorEffect: "non-scaling-stroke" as const };

const S2 = "var(--viz-s2)";
const S3 = "var(--viz-s3)";
const TEXT = "var(--viz-text)";
const GRAPHITE = "color-mix(in srgb, var(--fg) 82%, transparent)";
const ACCENT = "var(--accent)";

/* network geometry — valley slopes derived from the W strokes */
const N1 = { x: 120, y: 128 };
const N2 = { x: 172, y: 270 };
const N3 = { x: 287, y: 226 };
const CORE = { x: 331, y: 290 };

/* circle ∩ axis intersections — coordinate markers */
const INTERSECTIONS: [number, number][] = [
  [CX + R, CY],
  [CX - R, CY],
  [CX, CY - R],
  [CX, CY + R],
];

export default function SystemField() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: CX, y: CY });
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 45, damping: 18 });
  const sy = useSpring(rawY, { stiffness: 45, damping: 18 });

  /* two layers drift against each other — lines shear by a few px */
  const geoX = useTransform(sx, [-0.5, 0.5], [2, -2]);
  const geoY = useTransform(sy, [-0.5, 0.5], [1.5, -1.5]);
  const nodeX = useTransform(sx, [-0.5, 0.5], [-1.5, 1.5]);
  const nodeY = useTransform(sy, [-0.5, 0.5], [-1, 1]);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    setCoords({
      x: Math.round(((e.clientX - rect.left) / rect.width) * VB),
      y: Math.round(((e.clientY - rect.top) / rect.height) * VB),
    });
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
    setCoords({ x: CX, y: CY });
  }

  function stage(delay: number) {
    return reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.7, delay },
        };
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="w-full select-none"
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        fill="none"
        className="h-auto w-full"
      >
        {/* geometry layer */}
        <motion.g style={{ x: geoX, y: geoY }}>
          <motion.g {...stage(0.55)}>
            {/* coordinate axes */}
            <g strokeDasharray="2 6" style={{ stroke: S3 }}>
              <line x1="28" y1={CY} x2={VB - 28} y2={CY} />
              <line x1={CX} y1="24" x2={CX} y2={VB - 24} />
            </g>
            {/* axis ∩ circle coordinate markers */}
            <g style={{ stroke: S2 }}>
              {INTERSECTIONS.map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
                  <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
                </g>
              ))}
            </g>
            {/* primary circular geometry */}
            <circle cx={CX} cy={CY} r={R} style={{ stroke: S2 }} {...NS} />
            {/* orbital path — rotates imperceptibly (CSS, reduced-motion safe) */}
            <g className="dash-rotate">
              <ellipse
                cx={CX}
                cy={CY}
                rx="176"
                ry="112"
                transform={`rotate(-16 ${CX} ${CY})`}
                style={{ stroke: S3 }}
                strokeDasharray="1 7"
                strokeLinecap="round"
                {...NS}
              />
            </g>
            {/* measurement ticks on the lower arc */}
            <g style={{ stroke: S2 }}>
              {[38, 52, 66].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x1 = CX + (R - 5) * Math.cos(rad);
                const y1 = CY + (R - 5) * Math.sin(rad);
                const x2 = CX + (R + 5) * Math.cos(rad);
                const y2 = CY + (R + 5) * Math.sin(rad);
                return (
                  <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />
                );
              })}
            </g>
          </motion.g>
        </motion.g>

        {/* node layer */}
        <motion.g style={{ x: nodeX, y: nodeY }}>
          <motion.g {...stage(0.75)}>
            {/* vectors through the network */}
            <path
              d={`M${N1.x} ${N1.y} L${N2.x} ${N2.y} L${N3.x} ${N3.y} L${CORE.x} ${CORE.y}`}
              style={{ stroke: GRAPHITE, opacity: 0.65 }}
              strokeWidth="1.2"
              {...NS}
            />
            {/* field nodes */}
            <circle cx={N1.x} cy={N1.y} r="2.6" style={{ fill: "var(--bg)", stroke: GRAPHITE }} strokeWidth="1" />
            <rect x={N2.x - 2.2} y={N2.y - 2.2} width="4.4" height="4.4" style={{ fill: GRAPHITE }} />
            <circle cx={N3.x} cy={N3.y} r="2.6" style={{ fill: "var(--bg)", stroke: GRAPHITE }} strokeWidth="1" />
            {/* the active core */}
            <circle cx={CORE.x} cy={CORE.y} r="7" style={{ stroke: ACCENT }} strokeWidth="1.2" fill="var(--bg)" />
            <circle cx={CORE.x} cy={CORE.y} r="3" style={{ fill: ACCENT }} className="node-pulse" />
          </motion.g>
        </motion.g>

        {/* instrument chrome */}
        <motion.g
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="9"
          letterSpacing="2"
          {...stage(0.95)}
        >
          <text x="14" y="20" style={{ fill: TEXT }}>
            SF-01 / FIELD
          </text>
          <text
            x={VB - 14}
            y={VB - 10}
            textAnchor="end"
            letterSpacing="1.5"
            style={{ fill: TEXT }}
          >
            {`X:${String(coords.x).padStart(3, "0")} Y:${String(coords.y).padStart(3, "0")}`}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
