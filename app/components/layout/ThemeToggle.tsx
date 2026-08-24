"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [light, setLight] = useState<boolean | null>(null);

  function toggle() {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    setLight(next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        light === null
          ? "Toggle theme"
          : light
            ? "Switch to dark theme"
            : "Switch to light theme"
      }
      title="Toggle theme"
      className="flex h-9 w-9 items-center justify-center border border-edge text-dim transition-colors hover:border-accent hover:text-fg"
    >
      <Sun size={14} className="theme-icon-sun" />
      <Moon size={14} className="theme-icon-moon" />
    </button>
  );
}
