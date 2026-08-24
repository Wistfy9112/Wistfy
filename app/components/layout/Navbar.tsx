"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/app/components/layout/ThemeToggle";
import { navLinks, site } from "@/app/data/site";
import { useScrollSpy } from "@/app/hooks/useScrollSpy";

const spyIds = navLinks.map((l) => l.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(spyIds);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current
      ?.querySelector<HTMLElement>("a[href]")
      ?.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items =
        menuRef.current?.querySelectorAll<HTMLElement>("a[href]");
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-300 ${
          scrolled ? "border-b border-hair bg-base/85 backdrop-blur-md" : ""
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16 md:px-8"
        >
          <Link href="/#top" className="group flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight">
              VO HUY
            </span>
            <span aria-hidden className="h-3 w-px bg-edge" />
            <span className="meta-label hidden text-faint sm:block">
              Software Engineer
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                      isActive ? "text-fg" : "text-dim hover:text-fg"
                    }`}
                  >
                    {l.label}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-px h-px bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                  </Link>
                </li>
              );
             })}
           </ul>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 border border-edge px-3 py-1.5 md:flex">
              <span className="node-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="meta-label text-dim">Open to work</span>
            </span>
            <ThemeToggle />
            <button
              type="button"
              ref={toggleRef}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span
                className={`h-px w-6 bg-fg transition-transform duration-300 ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-6 bg-fg transition-transform duration-300 ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-base/98 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-2 px-8 pt-20">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-hair py-5"
                  >
                    <span className="meta-label text-accent">
                      0{i + 1}
                    </span>
                    <span className="text-4xl font-semibold tracking-tight group-hover:text-accent">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center justify-between px-8 pb-10"
            >
              <div className="meta-label text-faint">{site.location}</div>
              <a
                href={`mailto:${site.email}`}
                className="meta-label flex items-center gap-1 text-accent"
              >
                Email <ArrowUpRight size={12} />
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
