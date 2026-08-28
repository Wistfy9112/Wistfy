---
name: Wistfy — Portfolio for Vo Huy
description: Engineering systems, products and ideas — portfolio that proves reliable systems thinking through shipped work.
colors:
  signal-blue: "#4d8dff"
  signal-blue-light: "#2f5fe8"
  amber-signal: "#e0915a"
  mint-signal: "#b7e05a"
  iris-signal: "#9b8afb"
  graphite-base: "#0a0a0b"
  graphite-panel: "#101013"
  graphite-raised: "#16161a"
  graphite-fg: "#f5f5f5"
  graphite-dim: "#8a8a8a"
  graphite-faint: "#7d7d86"
  graphite-base-light: "#fafafa"
  graphite-panel-light: "#ffffff"
  graphite-fg-light: "#17171a"
  hair: "rgba(255, 255, 255, 0.07)"
  edge: "rgba(255, 255, 255, 0.14)"
  grid-line: "rgba(255, 255, 255, 0.024)"
  glow: "rgba(77, 141, 255, 0.07)"
  viz-s1: "rgba(255, 255, 255, 0.17)"
  viz-s2: "rgba(255, 255, 255, 0.08)"
  viz-s3: "rgba(255, 255, 255, 0.05)"
  viz-dot: "rgba(255, 255, 255, 0.32)"
  viz-text: "rgba(150, 150, 155, 0.85)"
typography:
  display:
    fontFamily: "Geist, var(--font-geist-sans), sans-serif"
    fontSize: "clamp(3rem, 10.2vw, 6.5rem)"
    fontWeight: 700
    lineHeight: 0.90
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, var(--font-geist-sans), sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, var(--font-geist-sans), sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist, var(--font-geist-sans), sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, var(--font-jetbrains-mono), monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  sm: "2px"
  md: "4px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.graphite-fg}"
    textColor: "{colors.graphite-base}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.graphite-base}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-dim}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-dim}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
  card:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.graphite-fg}"
    rounded: "{rounded.sm}"
    padding: "20px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-dim}"
    typography: "{typography.label}"
    padding: "8px 16px"
---

# Design System: Wistfy — Portfolio for Vo Huy

## Overview

**Creative North Star: "The Precision Field"**

The portfolio is an instrument, not a marketing page. A graphite field holds a calibrated system: an 88px construction grid (`app/globals.css:138`), thin engineering linework, node constellations, and a volumetric core that only glows when it has something to say. The atmosphere is distinct without being loud — every dot, bracket, and orbital line earns its place by proving how Vo Huy thinks: whole-system, measured, and deliberately constrained.

Philosophy: **Make complexity feel intentional, not complicated. Make technology feel sophisticated, not flashy.** Distinct, intelligent, and restrained. At rest the system is flat, quiet, and tonal. In motion it becomes spatial — 3D geometry, perspective, translucency, and soft Signal Blue illumination reveal depth. Complexity is never deposited as decoration; sensor values, construction measurements, and orbital mechanics are always tied to the content's meaning.

The world rejects card-masonry portfolios, hero-metric stats bands, gradient text, and glassy blur-for-blur. It keeps two typefaces, one construction grid, and one signal color that appears on ≤10% of any viewport.

**Key Characteristics:**
- Graphite carries the system; Signal Blue reveals the system
- 88px instrument grid is datum for all construction geometry
- Flat and quiet at rest. Spatial and alive in motion
- Mono as calibrated instrument, Sans as confident human voice
- Zero-stock-imagery — all visuals are generative code

## Colors

Quiet graphite spectrum field punctuated by a single electric signal, with three occasional contextual signals.

### Primary
- **Signal Blue** (#4d8dff / light #2f5fe8 `globals.css:17,49`): Primary system signal — used only for live status (node pulse `globals.css:164`, active timelines, scroll progress, hover border `hover:border-accent`, focus ring `globals.css:119`), orbital accent, and core glow. Its rarity is the point.

### Secondary
- **Amber Signal** (#e0915a / light #b06a2e `globals.css:18,50`): Warning / attention / high-temperature data state. Rare.
- **Mint Signal** (#b7e05a / light #5c8f1d `globals.css:19,51`): Positive / success / growing data state. Rare.
- **Iris Signal** (#9b8afb / light #6f52e0 `globals.css:20,52`): Analytical / interactive / secondary accent. Rare.

### Tertiary
- Tertiary is not an independent hue in this system — the three secondary signals above fill the tertiary role contextually and are never used together.

### Neutral
- **Graphite Base** (#0a0a0b `globals.css:8` / light #fafafa `globals.css:40`): Body background. `color-scheme: dark` default.
- **Graphite Panel** (#101013 `globals.css:9` / #ffffff): Elevated surface (cards `bg-panel`, Work viz `border bg-panel/50`).
- **Graphite Raised** (#16161a `globals.css:10` / #f0f0ee): Highest tonal step for nested emphasis.
- **Graphite Foreground** (#f5f5f5 `globals.css:11` / #17171a `globals.css:43`): Primary text `text-fg`.
- **Graphite Dim** (#8a8a8a `globals.css:12` / #55555c `globals.css:44`): Body copy, quiet links `link-quiet`. Meets contrast only at large/secondary sizes — check before use on small mono.
- **Graphite Faint** (#7d7d86 `globals.css:13` / #6e6e78): Metadata, dividers, chrome text `text-faint`, `viz-text` base.
- **Hair** (rgba(255,255,255,0.07) `globals.css:14` / 0.09 light): 1px subtle dividers `border-hair` — most borders in About/Work/Stack.
- **Edge** (rgba(255,255,255,0.14) `globals.css:15` / 0.18 light): Stronger 1px border for instrument frames and control edges `border-edge`.
- **Grid Line** (rgba(255,255,255,0.024) `globals.css:23` / 0.038 light): Construction grid stroke `bg-grid`. Two-axis linear-gradient tiled 88px.
- **Glow** (rgba(77,141,255,0.07) `globals.css:24` / 0.05 light): Outer field glow, core sprites — never as page background wash.
- **Viz Neutrals** (viz-s1 0.17, viz-s2 0.08, viz-s3 0.05, viz-dot 0.32, viz-text 0.85 `globals.css:26-31`): Engineering linework hierarchy inside `WistfyIdentity` and `CoreScene`. Light variants remapped `globals.css:58-63`.

### Named Rules
**The Signal Rarity Rule.** Signal Blue appears on ≤10% of any viewport at rest. If you can remove the blue and still understand the section, remove it. Amber/Mint/Iris never co-occur decoratively — one contextual signal per component.

**The Graphite Depth Rule.** Depth comes from tonal steps Base → Panel → Raised and hair→edge border strength, not from shadow. If you need depth and have used glow, you have misapplied glow.

## Typography

**Display Font:** Geist (via `--font-geist-sans` `layout.tsx:6`) with system sans fallback
**Body Font:** Geist (same stack)
**Label/Mono Font:** JetBrains Mono (via `--font-jetbrains-mono` `layout.tsx:11`) — with monospace fallback

**Character:** Confident & measured. Geist speaks to the person; JetBrains Mono reveals the system. Display is bold but never aggressive (-0.035em), body is generous (1.7-1.85) on 52-75ch measures, mono is calibrated instrumentation (11px/0.18em uppercase) for metadata, coordinates, and system states. Hierarchy is built by size *and* tone (fg → dim → faint), not size alone.

### Hierarchy
- **Display** (700, clamp 3rem→6.5rem, 0.90, -0.035em `Hero.tsx:46`): Hero name `VO HUY` only. One per page.
- **Headline** (600, 2.25rem→3.75rem / sm:text-5xl md:text-6xl, 1.04, -0.02em `SectionHeader.tsx:22`): Section headlines `Systems built, shipped and measured`. Max ~22ch.
- **Title** (600, 1.875rem→3rem, 1.1, -0.015em `Work.tsx:49`): Project titles, timeline titles `About.tsx:72`. Max ~28ch.
- **Body** (400, 17px md:18px, 1.7-1.85, 65-75ch `About.tsx:31`, `Hero.tsx:60` max-w 52ch): Narrative copy `text-dim` on graphite base.
- **Label** (400, 11px, 1.2, 0.18em uppercase `globals.css:127` `.meta-label`): The instrument layer — status pills, Role/Stack captions, Fig numbers, timeline years, coordinates `SYS.FIELD`. Always mono, always uppercase.

### Named Rules
**The 10% Uppercase Rule.** Uppercase mono is only for labels ≤28 characters. Never set a sentence or lede in `meta-label`.

**The Measure Rule.** Body never exceeds 75ch; narrative sections cap at 52-65ch (`Hero.tsx:60`, `About.tsx:31`). Wider is not more readable — it's drift.

## Layout

**Spatial model:** Editorial-technical. Max-width container `max-w-6xl` centered, gutters `px-5 md:px-8` (`Hero.tsx:27`, `Work.tsx:11`). Grid is `88px` construction datum (bg-grid `88px 88px` `globals.css:138`) — the same unit drives spacecraft geometry in `WistfyIdentity.tsx:22` `GRID_PX`.

**Density & rhythm:** Dense-left / sparse-right hero (`1.08fr / 0.92fr` `Hero.tsx:28`). Global vertical rhythm is generous section padding `py-24 md:py-32` with tight intra-group gaps (name→role `mt-2.5`, header→lede `mt-6`, CTA `mt-8 gap-3.5`) and soft separation before tertiary lockups (`border-t border-hair pt-8`). Spacing scale documented in frontmatter is 4px-based; 8px-only was never sufficient.

**Responsive behavior:** Hero collapses 2→1 column; field owned by Hero (`h-[340]→540 max-h-[52vh]`), not by viz, so viz never dominates. Sections use 12-col or `1fr/1fr` at `lg` (`Work.tsx:29 lg:grid-cols-12`, `About.tsx:29 lg:grid-cols-2`). Fixed nav `h-14 md:h-16` with `scroll-mt-20` offset for anchors. ScrollProgress is `fixed z-[60]`, backdrop grid is `fixed inset-0 z-0`. Content is `z-10`.

**Container strategy:** Components are container-unaware primitives with parent-owned spacing (`gap` over child margins where siblings relate). Reusable density is expressed via normal responsive classes, not container queries (no container-aware library needed).

## Elevation & Depth

Flat and quiet at rest. Spatial and alive in motion.

Depth is tonal (Base #0a0a0b → Panel #101013 → Raised #16161a) plus hair/edge border weight (0.07→0.14) plus translucency (`bg-panel/40` in Stack `Stack.tsx:18`). Traditional drop shadows are not part of the vocabulary.

**Depth channel:** 3D perspective (FOV 35 `CoreScene.tsx:870`, fog `8.8→15.2` `CoreScene.tsx:877`, orbiting geodesic wireframes, and soft Signal Blue sprite glow `CoreScene.tsx:494`) provides genuine spatial depth where the layout needs it. Interactive elevation is a restrained Signal Blue glow or `hover:border-edge` / `hover:bg-accent` that appears on state, not at rest.

**Scroll-driven elevation:** About timeline's vertical accent line scales with `scrollYProgress` spring (`About.tsx:15-64`) — the only authored depth moment per section.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest. Glow, brightness, or elevated tone appears only as response to hover, focus, active, or scroll-driven state. No persistent card shadows.

**The One Glow Rule.** Only one Signal Blue glow source per viewport at rest (core or active node). If two elements would glow, demote one to `viz-s2` until interaction promotes it.

## Shapes

**Corner language:** Minimal, machined. System radius is `2px` (`rounded.sm`) for focus rings `globals.css:119-122`, thumb `9999px` for dots/pills. Cards, panels, and buttons are effectively square (`rounded sm` or `rounded-none`); hero connectors use `rounded-full` only for the 1.5px status dot. No large `lg/xl` rounding anywhere — the world is not soft.

**Borders & edges:** 1px hair (`0.07`) for subtle division (Work item borders, About definition lines, `Stack` connectors), 1px edge (`0.14`) for instrument frames (`WistfyIdentity` viewport `WistfyIdentity.tsx:328`, Stack layer frames `Stack.tsx:38`). `non-scaling-stroke` (`vectorEffect`) keeps linework hairline at any scale `WistfyIdentity.tsx:56`.

**Clipping & geometry:** No organic masks. Geometry is constructive (W is a triangulated truss `WistfyIdentity.tsx:211`, sphere is geodesic `CoreScene.tsx:296,317`). Crosshair/chevron terminators (`WistfyIdentity.tsx:330`, `Stack.tsx:9`) are the only recurring flourish.

## Components

### Buttons
**Character:** Instrument — precise, confident, machined (0-2px radius, mono 11-12px).

- **Shape:** Square with soft 2px focus, no large radius. `rounded: sm`.
- **Primary:** `bg-fg` (`#f5f5f5`) `text-base` (`#0a0a0b`) `px-6 py-3.5` `tracking-[0.18em]` `meta-label` with `ArrowUpRight` micro-translation (`Hero.tsx:69` `group-hover:-translate-y-0.5`). Min touch 44px.
- **Hover / Focus:** `hover:bg-accent hover:text-on-accent` (`#4d8dff` / `#060607`). Focus ring `2px solid accent offset 3px` `globals.css:119`. No shadow lift.
- **Secondary:** Transparent `border border-edge` `text-dim` `px-6 py-3.5` same tracking. Hover → `border-accent text-fg`.
- **Tertiary / Quiet link:** `link-quiet` `text-dim → text-fg 0.25s` with no background.

### Chips
Not used. Tags fill this role.

### Tags
**Character:** Calibration mark — small chip with edge border.

- **Style:** Transparent `border border-edge` `px-2.5 py-1` `font-mono text-[11px] tracking-[0.08em] text-dim` (`Tag.tsx:7`). Top-flow grouping `flex flex-wrap gap-1.5` on cards.
- **State:** Static labels only (stack items `Skills`, `Work.tsx:67` `Stack · Frontend`). No selected/unselected.

### Cards / Containers
**Character:** Tonal panel with edge — flat without lift.

- **Corner:** 2px `rounded: sm` (implicit) — visually square.
- **Background:** `bg-panel/50` `border border-hair` resting (`Work.tsx:86`), `group-hover:border-edge` on interaction. Stack layer frame `border-edge bg-base/70 p-5 md:p-6` (`Stack.tsx:38`).
- **Shadow:** None. Depth via Panel vs Base and border weight only.
- **Border:** Always 1px hair or edge; no thick accent `border-l-4`.
- **Internal Padding:** `p-4 md:p-5` (viz cells `Work.tsx:86`), `p-5 md:p-6` (layers `Stack.tsx:38`), `py-4` (definition rows `About.tsx:41`).

### Inputs / Fields
No native inputs in current portfolio outside `Contact` mailto links. Pattern is inferred: `border border-edge bg-base`, mono label `meta-label text-faint` above, focus `outline 2px accent` per globals, error would use Amber Signal. Do not invent glass/rounded inputs.

### Navigation
**Primary top bar** (`Navbar.tsx:68` `fixed z-[70] h-14 md:h-16 max-w-6xl px-5 md:px-8`): Logo `VO HUY + Software Engineer` (`Navbar.tsx:76`), nav links `hidden md:flex gap-1` mono `text-xs tracking-[0.18em] text-dim → hover:text-fg` with active underline `motion.span layoutId="nav-active" h-px bg-accent` (`Navbar.tsx:100`). Scroll state adds `border-b border-hair bg-base/85 backdrop-blur-md` after 16px. Mobile drawer `fixed inset-0 z-[60] bg-base/98 backdrop-blur-lg` with numbered mono items (`Navbar.tsx:142`).

### Signature Components

**WistfyIdentity (`app/components/viz/WistfyIdentity.tsx`) — Constructive wordmark:** One square W truss + ISTFY wire letters on shared baseline/grid, with `GRID_PX=88` datum, non-scaling strokes, precision nodes (rings/feet/dots), dimension brackets `font-size 8.5-11px`, and two ellipses dash `1 9` `1 10`. Parallax via `useSpring` on layers. Delay-stage build `T.frame 0 → chrome 1.45`.

**SystemField3D (`app/components/viz/SystemField3D.tsx` + `system/CoreScene.tsx`) — Volumetric field:** `HERO_SPHERE_R 1.36` three orbits (`0.58/0.24/0.18` opacities), fibonacci sphere 980 + inner 180 + dust 95 points, geodesic cages `subdivide 1/0`, graticule lat/lon minimal 3+3, core glow sprites `radialTexture` and additive blending, fog `8.8→15.2`, DPR capped `[1,1.5]`. HUD chrome is pointer-events-none mono `9px/0.2em` `SYS.FIELD / CORE ACTIVE / NODES:84` with leader lines — decorative, hidden from AT aside from `role=img` aria-label.

**SectionHeader (`ui/SectionHeader.tsx`) — Index capsule:** `gap-4` label + faint index + `h-px flex-1 bg-hair` rule, title `mt-8 max-w-3xl text-4xl/6xl`, lede `mt-6 max-w-2xl text-dim`. Bottom margin `mb-14 md:mb-20`.

**Reveal (`ui/Reveal.tsx`) — The one authored motion:** Single `framer-motion` entrance per section (y + opacity, `[0.22,0.4,0.2,1]`). Not repeated per-card stagger except hero `stagger 0.08`.

## Do's and Don'ts

### Do:
- **Do** let Graphite carry depth and Signal Blue signal action — ≤10% blue per viewport.
- **Do** keep surfaces flat at rest; reveal depth only on hover/focus/scroll (glow, tonal step, border-edge).
- **Do** use the 88px grid for construction alignment; every viz measurement derives from it.
- **Do** keep body ≤75ch and narrative ≤52-65ch; wider is not more credible.
- **Do** gate all motion and cursor illusions behind `prefers-reduced-motion` and `pointer:fine` (already in `globals.css:190`, `CursorRing`, `CoreScene reduced`).
- **Do** keep mono labels ≤28 chars, uppercase, 0.18em tracking.
- **Do** theme browser surfaces — `::selection` `accent/on-accent` `globals.css:99`, scrollbar `edge` thumb, focus ring `2px accent` — they are the cheapest proof of craft.
- **Do** use `gap` for sibling rhythm and `border-hair` for quiet division between items.

### Don't:
- **Don't** add gradient text, glass/blur decoration, thick left accent borders (>1px), or hard `4px 4px` offset shadows — outside this world they read as costume.
- **Don't** introduce large rounding (`rounded-xl/2xl`), sparklines/progress rings, or soft-shadowed rounded cards as structure — cards are tonal panels, not lifted rectangles.
- **Don't** use mono as costume for "technical" on running copy — reserved for labels, code, coordinates, and system states.
- **Don't** split Signal Blue into multiple hues per screen or pair amber+mint+iris decoratively — one contextual signal at a time.
- **Don't** add a kicker/eyebrow above a headline (ban, not default) — section index/label row *is* the index, not decoration; heading carries its own weight.
- **Don't** deposit 3D/glow as wallpaper — one glow source per viewport at rest; field height is capped `340→540 / 52vh` in `Hero.tsx` for hierarchy.
- **Don't** invent testimonials, metrics, or project imagery — all visuals are generative; all claims trace to `app/data/*`.
