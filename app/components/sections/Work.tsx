import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/app/components/ui/SectionHeader";
import Reveal from "@/app/components/ui/Reveal";
import ProjectViz from "@/app/components/viz/ProjectViz";
import { projects } from "@/app/data/projects";

export default function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeader
            index="02"
            label="Selected work"
            title="Systems built, shipped and measured"
            lede="Four projects that show how I work end to end — problem, architecture, execution and honest results."
          />
        </Reveal>

        <div className="border-t border-hair">
          {projects.map((project, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  data-cursor="Open"
                  className="group relative grid gap-10 border-b border-hair py-14 transition-colors md:py-20 lg:grid-cols-12 lg:gap-12"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-2 font-mono text-[88px] font-bold leading-none tracking-tighter text-fg/[0.04] transition-colors duration-500 group-hover:text-accent/[0.08] md:text-[130px]"
                    style={flip ? { right: 0 } : { left: 0 }}
                  >
                    {project.index}
                  </span>

                  <div
                    className={`flex flex-col justify-center lg:col-span-7 ${
                      flip ? "lg:order-2 lg:col-start-6" : ""
                    }`}
                  >
                    <div className="meta-label flex items-center gap-4 text-faint">
                      <span className="text-accent">Project {project.index}</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 sm:text-4xl md:text-5xl">
                      {project.title}
                    </h3>

                    <p className="mt-5 max-w-lg leading-relaxed text-dim">
                      {project.summary}
                    </p>

                    <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                      <div>
                        <dt className="meta-label text-faint">Role</dt>
                        <dd className="mt-1.5 text-sm leading-snug text-fg/90">
                          {project.role.split("—")[0]}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="meta-label text-faint">Stack</dt>
                        <dd className="mt-1.5 font-mono text-xs leading-relaxed text-dim">
                          {project.stack.slice(0, 4).join(" · ")}
                        </dd>
                      </div>
                    </dl>

                    <span className="meta-label mt-9 inline-flex items-center gap-2 text-accent opacity-80 transition-opacity group-hover:opacity-100">
                      Read case study
                      <ArrowUpRight
                        size={13}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>

                  <div
                    className={`lg:col-span-5 ${
                      flip ? "lg:order-1 lg:col-start-1" : ""
                    }`}
                  >
                    <div className="relative overflow-hidden border border-hair bg-panel/50 p-4 transition-colors duration-500 group-hover:border-edge md:p-5">
                      <div className="aspect-[400/240] w-full">
                        <ProjectViz kind={project.viz} />
                      </div>
                      <span className="meta-label absolute bottom-3 right-4 text-faint">
                        FIG.{project.index}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
