import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import Tag from "@/app/components/ui/Tag";
import { experience } from "@/app/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader index="04" label="Experience" title="Where the work happened" />
        </Reveal>

        <ol className="relative border-t border-hair">
          {experience.map((e, i) => (
            <li key={e.year}>
              <Reveal
                delay={i * 0.05}
                className="group grid gap-x-10 gap-y-3 border-b border-hair py-9 transition-colors hover:bg-panel/40 md:grid-cols-[180px_1fr_220px] md:py-11"
              >
                <div className="meta-label pt-1 text-accent">{e.year}</div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {e.role}
                  </h3>
                  <div className="meta-label mt-1.5 text-faint">{e.place}</div>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-dim">
                    {e.body}
                  </p>
                </div>
                <ul className="flex flex-wrap content-start gap-2 md:justify-end">
                  {e.tech.map((t) => (
                    <li key={t}>
                      <Tag>{t}</Tag>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
