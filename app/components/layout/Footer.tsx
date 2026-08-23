import Link from "next/link";
import { site } from "@/app/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-hair">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="meta-label text-faint">
          © {new Date().getFullYear()} {site.name} — {site.role}
        </div>
        <div className="meta-label text-faint">{site.tagline}</div>
        <Link href="/#top" className="meta-label link-quiet">
          Back to top ↑
        </Link>
      </div>
    </footer>
  );
}
