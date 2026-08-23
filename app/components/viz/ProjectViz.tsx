"use client";

import { motion, useReducedMotion } from "framer-motion";

type VizKind = "candles" | "ledger" | "platform" | "loss";

const S1 = "var(--viz-s1)";
const S2 = "var(--viz-s2)";
const S3 = "var(--viz-s3)";
const FILL = "var(--viz-fill)";
const DOT = "var(--viz-dot)";
const TEXT = "var(--viz-text)";

const CANDLES: [number, number, number][] = [
  [24, 96, -34],
  [56, 88, 22],
  [88, 104, -18],
  [120, 78, 30],
  [152, 86, -26],
  [184, 70, 20],
  [216, 82, -14],
  [248, 60, 34],
  [280, 74, -10],
  [312, 52, 28],
  [344, 64, -16],
];

const BARS = [
  [30, 118],
  [70, 84],
  [110, 132],
  [150, 58],
  [190, 98],
  [230, 44],
] as const;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 220"
      fill="none"
      className="h-full w-full"
      aria-hidden
    >
      <g style={{ stroke: S3 }}>
        {[55, 110, 165].map((y) => (
          <line key={y} x1="16" y1={y} x2="384" y2={y} />
        ))}
        <line x1="16" y1="12" x2="16" y2="196" />
      </g>
      {children}
      <g fontFamily="var(--font-jetbrains-mono), monospace" fontSize="9" letterSpacing="1.5">
        <text x="16" y="212" style={{ fill: TEXT }}>FIG</text>
        <text x="352" y="212" style={{ fill: TEXT }}>01</text>
      </g>
    </svg>
  );
}

function DrawPath({
  d,
  stroke,
  delay = 0,
}: {
  d: string;
  stroke: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.path
      d={d}
      style={{ stroke }}
      strokeWidth="1.5"
      initial={reduced ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.1, delay, ease: "easeOut" }}
    />
  );
}

const ACCENT_SOLID = "color-mix(in srgb, var(--accent) 88%, transparent)";
const ACCENT_SOFT = "color-mix(in srgb, var(--accent) 50%, transparent)";
const MINT_SOFT = "color-mix(in srgb, var(--mint) 75%, transparent)";

function Candles() {
  return (
    <Frame>
      {CANDLES.map(([x, o, h], i) => {
        const top = h > 0 ? o : o + h;
        const bodyH = Math.abs(h);
        const up = h > 0;
        return (
          <g key={i}>
            <line x1={x + 7} y1={top - 14} x2={x + 7} y2={top + bodyH + 14} style={{ stroke: S1 }} />
            <rect x={x} y={top} width={14} height={bodyH} style={{ fill: up ? ACCENT_SOLID : FILL }} />
          </g>
        );
      })}
      <DrawPath
        d="M31 92 L63 74 L95 96 L127 62 L159 80 L191 58 L223 72 L255 46 L287 60 L319 36 L351 50"
        stroke="var(--amber)"
        delay={0.3}
      />
    </Frame>
  );
}

function Ledger() {
  const reduced = useReducedMotion();
  return (
    <Frame>
      {BARS.map(([y, w], i) => (
        <motion.rect
          key={i}
          x="16"
          y={y - 8}
          width={w * 1.9}
          height={16}
          style={{ fill: i === 4 ? MINT_SOFT : ACCENT_SOFT, originX: 0 }}
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
        />
      ))}
      <circle cx="330" cy="66" r="34" style={{ stroke: S1 }} />
      <DrawPath d="M330 32 A34 34 0 0 1 358 100" stroke="var(--accent)" />
      <DrawPath d="M358 100 A34 34 0 0 1 306 92" stroke="var(--mint)" delay={0.25} />
    </Frame>
  );
}

function Platform() {
  return (
    <svg viewBox="0 0 400 220" fill="none" className="h-full w-full" aria-hidden>
      <rect x="40" y="24" width="320" height="172" style={{ stroke: S1 }} />
      <line x1="40" y1="48" x2="360" y2="48" style={{ stroke: S1 }} />
      <circle cx="54" cy="36" r="3" style={{ fill: DOT }} />
      <circle cx="66" cy="36" r="3" style={{ fill: DOT }} />
      <rect x="56" y="64" width="96" height="10" style={{ fill: ACCENT_SOFT }} />
      <rect x="56" y="86" width="150" height="6" style={{ fill: FILL }} />
      <rect x="56" y="100" width="122" height="6" style={{ fill: FILL }} />
      <rect x="56" y="128" width="130" height="52" style={{ stroke: S2 }} />
      <DrawPath d="M186 133 H300 V154" stroke="var(--accent)" delay={0.2} />
      <DrawPath d="M121 128 V108 H236" stroke="var(--iris)" delay={0.45} />
      <rect x="236" y="94" width="88" height="28" style={{ stroke: "var(--iris)" }} />
      <rect x="300" y="154" width="46" height="26" style={{ stroke: "var(--accent)" }} />
    </svg>
  );
}

function Loss() {
  const pts = [
    [16, 40], [48, 76], [80, 102], [112, 124], [144, 138],
    [176, 148], [208, 156], [240, 162], [272, 166], [304, 169], [336, 171], [384, 174],
  ];
  const val = [
    [16, 52], [48, 88], [80, 112], [112, 130], [144, 146],
    [176, 158], [208, 170], [240, 180], [272, 188], [304, 192], [336, 194], [384, 195],
  ];
  const toPath = (arr: number[][]) =>
    arr.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  return (
    <Frame>
      <DrawPath d={toPath(pts)} stroke="var(--accent)" />
      <DrawPath d={toPath(val)} stroke="var(--iris)" delay={0.25} />
      {val.map(([x, y], i) =>
        i % 3 === 0 ? (
          <circle key={i} cx={x} cy={y} r="2" style={{ fill: "var(--iris)" }} />
        ) : null,
      )}
      <line x1="290" y1="188" x2="384" y2="188" style={{ stroke: S1 }} strokeDasharray="3 5" />
    </Frame>
  );
}

export default function ProjectViz({ kind }: { kind: VizKind }) {
  switch (kind) {
    case "candles":
      return <Candles />;
    case "ledger":
      return <Ledger />;
    case "platform":
      return <Platform />;
    case "loss":
      return <Loss />;
  }
}
