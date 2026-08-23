"use client";

import { useCallback, useState } from "react";
import { useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

function subscribePointerFine(callback: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPointerFine() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getPointerFineServer() {
  return false;
}

export default function CursorRing() {
  const reduced = useReducedMotion();
  const pointerFine = useSyncExternalStore(
    subscribePointerFine,
    getPointerFine,
    getPointerFineServer,
  );
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor]",
      ) as HTMLElement | null;
      setActive(Boolean(target));
      setLabel(target?.getAttribute("data-cursor") ?? "");
    },
    [x, y],
  );

  if (!pointerFine || reduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90]"
      onMouseMove={onMove}
      aria-hidden
    >
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-accent/70"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          width: label ? 64 : active ? 44 : 26,
          height: label ? 64 : active ? 44 : 26,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {label ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-fg">
            {label}
          </span>
        ) : null}
      </motion.div>
    </div>
  );
}
