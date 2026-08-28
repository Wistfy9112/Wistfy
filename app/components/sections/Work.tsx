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

        {/* 12-column editorial — featured is data-driven, not positional */}
        <div className="border-t border-hair">
          {projects.map((project, i) => {
            const isFull = !!project.featured;

            if (isFull) {
              return (
                <Reveal key={project.slug}>
                  <article className="group relative grid gap-8 border-b border-hair py-12 md:py-16 lg:grid-cols-12 lg:gap-6 xl:gap-8 lg:py-24">
                    {/* text row — 12 cols split 7 / 5 — DOM = visual */}
                    <div className="flex flex-col justify-center lg:col-span-7 lg:col-start-1">
                      <div className="meta-label flex items-center gap-3 text-faint">
                        <span className="h-px w-6 bg-accent" aria-hidden />
                        <span className="text-accent">Project {project.index}</span>
                        <span className="text-faint">/</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="mt-4 max-w-[14ch] text-3xl font-semibold leading-[0.98] tracking-tight sm:text-4xl lg:text-5xl">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-dim md:text-base">
                        {project.summary}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center gap-6 lg:col-span-5 lg:col-start-8 lg:pl-2">
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hair pt-6">
                        <div>
                          <dt className="meta-label text-faint">Role</dt>
                          <dd className="mt-1.5 text-sm leading-snug text-fg/90">
                            {project.role}
                          </dd>
                        </div>
                        <div>
                          <dt className="meta-label text-faint">Stack</dt>
                          <dd className="mt-1.5 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-dim">
                            {project.stack.slice(0, 4).join(" · ")}
                          </dd>
                        </div>
                      </dl>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="meta-label inline-flex items-center gap-2 self-start border border-edge px-3 py-2 text-accent transition-colors hover:border-accent hover:bg-accent hover:text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
                      >
                        Read case study
                        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>

                    {/* full-width visual — part of composition, not card */}
                    <div className="lg:col-span-12">
                      <Link
                        href={`/projects/${project.slug}`}
                        aria-label={`Open ${project.title} case study`}
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                      >
                        <div className="relative overflow-hidden border border-hair bg-panel/20 transition-colors duration-500 group-hover:border-edge">
                          <div className="aspect-[16/7] w-full sm:aspect-[16/6] lg:aspect-[21/7]">
                            <ProjectViz kind={project.viz} />
                          </div>
                          <span className="meta-label absolute bottom-2.5 right-3 rounded-[1px] bg-base/80 px-1.5 py-1 text-faint backdrop-blur-sm">
                            FIG.{project.index}
                          </span>
                        </div>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            }

            const flip = i % 2 === 1;
            const vizSpan = i === 3 ? "lg:col-span-6 lg:col-start-7" : flip ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-7 lg:col-start-1";
            const textSpan = i === 3 ? "lg:col-span-6 lg:col-start-1" : flip ? "lg:col-span-5 lg:col-start-1" : "lg:col-span-5 lg:col-start-8";
            const vizAspect = i === 3 ? "aspect-[16/10] lg:aspect-[4/3]" : "aspect-[16/10] sm:aspect-[16/9]";

            // DOM = visual order per breakpoint — no order hack, satisfies WCAG 1.3.2 / 2.4.3
            const TextBlock = (
              <div className={`${textSpan} flex flex-col justify-center ${i === 3 ? "lg:pr-4" : flip ? "lg:pr-2" : "lg:pl-2"}`}>
                <div className="meta-label flex flex-wrap items-center gap-3 text-faint">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-px w-6 bg-accent" aria-hidden />
                    <span className="text-accent">Project {project.index}</span>
                  </span>
                  <span className="text-faint">/</span>
                  <span>{project.year}</span>
                </div>

                <h3 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.98] tracking-tight transition-transform duration-500 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5 sm:text-4xl lg:text-[2.6rem]">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                  >
                    {project.title}
                  </Link>
                </h3>

                <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-dim md:text-[15.5px]">
                  {project.summary}
                </p>

                <dl className="mt-7 grid max-w-[48ch] grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="meta-label text-faint">Role</dt>
                    <dd className="mt-1.5 text-sm leading-snug text-fg/90">{project.role}</dd>
                  </div>
                  <div>
                    <dt className="meta-label text-faint">Stack</dt>
                    <dd className="mt-1.5 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-dim">
                      {project.stack.slice(0, 4).join(" · ")}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/projects/${project.slug}`}
                  className="meta-label mt-8 inline-flex items-center gap-2 self-start border border-hair px-3 py-2 text-accent opacity-90 transition-colors hover:border-accent hover:bg-accent hover:text-on-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent group-focus-within:border-accent group-focus-within:bg-accent group-focus-within:text-on-accent"
                >
                  Read case study
                  <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-within:-translate-y-0.5 group-focus-within:translate-x-0.5" />
                </Link>
              </div>
            );

            const VizBlock = (
              <div className={vizSpan}>
                <Link
                  href={`/projects/${project.slug}`}
                  aria-label={`Open ${project.title} case study`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base"
                >
                  <div className="relative overflow-hidden border border-hair bg-panel/20 transition-colors duration-500 group-hover:border-edge group-focus-within:border-edge">
                    <div className={`${vizAspect} w-full`}>
                      <ProjectViz kind={project.viz} />
                    </div>
                    <span className="meta-label absolute bottom-2.5 right-3 rounded-[1px] bg-base/80 px-1.5 py-1 text-faint backdrop-blur-sm">
                      FIG.{project.index}
                    </span>
                    <span className="absolute left-0 top-0 h-px w-12 bg-accent/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden />
                  </div>
                </Link>
              </div>
            );

            return (
              <Reveal key={project.slug}>
                <article className="group relative grid gap-8 border-b border-hair py-12 md:py-16 lg:grid-cols-12 lg:gap-6 xl:gap-8 lg:py-20">
                  {flip ? (
                    <>
                      {TextBlock}
                      {VizBlock}
                    </>
                  ) : (
                    <>
                      {VizBlock}
                      {TextBlock}
                    </>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
