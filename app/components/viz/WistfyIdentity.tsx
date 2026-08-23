"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const VBW = 1120;
const VBH = 630;
const TOP = 214;
const BASE = 416;

const NS = { vectorEffect: "non-scaling-stroke" as const };

const S2 = "var(--viz-s2)";
const S3 = "var(--viz-s3)";
const DOT = "var(--viz-dot)";
const TEXT = "var(--viz-text)";
const GRAPHITE = "color-mix(in srgb, var(--fg) 82%, transparent)";
const ACCENT = "var(--accent)";

type LetterNode = {
  x: number;
  y: number;
  kind: "dot" | "ring" | "active" | "active-ring";
};

type Letter = {
  key: string;
  x: number;
  w: number;
  paths: string[];
  nodes: LetterNode[];
  guides?: { x1: number; y1: number; x2: number; y2: number }[];
};

function buildLetters(): Letter[] {
  let x = 285;
  const gap = 30;
  const defs: Omit<Letter, "x">[] = [
    {
      key: "W",
      w: 116,
      paths: ["M2 4 L30 196 L58 66 L86 196 L114 4"],
      nodes: [
        { x: 2, y: 4, kind: "dot" },
        { x: 30, y: 196, kind: "active" },
        { x: 58, y: 66, kind: "active-ring" },
        { x: 86, y: 196, kind: "active" },
        { x: 114, y: 4, kind: "dot" },
      ],
      guides: [{ x1: 58, y1: -22, x2: 58, y2: 222 }],
    },
    {
      key: "I",
      w: 10,
      paths: ["M5 0 V200", "M-9 0 H19", "M-9 200 H19"],
      nodes: [{ x: 5, y: 100, kind: "dot" }],
    },
    {
      key: "S",
      w: 68,
      paths: [
        "M64 24 C58 8 42 0 28 3 C10 7 2 26 9 44 C15 59 30 65 41 75 C55 87 63 99 61 121 C58 150 40 166 22 161 C9 157 1 146 0 132",
      ],
      nodes: [
        { x: 64, y: 24, kind: "dot" },
        { x: 0, y: 132, kind: "dot" },
      ],
    },
    {
      key: "T",
      w: 72,
      paths: ["M2 0 H70", "M36 0 V200"],
      nodes: [
        { x: 36, y: 0, kind: "dot" },
        { x: 36, y: 200, kind: "dot" },
      ],
      guides: [{ x1: 36, y1: -22, x2: 36, y2: 222 }],
    },
    {
      key: "F",
      w: 58,
      paths: ["M4 200 V0 H54", "M4 78 H44"],
      nodes: [
        { x: 4, y: 0, kind: "dot" },
        { x: 54, y: 0, kind: "dot" },
        { x: 44, y: 78, kind: "dot" },
        { x: 4, y: 200, kind: "dot" },
      ],
    },
    {
      key: "Y",
      w: 76,
      paths: ["M2 0 L38 80", "M74 0 L38 80", "M38 80 V200"],
      nodes: [
        { x: 2, y: 0, kind: "dot" },
        { x: 74, y: 0, kind: "dot" },
        { x: 38, y: 80, kind: "ring" },
        { x: 38, y: 200, kind: "dot" },
      ],
    },
  ];
  return defs.map((d) => {
    const letter = { ...d, x };
    x += d.w + gap;
    return letter;
  });
}

const LETTERS = buildLetters();

const SCATTER: [number, number][] = [
  [214, 258], [262, 372], [452, 232], [520, 398], [648, 236],
  [704, 386], [884, 260], [912, 352], [352, 178], [756, 448],
];

export default function WistfyIdentity() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 560, y: 280 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 55, damping: 20 });
  const sy = useSpring(rawY, { stiffness: 55, damping: 20 });
  const farX = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const farY = useTransform(sy, [-0.5, 0.5], [5, -5]);
  const nearX = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const nearY = useTransform(sy, [-0.5, 0.5], [-3, 3]);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px);
    rawY.set(py);
    setCoords({
      x: Math.round(((e.clientX - rect.left) / rect.width) * VBW),
      y: Math.round(((e.clientY - rect.top) / rect.height) * VBH),
    });
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
    setCoords({ x: 560, y: 280 });
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
        viewBox={`0 0 ${VBW} ${VBH}`}
        fill="none"
        className="h-auto w-full"
        role="img"
        aria-label="WISTFY identity — engineered letterform system"
      >
        {/* ---------- far layer: grid frame, orbital system ---------- */}
        <motion.g style={{ x: farX, y: farY }}>
          <rect
            x="24"
            y="24"
            width={VBW - 48}
            height={VBH - 48}
            style={{ stroke: S2 }}
            {...NS}
          />

          {/* corner registration crosses */}
          {[
            [24, 24],
            [VBW - 24, 24],
            [24, VBH - 24],
            [VBW - 24, VBH - 24],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`} style={{ stroke: S2 }} strokeWidth="1">
              <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
              <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
            </g>
          ))}

          {/* dotted orbital path */}
          <ellipse
            cx="560"
            cy="315"
            rx="340"
            ry="158"
            transform="rotate(-3 560 315)"
            style={{ stroke: S2 }}
            strokeDasharray="1 8"
            strokeLinecap="round"
            {...NS}
          />

          {/* construction circle around W + small circle near Y */}
          <circle
            cx="343"
            cy="315"
            r="104"
            style={{ stroke: S3 }}
            strokeDasharray="5 7"
            className="dash-rotate"
            {...NS}
          />
          <circle cx="797" cy="315" r="72" style={{ stroke: S3 }} {...NS} />

          {/* cap/base construction lines across the word */}
          <g style={{ stroke: S3 }}>
            <line x1="210" y1={TOP} x2="910" y2={TOP} />
            <line x1="210" y1={BASE} x2="910" y2={BASE} />
          </g>

          {/* measurement ticks under word span */}
          <g style={{ stroke: S2 }}>
            {Array.from({ length: 14 }, (_, i) => {
              const tx = 285 + i * ((835 - 285) / 13);
              return <line key={tx} x1={tx} y1={BASE + 10} x2={tx} y2={BASE + 16} />;
            })}
          </g>

          {/* dimension line under W */}
          <g style={{ stroke: S2 }}>
            <line x1="285" y1="446" x2="401" y2="446" />
            <line x1="285" y1="441" x2="285" y2="451" />
            <line x1="401" y1="441" x2="401" y2="451" />
          </g>
          <text
            x="412"
            y="450"
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="10"
            letterSpacing="1.5"
            style={{ fill: TEXT }}
          >
            W=116
          </text>

          {/* scatter data markers */}
          {SCATTER.map(([px, py]) => (
            <rect
              key={`${px}-${py}`}
              x={px}
              y={py}
              width="2.6"
              height="2.6"
              style={{ fill: DOT }}
            />
          ))}

          {/* center crosshair */}
          <g style={{ stroke: S2 }}>
            <line x1="552" y1="315" x2="568" y2="315" />
            <line x1="560" y1="307" x2="560" y2="323" />
          </g>
        </motion.g>

        {/* ---------- near layer: the wordmark system ---------- */}
        <motion.g style={{ x: nearX, y: nearY }}>
          {/* alignment guides through key stems */}
          <g style={{ stroke: S3 }} strokeDasharray="3 6">
            {LETTERS.flatMap((l) =>
              (l.guides ?? []).map((g, gi) => (
                <line
                  key={`${l.key}-${gi}`}
                  x1={l.x + g.x1}
                  y1={TOP + g.y1}
                  x2={l.x + g.x2}
                  y2={TOP + g.y2}
                />
              )),
            )}
          </g>

          {/* letterforms */}
          {LETTERS.map((l) => (
            <g key={l.key} transform={`translate(${l.x} ${TOP})`}>
              {l.paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  style={{
                    stroke:
                      l.key === "W"
                        ? "color-mix(in srgb, var(--fg) 92%, transparent)"
                        : GRAPHITE,
                  }}
                  strokeWidth={l.key === "W" ? 2.6 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...NS}
                />
              ))}
              {l.nodes.map((n, ni) => {
                const cx = n.x;
                const cy = n.y;
                if (n.kind === "active") {
                  return (
                    <circle
                      key={ni}
                      cx={cx}
                      cy={cy}
                      r="3.4"
                      style={{ fill: ACCENT }}
                      className="node-pulse"
                      stroke="none"
                    />
                  );
                }
                if (n.kind === "active-ring") {
                  return (
                    <circle
                      key={ni}
                      cx={cx}
                      cy={cy}
                      r="6"
                      style={{ stroke: ACCENT }}
                      strokeWidth="1.2"
                      fill="none"
                    />
                  );
                }
                if (n.kind === "ring") {
                  return (
                    <circle
                      key={ni}
                      cx={cx}
                      cy={cy}
                      r="4.4"
                      style={{ stroke: GRAPHITE }}
                      strokeWidth="1.1"
                      fill="var(--bg)"
                    />
                  );
                }
                return (
                  <circle
                    key={ni}
                    cx={cx}
                    cy={cy}
                    r="2.2"
                    style={{ fill: "var(--bg)", stroke: GRAPHITE }}
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          ))}

          {/* leader from CORE ACTIVE to W apex ring */}
          <polyline
            points="343,203 343,168 420,168"
            style={{ stroke: S2 }}
            {...NS}
          />
        </motion.g>

        {/* ---------- labels ---------- */}
        <g
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="11"
          letterSpacing="2.5"
        >
          <text x="44" y="62" style={{ fill: TEXT }}>
            WISTFY / SYSTEM
          </text>
          <text
            x={VBW - 44}
            y="62"
            textAnchor="end"
            style={{ fill: ACCENT }}
          >
            CORE ACTIVE
          </text>
          <text x="44" y="592" style={{ fill: TEXT }}>
            IDENTITY / 01
          </text>
          <text x={VBW - 44} y="592" textAnchor="end" style={{ fill: TEXT }}>
            NODE: 26
          </text>
          <text
            x={VBW - 34}
            y="315"
            textAnchor="middle"
            transform={`rotate(90 ${VBW - 34} 315)`}
            style={{ fill: TEXT }}
          >
            VECTOR FIELD
          </text>
          <text x="560" y="600" textAnchor="middle" style={{ fill: TEXT }}>
            {`X:${String(coords.x).padStart(3, "0")} Y:${String(coords.y).padStart(3, "0")}`}
          </text>
        </g>
      </svg>
    </div>
  );
}
