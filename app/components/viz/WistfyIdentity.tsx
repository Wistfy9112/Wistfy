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
  W: 16, /* W > I — the rising diagonal opens a white wedge under the
            cap, so the cells tuck close at the top line */
  I: 23, /* I > S — the S waist bulges toward the I mid-stem; snug at
            the waist keeps the thin I from reading as a separator */
  S: 23, /* S > T — the curve still gets air from its trailing
            sidebearing plus T's overhanging cap arm */
  T: 23, /* T > F — matched tracking; T's overhanging cap bar keeps
            the pair visually locked despite the equal gap */
  F: 23, /* F > Y — Y's arms lean away from the bar tip, echoing the
            S>T rhythm so the tail keeps the same cadence */
};

const LETTER_CELLS = 2; /* ISTFY cap height = 2 cells = 176px */
const LETTER_H = (LETTER_CELLS * GRID_PX) / UNIT_PX; /* 197.1 local units */

const W_CELLS = 2.5; /* W ink height = 2.5 cells = 220px */
const W_INK_H = (W_CELLS * GRID_PX) / UNIT_PX; /* 246.4 local units */
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

/* load sequence — system builds itself, ~1.8s total */
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
  kind: "dot" | "ring" | "foot";
};

type Letter = {
  key: string;
  w: number;
  sw?: number; /* optical stroke compensation */
  paths: string[];
  nodes: LetterNode[];
};

const LETTER_DEFS: Letter[] = [
  {
    /* zero-based ink: advance == glyph width; the wide cap bars give
       the narrow stem a full visual cell without heavier strokes */
    key: "I",
    w: 44,
    paths: ["M22 0 V200", "M0 0 H44", "M0 200 H44"],
    nodes: [
      { x: 22, y: 100, kind: "dot" },
      { x: 22, y: 200, kind: "foot" },
    ],
  },
  {
    /* constructed S — rotationally symmetric bowls with cap/baseline
       overshoot (±3) so the curves claim the same optical box as the
       flat glyphs; extended horizontal terminals widen its footprint */
    key: "S",
    w: 74,
    sw: 2.8,
    paths: [
      "M63 10 C57 -1 45 -4 32 -3 C15 -2 3 16 1.5 45 C0 72 13 86 36 100 C59 113 72 127 71 155 C70 184 57 202 41 203 C26 204 11 198 5 190",
    ],
    nodes: [
      { x: 63, y: 10, kind: "dot" },
      { x: 5, y: 190, kind: "dot" },
    ],
  },
  {
    key: "T",
    w: 68,
    paths: ["M0 0 H68", "M34 0 V200"],
    nodes: [
      { x: 34, y: 0, kind: "dot" },
      { x: 34, y: 200, kind: "foot" },
    ],
  },
  {
    /* F shares T's construction logic: stem inset 4 from the cell edge,
       cap bar spanning the full cell, mid bar at 81% of the cell */
    key: "F",
    w: 58,
    paths: ["M4 200 V0 H58", "M4 78 H47"],
    nodes: [
      { x: 58, y: 0, kind: "dot" },
      { x: 4, y: 200, kind: "foot" },
    ],
  },
  {
    key: "Y",
    w: 72,
    paths: ["M0 0 L36 80", "M72 0 L36 80", "M36 80 V200"],
    nodes: [
      { x: 0, y: 0, kind: "dot" },
      { x: 72, y: 0, kind: "dot" },
      { x: 36, y: 80, kind: "ring" },
      { x: 36, y: 200, kind: "foot" },
    ],
  },
];

/* layout runs on a zero-origin axis pinned at the W's right edge so
   the full span can be measured first, then the word is pinned
   dead-center inside the frame; a +3u bias corrects the measured mass
   centroid, which sits a hair right of the bounding-box center */
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

/* dimension annotations — per-cell brackets above the cap line, matching
   the reference sheet; values are sheet units summing to the total span */
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
const MEASURE_Y = TOP_S - 30; /* dimension band above the cap line */
const TOTAL_MEASURE_Y = BASE + 34;
const TOTAL_LABEL = "1352";

/* W structural network — asymmetric, sharp central apex.
   Standalone logo box: viewBox="0 0 300 264".
   The core depth is grid-locked: CORE_CELLS above the baseline. */
const CORE_CELLS = 1.75; /* core sits 1.75 cells = 154px above the baseline */
const CORE_Y = Number(
  (264 - (CORE_CELLS * GRID_PX) / (UNIT_PX * W_S)).toFixed(2),
); /* path units */
const W_PATH = `M0 0 L58 264 L151 ${CORE_Y} L232 264 L300 10`;
const CORE = { x: 151, y: CORE_Y };
const MID_MEASURE = {
  x: (58 + CORE.x) / 2,
  y: (264 + CORE_Y) / 2,
}; /* coordinate intersection on N2→core stroke */

const NODE_COUNT = 26;

export default function WistfyIdentity() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 560, y: 360 });
  const [wSel, setWSel] = useState(false);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, { stiffness: 45, damping: 18 });
  const sy = useSpring(rawY, { stiffness: 45, damping: 18 });

  /* quiet parallax — 1–3px per layer */
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

  /* staged fade — skipped entirely under reduced motion */
  function stage(delay: number) {
    return reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.45, delay },
        };
  }

  const selStroke = (base: string) => (wSel ? ACCENT : base);

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
        aria-label="WISTFY identity system — the letter W constructed from a network of nodes and vectors"
      >
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
            {/* sparse edge ticks */}
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
            {/* secondary faint orbit — adds the layered field feel of the reference */}
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
            {/* shared baseline bus — W and ISTFY hang from one line */}
            <line
              x1={W_X - 20}
              y1={BASE}
              x2={WORD_END + 20}
              y2={BASE}
              style={{ stroke: S2 }}
              {...NS}
            />
            {/* cap line for the extension */}
            <line
              x1={LETTERS[0].x - 14}
              y1={TOP_S}
              x2={WORD_END + 14}
              y2={TOP_S}
              style={{ stroke: S3 }}
              {...NS}
            />
            {/* elevated cap of the W */}
            <line
              x1={W_X - 24}
              y1={W_Y}
              x2={W_X + W_W + 24}
              y2={W_Y}
              strokeDasharray="5 7"
              style={{ stroke: S3 }}
              {...NS}
            />
            {/* measurement ticks under the extension */}
            <g style={{ stroke: S2 }}>
              {Array.from({ length: 7 }, (_, i) => {
                const tx =
                  LETTERS[0].x + (i * (WORD_END - LETTERS[0].x)) / 6;
                return (
                  <line key={tx} x1={tx} y1={BASE + 12} x2={tx} y2={BASE + 17} />
                );
              })}
            </g>
            {/* core axis through the W */}
            <line
              x1={AXIS_X}
              y1={FY}
              x2={AXIS_X}
              y2={BASE + 18}
              strokeDasharray="3 6"
              style={{ stroke: S3 }}
              {...NS}
            />
            {/* total span dimension — 1352 as in the reference sheet */}
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
            {/* hover status chip */}
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

        {/* ---------- per-cell dimension brackets — one above each glyph cell ---------- */}
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

        {/* ---------- near layer: I S T F Y extension ---------- */}
        <motion.g style={{ x: nearX, y: nearY }}>
          <motion.g {...stage(T.istfy)}>
            {LETTERS.map((l) => (
              <g
                key={l.key}
                transform={`translate(${l.x} ${TOP_S}) scale(${K})`}
              >
                {l.paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    style={{ stroke: GRAPHITE }}
                    strokeWidth={l.sw ?? 2.4}
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
                      cx={n.x}
                      cy={n.y}
                      r="2.2"
                      style={{ fill: "var(--bg)", stroke: GRAPHITE }}
                      strokeWidth="1"
                    />
                  );
                })}
              </g>
            ))}
          </motion.g>
        </motion.g>

        {/* ---------- W: primary identity element ---------- */}
        <motion.g style={{ x: wX, y: wY }}>
          <g transform={`translate(${W_X} ${W_Y}) scale(${W_S * W_NARROW} ${W_S})`}>
            {/* hit area */}
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

            {/* node anchors appear first — the system defines its points */}
            <g pointerEvents="none">
              {/* terminals N1 / N5 — open rings */}
              {[
                { x: 0, y: 0, id: "N1" },
                { x: 300, y: 10, id: "N5" },
              ].map((v, i) => (
                <motion.circle
                  key={v.id}
                  cx={v.x}
                  cy={v.y}
                  r="4.5"
                  strokeWidth="1.2"
                  fill="var(--bg)"
                  style={{
                    stroke: selStroke(GRAPHITE),
                    transition: "stroke .3s",
                  }}
                  {...(!reduced
                    ? {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        transition: { duration: 0.3, delay: T.nodes + i * 0.07 },
                      }
                    : {})}
                />
              ))}
              {/* baseline vertices N2 / N4 — square contacts */}
              {[
                { x: 58, y: 264, id: "N2" },
                { x: 232, y: 264, id: "N4" },
              ].map((v, i) => (
                <motion.rect
                  key={v.id}
                  x={v.x - 2.5}
                  y={v.y - 2.5}
                  width="5"
                  height="5"
                  style={{
                    fill: selStroke("var(--bg)"),
                    stroke: selStroke(GRAPHITE),
                    transition: "fill .3s, stroke .3s",
                  }}
                  strokeWidth="1"
                  {...(!reduced
                    ? {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        transition: {
                          duration: 0.3,
                          delay: T.nodes + (i + 2) * 0.07,
                        },
                      }
                    : {})}
                />
              ))}
              {/* measurement point on the primary stroke */}
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
                      transition: { duration: 0.3, delay: T.nodes + 4 * 0.07 },
                    }
                  : {})}
              />
            </g>

            {/* hairline network under the ribbon — faint truss as in the sheet */}
            <g pointerEvents="none" opacity={wSel ? 0.62 : 0.32} style={{ transition: "opacity .35s" }}>
              <line x1="0" y1="0" x2={CORE.x} y2={CORE.y} style={{ stroke: GRAPHITE }} strokeWidth="0.9" {...NS} />
              <line x1="300" y1="10" x2={CORE.x} y2={CORE.y} style={{ stroke: GRAPHITE }} strokeWidth="0.9" {...NS} />
              <line x1="58" y1="264" x2={CORE.x} y2={CORE.y} style={{ stroke: GRAPHITE }} strokeWidth="0.7" opacity={0.6} {...NS} />
              <line x1="232" y1="264" x2={CORE.x} y2={CORE.y} style={{ stroke: GRAPHITE }} strokeWidth="0.7" opacity={0.6} {...NS} />
            </g>

            {/* primary vector draws itself through the nodes — thick ribbon */}
            <motion.path
              d={W_PATH}
              pointerEvents="none"
              style={{
                stroke: "color-mix(in srgb, var(--fg) 92%, transparent)",
              }}
              strokeWidth="9.5"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              {...NS}
              {...(!reduced
                ? {
                    initial: { pathLength: 0, opacity: 0 },
                    animate: { pathLength: 1, opacity: 1 },
                    transition: {
                      pathLength: {
                        duration: 0.6,
                        delay: T.draw,
                        ease: "easeInOut",
                      },
                      opacity: { duration: 0.2, delay: T.draw },
                    },
                  }
                : {})}
            />

            {/* secondary construction — brightens when selected */}
            <g
              pointerEvents="none"
              style={{ opacity: wSel ? 1 : 0, transition: "opacity .35s" }}
            >
              {/* diagonal terminal guides — right one intentionally incomplete */}
              <line
                x1="0"
                y1="0"
                x2="-4.7"
                y2="-21.5"
                strokeDasharray="2 6"
                style={{ stroke: S2 }}
                {...NS}
              />
              <line
                x1="300"
                y1="10"
                x2="304.1"
                y2="-5.5"
                strokeDasharray="2 6"
                style={{ stroke: S2 }}
                {...NS}
              />
            </g>

            {/* vertex labels — revealed on selection (fontSize compensates
                the group scale so rendered size stays ~9) */}
            <g
              pointerEvents="none"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize="11"
              letterSpacing="1"
              style={{ opacity: wSel ? 1 : 0, transition: "opacity .3s", fill: TEXT }}
            >
              <text x="-10" y="-12" textAnchor="end">N1</text>
              <text x="58" y="280" textAnchor="middle">N2</text>
              <text x={CORE.x + 11} y={CORE.y + 6}>CORE</text>
              <text x="232" y="280" textAnchor="middle">N4</text>
              <text x="310" y="4">N5</text>
            </g>

            {/* the core — activates last */}
            <g pointerEvents="none">
              <circle cx={CORE.x} cy={CORE.y} r="7" style={{ stroke: GRAPHITE, opacity: 0.55 }} strokeWidth="1.1" fill="var(--bg)" />
              <motion.circle
                cx={CORE.x}
                cy={CORE.y}
                r="7"
                style={{ stroke: ACCENT }}
                strokeWidth="1.2"
                fill="var(--bg)"
                {...stage(T.core)}
              />
              <motion.circle
                cx={CORE.x}
                cy={CORE.y}
                r="3.2"
                style={{ fill: ACCENT }}
                className="node-pulse"
                {...stage(T.core)}
              />
            </g>
          </g>
        </motion.g>

        {/* ---------- static labels (instrument chrome) ---------- */}
        <g
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="11"
          letterSpacing="2.5"
        >
          <motion.g {...stage(T.frame)}>
            <text x="56" y="78" style={{ fill: TEXT }}>
              WISTFY / SYSTEM
            </text>
          </motion.g>

          <motion.g {...stage(T.chrome)}>
            <text x={VBW - 56} y="66" textAnchor="end" style={{ fill: ACCENT }}>
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
            <text
              x={VBW / 2}
              y={VBH - 26}
              textAnchor="middle"
              style={{ fill: TEXT }}
            >
              {`X:${String(coords.x).padStart(3, "0")} Y:${String(coords.y).padStart(3, "0")}`}
            </text>
            <text x={VBW - 56} y={VBH - 26} textAnchor="end" style={{ fill: TEXT }}>
              {`NODE: ${NODE_COUNT}`}
            </text>
          </motion.g>
        </g>

        {/* VECTOR FIELD — rotated margin label, outside the viewport frame */}
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
      </svg>
    </div>
  );
}
