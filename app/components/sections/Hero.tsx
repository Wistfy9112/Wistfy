"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import WistfyIdentity from "@/app/components/viz/WistfyIdentity";
import SystemField3D from "@/app/components/viz/SystemField3D";
import { site } from "@/app/data/site";

/*
  Spatial thesis — cold instrument, now balanced
  Primary path: VO HUY → role/status → intro proof → CTA → ambient field (support) → WISTFY lockup (tertiary)
  Left 1.08fr carries decision (name/claim/action); right 0.92fr carries atmosphere. Dense left, sparse right.
  Tight gaps inside header (name+role 10px), generous between claim and action (32px), generous to lockup (40-48px).
  Mobile: person → CTA stays in first viewport, field capped 340-440px so lockup doesn't push below fold.
*/

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.22, 0.4, 0.2, 1] as const },
  },
} as const;

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-visible">
      {/* --- primary hero: person + ambient system --- */}
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-28 md:px-8 md:pb-8 md:pt-36">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:gap-10 xl:gap-12">
          {/* ---------- left: the person — dense, decision-first ---------- */}
          <motion.div variants={container} initial="hidden" animate="show" className="min-w-0">
            {/* status line — quiet, 9-11px mono, grouped by proximity */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center gap-x-4 gap-y-2.5"
            >
              <span className="inline-flex items-center gap-2 border border-edge px-3 py-1.5">
                <span className="node-pulse h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="meta-label text-dim">{site.status}</span>
              </span>
              <span className="meta-label text-faint">
                {site.location} · {site.timezone}
              </span>
            </motion.div>

            {/* name — display, tight to role (tighter than before: mt-8→mt-7, role mt-5→mt-2.5) */}
            <motion.h1
              variants={item}
              className="mt-7 max-w-[9ch] text-[clamp(3rem,10.2vw,6.5rem)] font-bold leading-[0.90] tracking-[-0.035em] lg:text-[clamp(4rem,6vw,6.75rem)]"
            >
              VO HUY
            </motion.h1>

            <motion.p
              variants={item}
              className="meta-label mt-2.5 text-accent"
            >
              Software Engineer
            </motion.p>

            {/* intro — measure 52ch, generous separation from header, tight to CTA */}
            <motion.p
              variants={item}
              className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-dim md:text-lg"
            >
              {site.intro}
            </motion.p>

            {/* CTAs — own group, generous top gap, 44px touch targets */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link
                href="/#work"
                data-cursor="View"
                className="group inline-flex min-h-[44px] items-center gap-2 bg-fg px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-base transition-colors hover:bg-accent hover:text-on-accent"
              >
                View Projects
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex min-h-[44px] items-center gap-2 border border-edge px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:border-accent hover:text-fg"
              >
                Contact
              </Link>
            </motion.div>

            {/* micro-proof — quiets decision, groups with CTA (proximity) */}
            <motion.p
              variants={item}
              className="mt-4 font-mono text-[11px] tracking-[0.12em] text-faint"
            >
              Open to product &amp; system roles · Remote-friendly
            </motion.p>
          </motion.div>

          {/* ---------- right: the system — sparse, ambient, height-capped ---------- */}
          <div className="relative order-2 min-w-0 lg:order-none lg:pl-2" aria-hidden>
            {/* height now owned by Hero (layout), not by the viz itself — caps visual weight 70%→42% */}
            <div className="relative h-[340px] max-h-[52vh] w-full overflow-visible sm:h-[400px] md:h-[440px] lg:h-[500px] lg:max-h-[54vh] xl:h-[540px]">
              <SystemField3D />
            </div>
            {/* discovered hinge — shorter, subtler, ties field to lockup without competing */}
            <div className="relative hidden h-10 lg:block">
              <span
                className="absolute top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-accent bg-base"
                style={{ left: "72%" }}
              />
              <span
                className="absolute top-1.5 h-full w-px bg-hair"
                style={{ left: "72%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- identity lockup — tertiary, not second hero ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.42, ease: [0.22, 0.4, 0.2, 1] }}
        className="mx-auto max-w-6xl px-5 pb-10 md:px-8 md:pb-14"
      >
        <div className="border-t border-hair pt-8 md:pt-10">
          {/* narrower measure (860 vs 1000) + slight de-emphasis (opacity) = lockup, not hero */}
          <div className="mx-auto max-w-[860px] opacity-[0.96]">
            <WistfyIdentity />
          </div>
          <p className="mx-auto mt-4 max-w-[860px] text-center font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            WISTFY — system imprint · constructive geometry · identity / 01
          </p>
        </div>
      </motion.div>

      {/* scroll affordance — only on large where hero fits above fold */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <Link
          href="/#about"
          aria-label="Scroll to about section"
          className="rounded-full border border-transparent p-2 text-faint transition-colors hover:border-hair hover:text-accent"
        >
          <ArrowDown size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
