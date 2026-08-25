"use client";

import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import SystemField from "@/app/components/sections/SystemField";
import type { ScenePointer } from "@/app/components/viz/system/CoreScene";

/* three.js is heavy — load the scene bundle only after mount, and only
   when WebGL is actually available */
const CoreScene = dynamic(
  () => import("@/app/components/viz/system/CoreScene"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="meta-label text-[9px] text-faint">
          INITIALIZING FIELD
        </span>
      </div>
    ),
  },
);

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const HUD_STAGE = [0.05, 0.3, 0.55, 0.8];

function hudStage(delay: number, reduced: boolean) {
  return reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6, delay },
      };
}

export default function SystemField3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);

  const pointerRef = useRef<ScenePointer>({ x: 0, y: 0 });
  const visRef = useRef<boolean>(true);

  const reduced = useReducedMotion() ?? false;
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setMode(webglAvailable() ? "webgl" : "fallback"),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  /* pause the render loop's work while the field is off-screen */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        visRef.current = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  /* pointer → shared refs; HUD numbers flush through DOM, no re-renders */
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const flush = (t: number) => {
      raf = requestAnimationFrame(flush);
      if (t - last < 90) return;
      last = t;
      const p = pointerRef.current;
      if (xRef.current)
        xRef.current.textContent = String(
          Math.round((p.x + 0.5) * 720),
        ).padStart(3, "0");
      if (yRef.current)
        yRef.current.textContent = String(
          Math.round((0.5 - p.y) * 360),
        ).padStart(3, "0");
    };
    raf = requestAnimationFrame(flush);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onMove(e: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current.x = (e.clientX - rect.left) / rect.width - 0.5;
    pointerRef.current.y = (e.clientY - rect.top) / rect.height - 0.5;
  }

  function onLeave() {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-[420px] w-full select-none md:h-[520px] xl:h-[600px]"
      role="img"
      aria-label="WISTFY system field — an interactive 3D core with orbital vectors, active nodes and a live coordinate field"
    >
      {mode !== "fallback" ? (
        <SceneBoundary onFail={() => setMode("fallback")}>
          <CoreScene pointerRef={pointerRef} visRef={visRef} reduced={reduced} />
        </SceneBoundary>
      ) : (
        /* graceful degradation — the legacy 2D field stands in */
        <div className="absolute inset-0 flex items-center justify-center">
          <SystemField />
        </div>
      )}

      {/* engineering annotations — SYS.FIELD instrument block */}
      <div className="pointer-events-none absolute inset-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--viz-text)]">
        <motion.div
          {...hudStage(HUD_STAGE[1], reduced)}
          className="absolute right-[8%] top-[24%] space-y-1.5 text-right"
        >
          <p>SYS.FIELD</p>
          <p className="text-accent">CORE ACTIVE</p>
          <p>NODES: 84</p>
          <p>VECTOR: N7</p>
          <p>RES: 1.618</p>
        </motion.div>

        <motion.p
          {...hudStage(HUD_STAGE[2], reduced)}
          className="absolute bottom-[14%] right-[6%]"
        >
          X:<span ref={xRef}>360</span> Y:<span ref={yRef}>180</span>
        </motion.p>

        <motion.span
          {...hudStage(HUD_STAGE[3], reduced)}
          className="absolute left-1 top-3 flex items-center gap-2"
        >
          <span className="node-pulse inline-block h-1 w-1 rounded-full bg-accent" />
          SYS-01
        </motion.span>
      </div>
    </div>
  );
}
