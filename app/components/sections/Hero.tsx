"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import SystemDiagram from "@/app/components/viz/SystemDiagram";
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
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 pb-20 pt-32 md:px-8 md:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8">
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
              {site.location} · {site.timezone}
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
              className="group inline-flex items-center gap-2 bg-fg px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-base transition-colors hover:bg-accent hover:text-white"
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

          <motion.dl
            variants={item}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-hair pt-6"
          >
            {[
              ["Focus", "Systems"],
              ["Base", site.location],
              ["Status", "Open"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="meta-label text-faint">{k}</dt>
                <dd className="mt-1.5 font-mono text-sm text-fg">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 0.4, 0.2, 1] }}
          className="hidden justify-center lg:flex"
        >
          <SystemDiagram />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <Link href="/#about" aria-label="Scroll to about section">
          <ArrowDown size={16} className="text-faint transition-colors hover:text-accent" />
        </Link>
      </motion.div>
    </section>
  );
}
