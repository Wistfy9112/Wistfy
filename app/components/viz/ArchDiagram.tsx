"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/app/data/projects";

function Layer({
  layer,
  index,
  last,
}: {
  layer: Project["architecture"][number];
  index: number;
  last: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: reduced ? 0 : 0.45,
        delay: index * 0.09,
        ease: "easeOut",
      }}
    >
      <div className="flex flex-col gap-3 border border-edge bg-panel/60 p-5 sm:flex-row sm:items-center md:p-6">
        <div className="sm:w-44 md:w-52">
          <div className="text-base font-semibold tracking-tight">
            {layer.layer}
          </div>
          <div className="meta-label mt-1 text-faint">{layer.note}</div>
        </div>
        <div className="flex flex-1 flex-wrap gap-2 border-edge sm:border-l sm:pl-5">
          {layer.items.map((item) => (
            <span
              key={item}
              className="border border-hair px-2.5 py-1 font-mono text-[11px] tracking-[0.06em] text-dim"
            >
              {item}
            </span>
          ))}
        </div>
        <span className="meta-label hidden text-faint lg:block">
          L{String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {!last ? (
        <div className="flex justify-center py-1" aria-hidden>
          <span className="block h-4 w-px bg-edge" />
        </div>
      ) : null}
    </motion.div>
  );
}

export default function ArchDiagram({
  architecture,
}: {
  architecture: Project["architecture"];
}) {
  return (
    <div className="relative">
      {architecture.map((layer, i) => (
        <Layer
          key={layer.layer}
          layer={layer}
          index={i}
          last={i === architecture.length - 1}
        />
      ))}
    </div>
  );
}
