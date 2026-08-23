"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import { aboutMeta, aboutParagraphs, timeline } from "@/app/data/profile";

export default function About() {
  const trackRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section id="about" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader index="01" label="About" title="The engineer behind the systems" />
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal>
            <div className="space-y-6 text-base leading-[1.85] text-dim md:text-lg">
              {aboutParagraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <dl className="mt-12 border-t border-hair">
              {aboutMeta.map((m) => (
                <div
                  key={m.k}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hair py-4"
                >
                  <dt className="meta-label text-faint">{m.k}</dt>
                  <dd className="font-mono text-sm text-fg">{m.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-6 flex items-center gap-4">
              <span className="meta-label text-accent">Timeline</span>
              <span className="h-px flex-1 bg-hair" />
            </div>
            <ol ref={trackRef} className="relative space-y-12 pl-8">
              <span
                aria-hidden
                className="absolute bottom-2 left-[3px] top-2 w-px bg-hair"
              />
              <motion.span
                aria-hidden
                style={{ scaleY: reduced ? 1 : lineScale }}
                className="absolute bottom-2 left-[3px] top-2 w-px origin-top bg-accent"
              />
              {timeline.map((t) => (
                <li key={t.year} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-8 top-1.5 h-[7px] w-[7px] rounded-full border border-accent bg-base"
                  />
                  <div className="meta-label text-accent">{t.year}</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    {t.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-dim">
                    {t.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
