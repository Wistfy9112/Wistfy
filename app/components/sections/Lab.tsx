"use client";

import { useMemo, useState } from "react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import { labExperiments, codeSample } from "@/app/data/lab";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 640;
const H = 240;
const N = 90;

function buildSeries() {
  const rand = mulberry32(20240117);
  let v = 120;
  return Array.from({ length: N }, (_, i) => {
    v += (rand() - 0.48) * 14;
    const drift = Math.sin(i / 14) * 3.5;
    return { x: (i / (N - 1)) * W, y: H - Math.min(Math.max(v + drift, 18), H - 18) };
  });
}

const STATUS_COLOR: Record<string, string> = {
  active: "#5b8cff",
  wip: "#e0915a",
  queued: "rgba(255,255,255,0.25)",
};

function TileHeader({
  id,
  title,
  status,
}: {
  id: string;
  title: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-hair px-5 py-3.5">
      <div className="flex items-center gap-3">
        <span
          className="node-pulse h-1.5 w-1.5 rounded-full"
          style={{ background: STATUS_COLOR[status] }}
        />
        <span className="text-sm font-medium tracking-tight">{title}</span>
      </div>
      <span className="meta-label text-faint">
        {id} · {status.toUpperCase()}
      </span>
    </div>
  );
}

function MarketChart() {
  const series = useMemo(() => buildSeries(), []);
  const [hover, setHover] = useState<number | null>(null);

  const line = series.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  const point = hover !== null ? series[hover] : null;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setHover(Math.round(ratio * (N - 1)));
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-full w-full cursor-crosshair"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label="Interactive market simulation chart"
    >
      <g stroke="rgba(255,255,255,0.05)">
        {[60, 120, 180].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} />
        ))}
      </g>
      <path d={area} fill="rgba(224,145,90,0.06)" />
      <path d={line} stroke="#e0915a" strokeWidth="1.5" fill="none" />
      {point ? (
        <g>
          <line x1={point.x} y1="0" x2={point.x} y2={H} stroke="rgba(255,255,255,0.25)" strokeDasharray="3 4" />
          <line x1="0" y1={point.y} x2={W} y2={point.y} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4" />
          <circle cx={point.x} cy={point.y} r="3.5" fill="#e0915a" />
          <g transform={`translate(${Math.min(point.x + 12, W - 128)}, ${Math.max(point.y - 30, 10)})`}>
            <rect width="116" height="20" fill="rgba(10,10,10,0.9)" stroke="rgba(255,255,255,0.15)" />
            <text x="8" y="13.5" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="10" letterSpacing="1" fill="#f5f5f5">
              {`T${String(hover ?? 0).padStart(3, "0")} · P ${point.y.toFixed(1)}`}
            </text>
          </g>
        </g>
      ) : null}
    </svg>
  );
}

function NetworkGraph() {
  const nodes: [number, number][] = [
    [70, 50], [180, 34], [300, 62], [420, 38], [520, 66],
    [110, 140], [230, 150], [350, 132], [470, 148],
    [170, 210], [320, 205], [460, 212],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8],
    [5, 6], [6, 7], [7, 8], [5, 9], [6, 10], [7, 10], [8, 11], [9, 10], [10, 11],
  ];
  const hubs = new Set([2, 6, 10]);
  return (
    <svg viewBox="0 0 640 250" className="block h-full w-full" aria-hidden>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgba(183,224,90,0.16)" />
      ))}
      {nodes.map(([x, y], i) =>
        hubs.has(i) ? (
          <circle key={i} cx={x} cy={y} r="4" fill="#b7e05a" className="node-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
        ) : (
          <rect key={i} x={x - 2.5} y={y - 2.5} width="5" height="5" fill="rgba(255,255,255,0.35)" />
        ),
      )}
    </svg>
  );
}

function BacktestMetrics() {
  const rows = [
    ["Return", "+18.4%", 78, "#5b8cff"],
    ["Max drawdown", "-9.2%", 42, "#e0915a"],
    ["Win rate", "61%", 61, "#b7e05a"],
    ["Exposure", "37%", 37, "rgba(255,255,255,0.4)"],
  ] as const;
  return (
    <dl className="space-y-5 px-5 py-5">
      {rows.map(([label, value, pct, color]) => (
        <div key={label}>
          <div className="flex items-baseline justify-between">
            <dt className="meta-label text-faint">{label}</dt>
            <dd className="font-mono text-sm text-fg">{value}</dd>
          </div>
          <div className="mt-2 h-[3px] w-full bg-hair">
            <div className="h-full" style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>
      ))}
    </dl>
  );
}

function CodeTile({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto px-5 py-5 font-mono text-xs leading-relaxed text-dim">
      <code>
        {code.split("\n").map((l, i) => (
          <span key={i} className="flex">
            <span className="w-8 select-none text-faint">{String(i + 1).padStart(2, "0")}</span>
            <span className={l.trimStart().startsWith("//") ? "text-faint italic" : "text-dim"}>
              {l || " "}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export default function Lab() {
  const byId = Object.fromEntries(labExperiments.map((e) => [e.id, e]));

  return (
    <section id="lab" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader
            index="06"
            label="Lab"
            title="Currently running in the workshop"
            lede="Ongoing experiments — market analytics, dependency graphs, strategy evaluation. The systems I take apart when nobody is asking me to."
          />
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-hair bg-hair lg:grid-cols-12">
          <Reveal className="bg-base lg:col-span-7">
            <div className="flex h-full flex-col">
              <TileHeader {...byId.market} />
              <div className="min-h-[220px] flex-1 p-3">
                <MarketChart />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="bg-base lg:col-span-5">
            <div className="flex h-full flex-col">
              <TileHeader {...byId.network} />
              <div className="min-h-[200px] flex-1 p-3">
                <NetworkGraph />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="bg-base lg:col-span-4">
            <div className="flex h-full flex-col">
              <TileHeader {...byId.backtest} />
              <BacktestMetrics />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="bg-base lg:col-span-8">
            <div className="flex h-full flex-col">
              <TileHeader {...byId.pipeline} />
              <CodeTile code={codeSample} />
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="meta-label mt-6 text-faint">
            All figures generated in-browser — SVG, no images, no WebGL.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
