import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import { site } from "@/app/data/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-20 border-t border-hair py-24 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader index="07" label="Contact" />
          <h2 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
            Let&apos;s build something{" "}
            <span className="text-accent">useful</span>.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-dim">
            Open to engineering roles, collaborations and ambitious systems.
            The fastest way to reach me is email — I answer within a day.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <a
            href={`mailto:${site.email}?subject=Hello%20Huy`}
            data-cursor="Send"
            className="group mt-12 inline-flex items-center gap-3 border border-edge bg-panel/60 px-8 py-5 font-mono text-sm uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:bg-accent hover:text-white"
          >
            Start a conversation
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </Reveal>

        <Reveal delay={0.14}>
          <dl className="mt-20 grid grid-cols-1 gap-px overflow-hidden border border-hair bg-hair sm:grid-cols-3">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-base px-6 py-6 transition-colors hover:bg-panel"
              >
                <dt className="meta-label flex items-center justify-between text-accent">
                  {s.label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </dt>
                <dd className="mt-2 font-mono text-sm text-dim">{s.handle}</dd>
              </a>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
