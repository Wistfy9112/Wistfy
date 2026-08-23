import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import { stackCategories, stackLayers } from "@/app/data/skills";

function Connector() {
  return (
    <div aria-hidden className="flex justify-center py-1">
      <span className="relative block h-5 w-px bg-edge">
        <span className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-b border-r border-edge" />
      </span>
    </div>
  );
}

export default function Stack() {
  return (
    <section
      id="stack"
      className="relative scroll-mt-20 border-t border-hair bg-panel/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader
            index="03"
            label="Engineering stack"
            title="One system, layered by design"
            lede="Technology organized the way I use it — as a request flowing from interface to storage, with each layer owning a single responsibility."
          />
        </Reveal>

        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <ol aria-label="Request flow architecture">
              {stackLayers.map((layer, i) => {
                const last = i === stackLayers.length - 1;
                return (
                  <li key={layer.id}>
                    <div className="flex flex-col gap-3 border border-edge bg-base/70 p-5 sm:flex-row sm:items-center md:p-6">
                      <div className="sm:w-40">
                        <div className="font-semibold tracking-tight">
                          {layer.label}
                        </div>
                        <div className="meta-label mt-1 text-faint">
                          {layer.note}
                        </div>
                      </div>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2 border-edge sm:border-l sm:pl-5">
                        {layer.items.map((item) => (
                          <li
                            key={item}
                            className="font-mono text-xs tracking-[0.04em] text-dim"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {!last ? <Connector /> : null}
                  </li>
                );
              })}
            </ol>
            <p className="meta-label mt-6 leading-relaxed text-faint">
              Request path: UI → contract → domain → state. Every project on
              this site follows this spine.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="grid gap-x-10 sm:grid-cols-2">
              {stackCategories.map((cat) => (
                <div key={cat.title} className="border-t border-hair py-5">
                  <dt className="meta-label text-accent">{cat.title}</dt>
                  <dd>
                    <ul className="mt-3 space-y-1.5">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="font-mono text-sm text-dim transition-colors hover:text-fg"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
