"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import WistfyIdentity from "@/app/components/viz/WistfyIdentity";
import SystemField3D from "@/app/components/viz/SystemField3D";
import { site } from "@/app/data/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 0.4, 0.2, 1] as const },
  },
} as const;

export default function Hero() {
  return (
    <section id="top" className="relative overflow-visible">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-32 md:px-8 md:pb-10 md:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,42%)] lg:gap-14 xl:gap-16">
          {/* ---------- left: the person ---------- */}
          <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="flex items-center gap-2 border border-edge px-3 py-1.5">
              <span className="node-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="meta-label text-dim">{site.status}</span>
            </span>
            <span className="meta-label text-faint">
              {site.location} - {site.timezone}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-8 text-[clamp(3.4rem,11vw,8rem)] font-bold leading-[0.92] tracking-[-0.03em]"
          >
            VO HUY
          </motion.h1>

          <motion.p
            variants={item}
            className="meta-label mt-5 text-accent"
          >
            Software Engineer
          </motion.p>

          <motion.p
            variants={item}
            className="mt-7 max-w-lg text-lg leading-relaxed text-dim"
          >
            {site.intro}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/#work"
              data-cursor="View"
              className="group inline-flex items-center gap-2 bg-fg px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-base transition-colors hover:bg-accent hover:text-on-accent"
            >
              View Projects
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 border border-edge px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:border-accent hover:text-fg"
            >
              Contact
            </Link>
          </motion.div>
          </motion.div>

          {/* ---------- right: the system — 40-45% hero width, no container, inside grid */}
          <div className="w-full" aria-hidden>
            <SystemField3D />
            {/* discovered connection — drops toward the WISTFY frame */}
            <div className="relative hidden h-16 md:h-20 lg:block">
              <span
                className="absolute top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-accent bg-base"
                style={{ left: "78.8%" }}
              />
              <span
                className="absolute top-1.5 h-full w-px bg-hair"
                style={{ left: "78.8%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* identity system — full-width hero visual */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 0.4, 0.2, 1] }}
        className="mx-auto max-w-6xl px-5 pb-14 md:px-8 md:pb-20"
      >
        <WistfyIdentity />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <Link href="/#about" aria-label="Scroll to about section">
          <ArrowDown size={16} className="text-faint transition-colors hover:text-accent" />
        </Link>
      </motion.div>
    </section>
  );
}
