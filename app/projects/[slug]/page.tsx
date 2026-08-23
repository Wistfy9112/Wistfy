import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import GridBackdrop from "@/app/components/layout/GridBackdrop";
import ScrollProgress from "@/app/components/layout/ScrollProgress";
import CursorRing from "@/app/components/layout/CursorRing";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Reveal from "@/app/components/ui/Reveal";
import Tag from "@/app/components/ui/Tag";
import ArchDiagram from "@/app/components/viz/ArchDiagram";
import ProjectViz from "@/app/components/viz/ProjectViz";
import { projects } from "@/app/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Not found — Vo Huy" };
  return {
    title: `${project.title} — Vo Huy`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Vo Huy`,
      description: project.summary,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: project.title },
  };
}

function Block({
  no,
  label,
  children,
}: {
  no: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="border-t border-hair py-12 md:py-16">
        <div className="mb-8 flex items-center gap-4">
          <span className="meta-label text-accent">{label}</span>
          <span className="meta-label text-faint">/ {no}</span>
          <span className="h-px flex-1 bg-hair" />
        </div>
        {children}
      </section>
    </Reveal>
  );
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <>
      <GridBackdrop />
      <ScrollProgress />
      <CursorRing />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <article className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
          <Link
            href="/#work"
            className="meta-label inline-flex items-center gap-2 text-dim transition-colors hover:text-accent"
          >
            <ArrowLeft size={13} /> All work
          </Link>

          <header className="mt-10">
            <div className="meta-label flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-accent">Project / {project.index}</span>
              <span className="text-faint">{project.year}</span>
              <span className="text-faint">{project.role}</span>
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.0] tracking-tight sm:text-6xl md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-dim">
              {project.summary}
            </p>
            <ul className="mt-9 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s}>
                  <Tag>{s}</Tag>
                </li>
              ))}
            </ul>
          </header>

          <Block no="01" label="Problem">
            <p className="max-w-3xl text-base leading-[1.85] text-dim md:text-lg">
              {project.problem}
            </p>
          </Block>

          <Block no="02" label="Solution">
            <p className="max-w-3xl text-base leading-[1.85] text-dim md:text-lg">
              {project.solution}
            </p>
          </Block>

          <Block no="03" label="Architecture">
            <ArchDiagram architecture={project.architecture} />
          </Block>

          <Block no="04" label="Implementation">
            <ol className="max-w-3xl space-y-5">
              {project.implementation.map((step, i) => (
                <li key={i} className="flex gap-5 border-b border-hair pb-5 last:border-0">
                  <span className="meta-label pt-1 text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-dim md:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Block>

          <Block no="05" label="Challenges">
            <div className="grid gap-px overflow-hidden border border-hair bg-hair md:grid-cols-3">
              {project.challenges.map((c) => (
                <div key={c.title} className="bg-base p-6 md:p-7">
                  <h3 className="font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block no="06" label="Results">
            <dl className="grid gap-px overflow-hidden border border-hair bg-hair sm:grid-cols-3">
              {project.results.map((r) => (
                <div key={r.label} className="bg-base p-6 md:p-7">
                  <dd className="text-3xl font-semibold tracking-tight text-mint md:text-4xl">
                    {r.metric}
                  </dd>
                  <dt className="meta-label mt-2 text-dim">{r.label}</dt>
                </div>
              ))}
            </dl>
          </Block>

          <Block no="07" label="Gallery">
            <div className="grid gap-6 md:grid-cols-2">
              {project.gallery.map((fig, i) => (
                <figure key={i} className="border border-hair bg-panel/50 p-4 md:p-5">
                  <div className="aspect-[400/240] w-full">
                    <ProjectViz kind={fig.kind} />
                  </div>
                  <figcaption className="meta-label mt-4 text-faint">
                    FIG.{String(i + 1).padStart(2, "0")} — {fig.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Block>

          <Block no="08" label="Lessons learned">
            <blockquote className="max-w-3xl border-l-2 border-accent pl-6 text-xl italic leading-relaxed text-fg md:text-2xl">
              {project.lessons}
            </blockquote>

            <ul className="mt-10 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 border border-edge px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:border-accent hover:text-fg"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Block>

          <Reveal>
            <Link
              href={`/projects/${next.slug}`}
              data-cursor="Next"
              className="group mt-8 flex items-baseline justify-between gap-6 border-t border-hair py-10 transition-colors hover:bg-panel/40"
            >
              <div>
                <span className="meta-label text-faint">Next project</span>
                <div className="mt-2 text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-3xl">
                  {next.title}
                </div>
              </div>
              <ArrowUpRight
                size={22}
                className="shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
              />
            </Link>
          </Reveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
