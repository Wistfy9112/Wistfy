import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import { achievements } from "@/app/data/achievements";

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative scroll-mt-20 border-t border-hair bg-panel/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader
            index="05"
            label="Research & achievements"
            title="Proof beyond products"
          />
        </Reveal>

        <ol className="grid gap-px overflow-hidden border border-hair bg-hair sm:grid-cols-2">
          {achievements.map((a, i) => (
            <li key={a.index} className="bg-base p-7 md:p-8">
              <Reveal delay={(i % 2) * 0.06}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="meta-label text-iris">{a.index}</span>
                  <span className="meta-label text-faint">{a.year}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {a.title}
                </h3>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-dim">
                  {a.detail}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
