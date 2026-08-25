"use client";

import { useEffect, useState } from "react";

/* Theme-aware palette resolved from CSS custom properties so the scene
   restyles live on dark/light toggle. Values are resolved through the
   browser (computed rgb()) rather than parsed by hand — this keeps
   oklch/hex/rgba sources interchangeable. */

export type RGB = [number, number, number, number];

export type Palette = {
  bg: string;
  fg: string;
  accent: string;
  ink: string;
  lineStrong: string;
  lineMid: string;
  white: string;
  graphite: string;
  sphere: string;
  sphereRim: string;
};

function readVar(name: string): RGB {
  if (typeof document === "undefined") return [0, 0, 0, 1];
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = `var(${name})`;
  document.documentElement.appendChild(probe);
  const raw = getComputedStyle(probe).color;
  probe.remove();
  const m = raw.match(
    /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\)/i,
  );
  if (!m) return [0, 0, 0, 1];
  return [
    Number(m[1]),
    Number(m[2]),
    Number(m[3]),
    m[4] === undefined ? 1 : Number(m[4]),
  ];
}

const rgbStr = ([r, g, b]: RGB) =>
  `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
  1,
];

export function buildPalette(): Palette {
  const bg = readVar("--bg");
  const fg = readVar("--fg");
  const ac = readVar("--accent");
  const dark = bg[0] < 128;
  return {
    bg: rgbStr(bg),
    fg: rgbStr(fg),
    accent: rgbStr(ac),
    ink: rgbStr(mix(fg, bg, 0.12)),
    lineStrong: rgbStr(mix(fg, bg, 0.52)),
    lineMid: rgbStr(mix(fg, bg, 0.74)),
    white: dark ? "rgb(236,238,243)" : "rgb(48,50,56)",
    graphite: rgbStr(mix(fg, bg, 0.22)),
    /* pearl body in light mode, dark glass in dark mode */
    sphere: dark ? "rgb(31,33,38)" : "rgb(226,229,234)",
    sphereRim: dark ? "rgb(19,21,25)" : "rgb(198,202,209)",
  };
}

export function usePalette(): Palette {
  const [pal, setPal] = useState<Palette>(buildPalette);
  useEffect(() => {
    const el = document.documentElement;
    const ob = new MutationObserver(() => setPal(buildPalette()));
    ob.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => ob.disconnect();
  }, []);
  return pal;
}
