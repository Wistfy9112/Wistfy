"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark or light theme"
      title="Toggle theme"
      className="flex h-9 w-9 items-center justify-center border border-edge text-dim transition-colors hover:border-accent hover:text-fg"
    >
      <Sun size={14} className="theme-icon-sun" />
      <Moon size={14} className="theme-icon-moon" />
    </button>
  );
}
