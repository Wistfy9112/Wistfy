"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const VBW = 1120;
const VBH = 720;

/* frame — engineering viewport */
const FX = 40;
const FY = 110;
const FW = 1040;
const FH = 530;

/* grid calibration — every size derives from the background grid */
const GRID_PX = 88; /* bg-grid cell, globals.css background-size */
const SVG_RENDER_W = 1000; /* max-w constraint on the component root */
const UNIT_PX = SVG_RENDER_W / VBW; /* viewBox unit → css px at calibration */

/* wordmark metrics — one constructed object, six glyphs on a shared
   frame: every cell hangs from the same cap line (TOP_S), lands on the
   same baseline bus (BASE) and shares one vertical center. Cell widths
   come from the glyph definitions; spacing comes from the optical pair
   table below — never from uniform tracking. */
const GAP_AFTER: Record<string, number> = {
  W: 16, /* W → I — diagonal opens white wedge, tuck close at cap */
  I: 23,
  S: 23,
  T: 23,
  F: 23,
};

const LETTER_CELLS = 2.6; /* ISTFY cap height = 2.6 cells = 228.8px — wordmark occupies ~73% VBW / 78% frame */
const LETTER_H = (LETTER_CELLS * GRID_PX) / UNIT_PX; /* 256.3 local units */

const W_CELLS = 3.0; /* W ink height = 3.0 cells = 264px — focal but still baseline-aligned */
const W_INK_H = (W_CELLS * GRID_PX) / UNIT_PX; /* 295.7 local units */
const W_S = W_INK_H / 264; /* construction path is 264 units tall */
const W_W = 300 * W_S; /* unsqueezed ink width follows glyph aspect */
const W_NARROW = W_INK_H / W_W; /* squeeze → square 2.5×2.5 unit cell */
const W_W_NARROWED = W_W * W_NARROW;
const W_H = W_INK_H;

const BASE = FY + (FH + W_INK_H) / 2; /* word block vertically centered */
const K = LETTER_H / 200; /* glyph paths are 200 units tall */
const TOP_S = BASE - LETTER_H;
const W_Y = BASE - 264 * W_S; /* feet land exactly on BASE */
/* W_X and AXIS_X are derived after the word layout is measured */

const NS = { vectorEffect: "non-scaling-stroke" as const };

const S2 = "var(--viz-s2)";
const S3 = "var(--viz-s3)";
const TEXT = "var(--viz-text)";
const GRAPHITE = "color-mix(in srgb, var(--fg) 82%, transparent)";
const ACCENT = "var(--accent)";

/* load sequence — system builds itself */
const T = {
  frame: 0,
  grid: 0.18,
  nodes: 0.42,
  draw: 0.58,
  istfy: 1.05,
  core: 1.3,
  chrome: 1.45,
};

type LetterNode = {
  x: number;
  y: number;
  kind: "dot" | "ring" | "foot" | "dot-faint";
};

type Letter = {
  key: string;
  w: number;
  sw?: number;
  paths: string[];
  nodes: LetterNode[];
};

/* Each letter is a custom geometric construction, not a font.
   Stroke thickness is normalized to ~1.4–1.55 across all glyphs so
   no letter feels heavier. Every vertex has a precision node. */
const LETTER_DEFS: Letter[] = [
  {
    // I — extremely minimal vertical wire
    key: "I",
    w: 40,
    sw: 1.45,
    paths: ["M20 0 V200"],
    nodes: [
      { x: 20, y: 0, kind: "ring" },
      { x: 20, y: 100, kind: "dot-faint" },
      { x: 20, y: 200, kind: "foot" },
    ],
  },
  {
    // S — single elegant continuous curved wire (Bézier)
    // rotationally symmetric bowls with cap/baseline overshoot (±3)
    key: "S",
    w: 74,
    sw: 1.55,
    paths: [
      "M63 10 C57 -1 45 -4 32 -3 C15 -2 3 16 1.5 45 C0 72 13 86 36 100 C59 113 72 127 71 155 C70 184 57 202 41 203 C26 204 11 198 5 190",
    ],
    nodes: [
      { x: 63, y: 10, kind: "dot" },
      { x: 36, y: 100, kind: "dot-faint" },
      { x: 5, y: 190, kind: "dot" },
    ],
  },
  {
    // T — precise engineering drawing: horizontal cap + centered stem
    key: "T",
    w: 68,
    sw: 1.45,
    paths: ["M0 0 H68", "M34 0 V200"],
    nodes: [
      { x: 34, y: 0, kind: "dot" },
      { x: 0, y: 0, kind: "dot-faint" },
      { x: 68, y: 0, kind: "dot-faint" },
      { x: 34, y: 200, kind: "foot" },
    ],
  },
  {
    // F — straight lines, horizontal bars connect precisely to stem
    key: "F",
    w: 58,
    sw: 1.45,
    paths: ["M4 200 V0 H58", "M4 78 H47"],
    nodes: [
      { x: 58, y: 0, kind: "dot" },
      { x: 47, y: 78, kind: "dot-faint" },
      { x: 4, y: 200, kind: "foot" },
    ],
  },
  {
    // Y — two diagonals merging into vertical stem, dynamic
    key: "Y",
    w: 72,
    sw: 1.45,
    paths: ["M0 0 L36 80", "M72 0 L36 80", "M36 80 V200"],
    nodes: [
      { x: 0, y: 0, kind: "dot" },
      { x: 72, y: 0, kind: "dot" },
      { x: 36, y: 80, kind: "ring" },
      { x: 36, y: 200, kind: "foot" },
    ],
  },
];

/* layout — zero-origin axis pinned at W right edge, measured first,
   then centered inside frame; +3u bias corrects mass centroid */
let cursor = 0;
const LETTERS = LETTER_DEFS.map((l) => {
  const letter = { ...l, x: cursor };
  cursor += l.w * K + (GAP_AFTER[l.key] ?? 0) / UNIT_PX;
  return letter;
});
const EXTENSION_SPAN = cursor;

const W_I_GAP_U = GAP_AFTER.W / UNIT_PX;
const FULL_SPAN = W_W_NARROWED + W_I_GAP_U + EXTENSION_SPAN;
const W_X = FX + (FW - FULL_SPAN) / 2 + 3;
const AXIS_X = W_X + 151 * W_S * W_NARROW;
for (const l of LETTERS) l.x += W_X + W_W_NARROWED + W_I_GAP_U;
const WORD_END = W_X + FULL_SPAN;

/* dimension annotations — per-cell brackets above cap line */
type Measure = { from: number; to: number; label: string };
const CELL_MEASURES: Measure[] = (() => {
  const seq: Array<{ left: number; right: number; label: string }> = [
    { left: W_X, right: W_X + W_W_NARROWED, label: "240" },
    ...LETTERS.map((l, i) => ({
      left: l.x,
      right: l.x + l.w * K,
      label: ["144", "256", "232", "232", "248"][i] ?? "",
    })),
  ];
  return seq.map((s) => ({ from: s.left, to: s.right, label: s.label }));
})();
const MEASURE_Y = TOP_S - 30;
const TOTAL_MEASURE_Y = BASE + 34;
const TOTAL_LABEL = "1352";

/* W structural network — asymmetric, sharp central apex.
   Standalone logo box: viewBox="0 0 300 264".
   Core depth is grid-locked: CORE_CELLS above baseline. */
const CORE_CELLS = 1.75;
const CORE_Y = Number(
  (264 - (CORE_CELLS * GRID_PX) / (UNIT_PX * W_S)).toFixed(2),
);
const W_PATH = `M0 0 L58 264 L151 ${CORE_Y} L232 264 L300 10`;
const CORE = { x: 151, y: CORE_Y };
const MID_MEASURE = {
  x: (58 + CORE.x) / 2,
  y: (264 + CORE_Y) / 2,
};

const NODE_COUNT = 26;

// wireframe truss helpers — secondary triangular structure behind primary W
const W_TRUSS = [
  { x1: 0, y1: 0, x2: CORE.x, y2: CORE.y },
  { x1: 300, y1: 10, x2: CORE.x, y2: CORE.y },
  { x1: 58, y1: 264, x2: CORE.x, y2: CORE.y },
  { x1: 232, y1: 264, x2: CORE.x, y2: CORE.y },
  // diagonal cross forming subtle triangles
  { x1: 0, y1: 0, x2: 232, y2: 264 },
  { x1: 300, y1: 10, x2: 58, y2: 264 },
];

export default function WistfyIdentity() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 560, y: 360 });
  const [wSel, setWSel] = useState(false);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 45, damping: 18 });
  const sy = useSpring(rawY, { stiffness: 45, damping: 18 });

  const farX = useTransform(sx, [-0.5, 0.5], [3, -3]);
  const farY = useTransform(sy, [-0.5, 0.5], [2, -2]);
  const nearX = useTransform(sx, [-0.5, 0.5], [-1.5, 1.5]);
  const nearY = useTransform(sy, [-0.5, 0.5], [-1, 1]);
  const wX = useTransform(sx, [-0.5, 0.5], [2, -2]);
  const wY = useTransform(sy, [-0.5, 0.5], [-1.5, 1.5]);

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
    setCoords({ x: 560, y: 360 });
  }

  function stage(delay: number) {
    return reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.45, delay },
        };
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        onLeave();
        setWSel(false);
      }}
      className="mx-auto w-full max-w-[1000px] select-none"
    >
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        fill="none"
        className="h-auto w-full"
        role="img"
        aria-label="WISTFY identity system — geometric node-based wordmark where each letter is constructed from thin vectors and precision nodes"
      >
        <defs>
          {/* extremely subtle electric-blue glow for accent nodes */}
          <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.36  0 0 0 0 0.55  0 0 0 0 1  0 0 0 0.45 0"
              result="colored"
            />
            <feMerge>
              <feMergeNode in="colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="blue-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.36  0 0 0 0 0.55  0 0 0 0 1  0 0 0 0.22 0"
            />
          </filter>
        </defs>

        {/* ---------- source axis: hero → system ---------- */}
        <motion.g {...stage(T.grid)}>
          <line x1={AXIS_X} y1="10" x2={AXIS_X} y2={FY} style={{ stroke: S2 }} {...NS} />
          <rect x={AXIS_X - 2.5} y="6" width="5" height="5" style={{ fill: "var(--viz-dot)" }} />
          <rect x={AXIS_X - 2.5} y={FY - 4} width="5" height="5" style={{ fill: "var(--viz-dot)" }} />
          <text
            x={AXIS_X + 14}
            y="28"
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="10"
            letterSpacing="2"
            style={{ fill: TEXT }}
          >
            SRC / VO HUY
          </text>
        </motion.g>

        {/* ---------- far layer: viewport instrument ---------- */}
        <motion.g style={{ x: farX, y: farY }}>
          <motion.g {...stage(T.frame)}>
            <rect x={FX} y={FY} width={FW} height={FH} style={{ stroke: S2 }} {...NS} />
            {[
              [FX, FY],
              [FX + FW, FY],
              [FX, FY + FH],
              [FX + FW, FY + FH],
            ].map(([cx, cy]) => (
              <g key={`${cx}-${cy}`} style={{ stroke: S2 }} strokeWidth="1">
                <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
                <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
              </g>
            ))}
            {/* sparse edge ticks — measurement indicators */}
            <g style={{ stroke: S2 }} opacity="0.8">
              {Array.from({ length: 4 }, (_, i) => {
                const tx = FX + ((i + 1) * FW) / 5;
                return (
                  <g key={`t${tx}`}>
                    <line x1={tx} y1={FY} x2={tx} y2={FY + 6} />
                    <line x1={tx} y1={FY + FH - 6} x2={tx} y2={FY + FH} />
                  </g>
                );
              })}
            </g>
            {/* tiny coordinate marks along left edge */}
            <g style={{ stroke: S3 }} opacity="0.5">
              {Array.from({ length: 6 }, (_, i) => {
                const y = FY + 36 + i * 78;
                return <line key={y} x1={FX} y1={y} x2={FX + 4} y2={y} />;
              })}
            </g>
          </motion.g>

          <motion.g {...stage(T.grid)}>
            <ellipse
              cx="560"
              cy="382"
              rx="462"
              ry="128"
              transform="rotate(-2 560 382)"
              style={{ stroke: S2 }}
              strokeDasharray="1 9"
              strokeLinecap="round"
              opacity={0.9}
              {...NS}
            />
            <ellipse
              cx="560"
              cy="385"
              rx="398"
              ry="92"
              transform="rotate(-1.5 560 385)"
              style={{ stroke: S3 }}
              strokeDasharray="1 10"
              strokeLinecap="round"
              opacity={0.55}
              {...NS}
            />
          </motion.g>
        </motion.g>

        {/* ---------- construction grid (static anchor) ---------- */}
        <motion.g pointerEvents="none" {...stage(T.grid)}>
          <g style={{ opacity: wSel ? 1 : 0.55, transition: "opacity .35s" }}>
            <line
              x1={W_X - 20}
              y1={BASE}
              x2={WORD_END + 20}
              y2={BASE}
              style={{ stroke: S2 }}
              {...NS}
            />
            <line
              x1={LETTERS[0].x - 14}
              y1={TOP_S}
              x2={WORD_END + 14}
              y2={TOP_S}
              style={{ stroke: S3 }}
              strokeDasharray="4 6"
              {...NS}
            />
            <line
              x1={W_X - 24}
              y1={W_Y}
              x2={W_X + W_W + 24}
              y2={W_Y}
              strokeDasharray="5 7"
              style={{ stroke: S3 }}
              {...NS}
            />
            <g style={{ stroke: S2 }}>
              {Array.from({ length: 7 }, (_, i) => {
                const tx = LETTERS[0].x + (i * (WORD_END - LETTERS[0].x)) / 6;
                return <line key={tx} x1={tx} y1={BASE + 12} x2={tx} y2={BASE + 17} />;
              })}
            </g>
            <line
              x1={AXIS_X}
              y1={FY}
              x2={AXIS_X}
              y2={BASE + 18}
              strokeDasharray="3 6"
              style={{ stroke: S3 }}
              {...NS}
            />
            <g style={{ stroke: S2 }} opacity="0.95">
              <line x1={W_X} y1={TOTAL_MEASURE_Y} x2={WORD_END} y2={TOTAL_MEASURE_Y} {...NS} />
              <line x1={W_X} y1={TOTAL_MEASURE_Y - 6} x2={W_X} y2={TOTAL_MEASURE_Y + 6} />
              <line x1={WORD_END} y1={TOTAL_MEASURE_Y - 6} x2={WORD_END} y2={TOTAL_MEASURE_Y + 6} />
            </g>
            <text
              x={(W_X + WORD_END) / 2}
              y={TOTAL_MEASURE_Y + 14}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize="9"
              letterSpacing="1.5"
              style={{ fill: TEXT }}
            >
              {TOTAL_LABEL}
            </text>
            <g
              style={{ opacity: wSel ? 1 : 0, transition: "opacity .3s" }}
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize="11"
              letterSpacing="2.5"
            >
              <rect x={W_X} y={BASE + 48} width="6" height="6" style={{ fill: ACCENT }} />
              <text x={W_X + 16} y={BASE + 56} style={{ fill: ACCENT }}>
                W / SELECTED
              </text>
            </g>
          </g>
        </motion.g>

        {/* ---------- per-cell dimension brackets ---------- */}
        <motion.g pointerEvents="none" opacity="0.7" {...stage(T.grid)}>
          <g style={{ stroke: S3 }}>
            {CELL_MEASURES.map((m) => (
              <g key={`b${m.from}-${m.to}`}>
                <line x1={m.from} y1={MEASURE_Y} x2={m.to} y2={MEASURE_Y} {...NS} />
                <line x1={m.from} y1={MEASURE_Y - 4} x2={m.from} y2={MEASURE_Y + 4} />
                <line x1={m.to} y1={MEASURE_Y - 4} x2={m.to} y2={MEASURE_Y + 4} />
              </g>
            ))}
          </g>
          {CELL_MEASURES.map((m) => (
            <text
              key={`v${m.from}-${m.to}`}
              x={(m.from + m.to) / 2}
              y={MEASURE_Y - 8}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize="8.5"
              letterSpacing="1"
              style={{ fill: TEXT }}
            >
              {m.label}
            </text>
          ))}
        </motion.g>

        {/* ---------- near layer: I S T F Y extension — thin wireframe ---------- */}
        <motion.g style={{ x: nearX, y: nearY }}>
          <motion.g {...stage(T.istfy)}>
            {LETTERS.map((l) => (
              <g key={l.key} transform={`translate(${l.x} ${TOP_S}) scale(${K})`}>
                {l.paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    style={{ stroke: GRAPHITE }}
                    strokeWidth={l.sw ?? 1.45}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...NS}
                  />
                ))}
                {l.nodes.map((n, ni) => {
                  if (n.kind === "foot") {
                    return (
                      <rect
                        key={ni}
                        x={n.x - 2}
                        y={n.y - 2}
                        width="4"
                        height="4"
                        style={{ fill: GRAPHITE }}
                      />
                    );
                  }
                  if (n.kind === "ring") {
                    return (
                      <circle
                        key={ni}
                        cx={n.x}
                        cy={n.y}
                        r="3.6"
                        style={{ stroke: GRAPHITE }}
                        strokeWidth="1"
                        fill="var(--bg)"
                      />
                    );
                  }
                  if (n.kind === "dot-faint") {
                    return (
                      <circle
                        key={ni}
                        cx={n.x}
                        cy={n.y}
                        r="1.7"
                        style={{ fill: "var(--viz-dot)", opacity: 0.9 }}
                      />
                    );
                  }
                  return (
                    <circle
                      key={ni}
                      cx={n.x}
                      cy={n.y}
                      r="2.15"
                      style={{ fill: "var(--bg)", stroke: GRAPHITE }}
                      strokeWidth="0.95"
                    />
                  );
                })}
              </g>
            ))}
          </motion.g>
        </motion.g>

        {/* ---------- W: primary identity element — geometric node network ---------- */}
        <motion.g style={{ x: wX, y: wY }}>
          <g transform={`translate(${W_X} ${W_Y}) scale(${W_S * W_NARROW} ${W_S})`}>
            <rect
              x="-24"
              y="-40"
              width={W_W + 48}
              height={W_H + 84}
              fill="transparent"
              pointerEvents="all"
              data-cursor="SYS"
              onMouseEnter={() => setWSel(true)}
              onMouseLeave={() => setWSel(false)}
            />

            {/* secondary wireframe truss — subtle triangular structures behind primary */}
            <g pointerEvents="none" opacity={wSel ? 0.58 : 0.32} style={{ transition: "opacity .35s" }}>
              {W_TRUSS.map((s, i) => (
                <line
                  key={i}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  style={{ stroke: GRAPHITE }}
                  strokeWidth={i < 4 ? 0.85 : 0.65}
                  opacity={i >= 4 ? 0.52 : 1}
                  {...NS}
                />
              ))}
            </g>

            {/* primary W vector — extremely thin, precise */}
            <motion.path
              d={W_PATH}
              pointerEvents="none"
              style={{ stroke: GRAPHITE }}
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...NS}
              {...(!reduced
                ? {
                    initial: { pathLength: 0, opacity: 0 },
                    animate: { pathLength: 1, opacity: 1 },
                    transition: {
                      pathLength: { duration: 0.85, delay: T.draw, ease: "easeInOut" },
                      opacity: { duration: 0.2, delay: T.draw },
                    },
                  }
                : {})}
            />

            {/* W nodes — small precision-machined circular points */}
            <g pointerEvents="none">
              {/* N1 top-left terminal — open ring */}
              <motion.circle
                cx="0"
                cy="0"
                r="3.8"
                strokeWidth="0.95"
                fill="var(--bg)"
                style={{ stroke: GRAPHITE }}
                {...(!reduced
                  ? {
                      initial: { opacity: 0, scale: 0.7 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.35, delay: T.nodes },
                    }
                  : {})}
              />
              {/* N5 top-right terminal — open ring */}
              <motion.circle
                cx="300"
                cy="10"
                r="3.8"
                strokeWidth="0.95"
                fill="var(--bg)"
                style={{ stroke: GRAPHITE }}
                {...(!reduced
                  ? {
                      initial: { opacity: 0, scale: 0.7 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.35, delay: T.nodes + 0.07 },
                    }
                  : {})}
              />
              {/* N2 baseline left — square contact */}
              <motion.rect
                x="55.5"
                y="261.5"
                width="5"
                height="5"
                style={{ fill: GRAPHITE, stroke: GRAPHITE }}
                strokeWidth="0.7"
                {...(!reduced
                  ? {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { duration: 0.3, delay: T.nodes + 0.14 },
                    }
                  : {})}
              />
              {/* N4 baseline right — square contact */}
              <motion.rect
                x="229.5"
                y="261.5"
                width="5"
                height="5"
                style={{ fill: GRAPHITE, stroke: GRAPHITE }}
                strokeWidth="0.7"
                {...(!reduced
                  ? {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { duration: 0.3, delay: T.nodes + 0.21 },
                    }
                  : {})}
              />
              {/* intermediate nodes along secondary diagonals — subtle faint dots */}
              <motion.circle
                cx="74"
                cy="68"
                r="1.65"
                style={{ fill: "var(--viz-dot)", opacity: 0.95 }}
                {...(!reduced
                  ? {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { duration: 0.3, delay: T.nodes + 0.18 },
                    }
                  : {})}
              />
              <motion.circle
                cx="226"
                cy="72"
                r="1.65"
                style={{ fill: "var(--viz-dot)", opacity: 0.95 }}
                {...(!reduced
                  ? {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { duration: 0.3, delay: T.nodes + 0.22 },
                    }
                  : {})}
              />
              {/* measurement point on primary stroke */}
              <motion.rect
                x={MID_MEASURE.x - 1.5}
                y={MID_MEASURE.y - 1.5}
                width="3"
                height="3"
                style={{ fill: "var(--viz-dot)" }}
                {...(!reduced
                  ? {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { duration: 0.3, delay: T.nodes + 0.26 },
                    }
                  : {})}
              />
              {/* blue accent nodes — electric blue subtle glow */}
              <motion.circle
                cx={CORE.x - 18}
                cy={CORE.y - 14}
                r="2.0"
                style={{ fill: ACCENT, opacity: 0.95 }}
                filter="url(#blue-glow-soft)"
                {...(!reduced
                  ? {
                      initial: { opacity: 0, scale: 0.6 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.4, delay: T.core - 0.1 },
                    }
                  : {})}
              />
            </g>

            {/* terminal guides — faint dashed construction extensions */}
            <g pointerEvents="none" style={{ opacity: wSel ? 0.9 : 0, transition: "opacity .35s" }}>
              <line
                x1="0"
                y1="0"
                x2="-5.2"
                y2="-20.8"
                strokeDasharray="2 5"
                style={{ stroke: S2 }}
                {...NS}
              />
              <line
                x1="300"
                y1="10"
                x2="304.6"
                y2="-6.2"
                strokeDasharray="2 5"
                style={{ stroke: S2 }}
                {...NS}
              />
            </g>

            {/* vertex labels — only on hover selection */}
            <g
              pointerEvents="none"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize="10"
              letterSpacing="1"
              style={{ opacity: wSel ? 1 : 0, transition: "opacity .3s", fill: TEXT }}
            >
              <text x="-10" y="-11" textAnchor="end">
                N1
              </text>
              <text x="58" y="280" textAnchor="middle">
                N2
              </text>
              <text x={CORE.x + 11} y={CORE.y + 5}>
                CORE
              </text>
              <text x="232" y="280" textAnchor="middle">
                N4
              </text>
              <text x="310" y="4">
                N5
              </text>
            </g>

            {/* the core — electric blue accent, subtle glow */}
            <g pointerEvents="none">
              {/* faint outer ring */}
              <circle
                cx={CORE.x}
                cy={CORE.y}
                r="7.6"
                style={{ stroke: GRAPHITE, opacity: 0.22 }}
                strokeWidth="0.8"
                fill="none"
              />
              <motion.circle
                cx={CORE.x}
                cy={CORE.y}
                r="6.2"
                style={{ stroke: ACCENT }}
                strokeWidth="1.1"
                fill="var(--bg)"
                filter="url(#blue-glow-soft)"
                {...stage(T.core)}
              />
              <motion.circle
                cx={CORE.x}
                cy={CORE.y}
                r="2.9"
                style={{ fill: ACCENT }}
                className="node-pulse"
                filter="url(#blue-glow)"
                {...stage(T.core)}
              />
              {/* inner highlight */}
              <circle cx={CORE.x} cy={CORE.y} r="1.1" fill="white" opacity="0.9" />
            </g>
          </g>
        </motion.g>

        {/* ---------- static labels (instrument chrome) — tiny monochrome secondary ---------- */}
        <g fontFamily="var(--font-jetbrains-mono), monospace" fontSize="11" letterSpacing="2.5">
          <motion.g {...stage(T.frame)}>
            <text x="56" y="78" style={{ fill: TEXT }}>
              WISTFY / SYSTEM
            </text>
          </motion.g>

          <motion.g {...stage(T.chrome)}>
            <text x={VBW - 56} y="66" textAnchor="end" style={{ fill: ACCENT }} fontSize="11">
              CORE ACTIVE
            </text>
            <text
              x={VBW - 56}
              y="82"
              textAnchor="end"
              fontSize="9"
              letterSpacing="1.5"
              style={{ fill: TEXT }}
            >
              {`CORE = ${String(Math.round(CORE.x)).padStart(3, "0")}, ${String(Math.round(CORE.y)).padStart(3, "0")}`}
            </text>
          </motion.g>

          <motion.g {...stage(T.chrome)}>
            <text x="56" y={VBH - 26} style={{ fill: TEXT }}>
              IDENTITY / 01
            </text>
            <text x={VBW / 2} y={VBH - 26} textAnchor="middle" style={{ fill: TEXT }}>
              {`X:${String(coords.x).padStart(3, "0")} Y:${String(coords.y).padStart(3, "0")} Z:0`}
            </text>
            <text x={VBW - 56} y={VBH - 26} textAnchor="end" style={{ fill: TEXT }}>
              {`NODE: ${NODE_COUNT}`}
            </text>
          </motion.g>
        </g>

        {/* VECTOR FIELD — rotated margin label */}
        <motion.text
          transform={`rotate(90 ${VBW - 14} 375)`}
          x={VBW - 14}
          y="375"
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="10"
          letterSpacing="3"
          style={{ fill: TEXT }}
          {...stage(T.chrome)}
        >
          VECTOR FIELD
        </motion.text>

        {/* tiny registration cross bottom left — engineering mark */}
        <g style={{ stroke: S2 }} strokeWidth="0.9" opacity="0.9">
          <line x1="18" y1={VBH - 38} x2="26" y2={VBH - 38} />
          <line x1="22" y1={VBH - 42} x2="22" y2={VBH - 34} />
          <circle cx="22" cy={VBH - 38} r="6.5" fill="none" style={{ stroke: S3 }} strokeWidth="0.6" />
        </g>
      </svg>
    </div>
  );
}
