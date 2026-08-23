"use client";

import { motion, useReducedMotion } from "framer-motion";

type VizKind = "candles" | "ledger" | "platform" | "loss";

const CANDLES: [number, number, number][] = [
  // x, openY (0-160), height (positive = green)
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
      <g stroke="rgba(255,255,255,0.07)">
        {[55, 110, 165].map((y) => (
          <line key={y} x1="16" y1={y} x2="384" y2={y} />
        ))}
        <line x1="16" y1="12" x2="16" y2="196" />
      </g>
      {children}
      <g fontFamily="var(--font-jetbrains-mono), monospace" fontSize="9" letterSpacing="1.5">
        <text x="16" y="212" fill="rgba(138,138,138,0.6)">FIG</text>
        <text x="352" y="212" fill="rgba(138,138,138,0.6)">01</text>
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
      stroke={stroke}
      strokeWidth="1.5"
      initial={reduced ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.1, delay, ease: "easeOut" }}
    />
  );
}

function Candles() {
  return (
    <Frame>
      {CANDLES.map(([x, o, h], i) => {
        const top = h > 0 ? o : o + h;
        const bodyH = Math.abs(h);
        const up = h > 0;
        return (
          <g key={i}>
            <line x1={x + 7} y1={top - 14} x2={x + 7} y2={top + bodyH + 14} stroke="rgba(255,255,255,0.18)" />
            <rect
              x={x}
              y={top}
              width={14}
              height={bodyH}
              fill={up ? "rgba(91,140,255,0.85)" : "rgba(255,255,255,0.14)"}
            />
          </g>
        );
      })}
      <DrawPath
        d="M31 92 L63 74 L95 96 L127 62 L159 80 L191 58 L223 72 L255 46 L287 60 L319 36 L351 50"
        stroke="#e0915a"
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
          fill={i === 4 ? "rgba(183,224,90,0.75)" : "rgba(91,140,255,0.5)"}
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      ))}
      <circle cx="330" cy="66" r="34" stroke="rgba(255,255,255,0.15)" />
      <DrawPath d="M330 32 A34 34 0 0 1 358 100" stroke="#5b8cff" />
      <DrawPath d="M358 100 A34 34 0 0 1 306 92" stroke="#b7e05a" delay={0.25} />
    </Frame>
  );
}

function Platform() {
  return (
    <svg viewBox="0 0 400 220" fill="none" className="h-full w-full" aria-hidden>
      <rect x="40" y="24" width="320" height="172" stroke="rgba(255,255,255,0.16)" />
      <line x1="40" y1="48" x2="360" y2="48" stroke="rgba(255,255,255,0.16)" />
      <circle cx="54" cy="36" r="3" fill="rgba(255,255,255,0.25)" />
      <circle cx="66" cy="36" r="3" fill="rgba(255,255,255,0.25)" />
      <rect x="56" y="64" width="96" height="10" fill="rgba(91,140,255,0.65)" />
      <rect x="56" y="86" width="150" height="6" fill="rgba(255,255,255,0.14)" />
      <rect x="56" y="100" width="122" height="6" fill="rgba(255,255,255,0.14)" />
      <rect x="56" y="128" width="130" height="52" stroke="rgba(255,255,255,0.14)" />
      <DrawPath d="M186 133 H300 V154" stroke="#5b8cff" delay={0.2} />
      <DrawPath d="M121 128 V108 H236" stroke="rgba(155,138,251,0.8)" delay={0.45} />
      <rect x="236" y="94" width="88" height="28" stroke="rgba(155,138,251,0.8)" />
      <rect x="300" y="154" width="46" height="26" stroke="rgba(91,140,255,0.7)" />
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
      <DrawPath d={toPath(pts)} stroke="#5b8cff" />
      <DrawPath d={toPath(val)} stroke="#9b8afb" delay={0.25} />
      {val.map(([x, y], i) =>
        i % 3 === 0 ? (
          <circle key={i} cx={x} cy={y} r="2" fill="rgba(155,138,251,0.9)" />
        ) : null,
      )}
      <line x1="290" y1="188" x2="384" y2="188" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 5" />
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
