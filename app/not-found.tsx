import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="meta-label text-accent">Error / 404</div>
      <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
        Page out of bounds
      </h1>
      <p className="max-w-md text-dim">
        The route you requested does not exist in this system.
      </p>
      <Link
        href="/"
        className="mt-4 border border-edge px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:border-accent hover:text-fg"
      >
        Return home
      </Link>
    </main>
  );
}
