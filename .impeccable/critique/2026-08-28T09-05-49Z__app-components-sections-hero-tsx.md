---
target: app/components/sections/Hero.tsx
total_score: 17
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
timestamp: 2026-08-28T09-05-49Z
slug: app-components-sections-hero-tsx
---
Method: dual-agent (A: ses_fb865112affePB1YYR4cx2Iv6n · B: ses_fb863660affeVwNu5pc669UKj0)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | `Hero.tsx:35-41` pulsing “Available” pill is clear, but HUD `SystemField3D.tsx:165-167` NODES:84 / VECTOR:07 / RES:1.618 and `SystemField3D.tsx:193` hardcoded Z:180 is synthetic status — feels alive until inspected, then breaks trust |
| 2 | Match System / Real World | 2 | Blueprint language (frame `WistfyIdentity.tsx:328`, brackets `WistfyIdentity.tsx:464-488`) fits “systems engineer” perfectly; fails where numbers are theater — TOTAL 1352 `WistfyIdentity.tsx:192` and VECTOR FIELD label unmappable |
| 3 | User Control and Freedom | 2 | No trap, but parallax `SystemField3D.tsx:125-130` has no affordance it’s mousemove-only vs draggable, and `WistfyIdentity.tsx:568` data-cursor="SYS" promises custom cursor that doesn’t fire consistently |
| 4 | Consistency and Standards | 3 | Internally impeccable: `meta-label` `globals.css:127`, `NS vectorEffect` `WistfyIdentity.tsx:56`, `viz-s2/s3` scale. Breaks external CTA standard: both CTAs `Hero.tsx:72,82` are 11px mono uppercase — no primary hierarchy |
| 5 | Error Prevention | 2 | No form to prevent, but heavy `CoreScene.tsx:869` Canvas dpr [1,1.9] + `h-[680px]` `SystemField3D.tsx:142` can jank/OOM on low-end; fallback `SystemField3D.tsx:150-155` exists but no loading→error transition |
| 6 | Recognition Rather Than Recall | 1 | Two unrelated systems (volumetric sphere `CoreScene.tsx:244` + 2D wordmark `WistfyIdentity.tsx:558`) force recall: user must hold `W = VO HUY = WISTFY` across 900px with only `Hero.tsx:96` 78.8% hairline as bridge |
| 7 | Flexibility and Efficiency | n/a | Persuade surface — correctly n/a (no power-user path expected) |
| 8 | Aesthetic and Minimalist Design | 2 | Craft exquisite at detail level, but hero stacks *two* maximalist vizes: sphere with 980+180+95 points `CoreScene.tsx:188,281,286` + identity with 26 nodes / 6 brackets / 2 ellipses — chrome overwhelms 16-word intro `site.ts:6` |
| 9 | Error Recovery | 3 | No errors in hero; passively good: `aria-label` on field `SystemField3D.tsx:144` and scroll arrow `Hero.tsx:123`, `role=img` present |
| 10 | Help and Documentation | n/a | Persuade surface — correctly n/a |
| **Total** | | **17/32** | **Acceptable (53%) — significant improvements needed before users are happy** |

> 17/32 = 53%. On full 40 scale this is ~21/40, bottom of Acceptable. Two heuristics renormalized (7,10) per Persuade mode.

#### Design Specificity Verdict

**LLM assessment: Semi-generic — signature artifact trapped in template shell (5/10).** 

The `WISTFY` identity is genuinely ownable. `WistfyIdentity.tsx:22-54` calibrates `GRID_PX=88` to `globals.css:138` `background-size:88px`, `WistfyIdentity.tsx:211-219` secondary truss, `WistfyIdentity.tsx:92-158` bespoke per-letter `sw 1.45-1.55` and S-Bézier `M63 10 C57 -1…` — no template sells “systems engineer” this literally. Light theme `globals.css:37-64` re-inverts *every* viz token, rare completeness. `Hero.tsx:12` stagger 0.09 / 0.55s `[0.22,0.4,0.2,1]` and `reducedMotion` guards `WistfyIdentity.tsx:258` show adult taste.

But `Hero.tsx:44-85` left column — `VO HUY` `clamp(3.4rem,11vw,8rem)` + `Software Engineer` `Hero.tsx:54` 11px `text-accent` + `site.ts:6` “turn complex problems into useful products” + `Available for opportunities` `site.ts:9` + dual `View Projects / Contact` — could be any SE portfolio. Obfuscate `WISTFY/VO HUY` and this is a Linear intern. `CoreScene.tsx:31-47` sphere (HERO_SPHERE_R 1.36, 3 rings, fibonacci 980 pts) says “I can do 3D” not “I engineer X for Y in VN” — interchangeable with AI/crypto/cloud. Craft is specific, story is not.

**Deterministic scan:** 1 advisory only.

- `app/components/sections/Hero.tsx` alone: `[]` — 0 findings, clean.
- Full `app/` scan: 1× `advisory` `codex-grid-background` at `app/globals.css:134` — `two-axis grid-line gradient background`

```css
app/globals.css:134 — .bg-grid { background-image: linear-gradient(var(--grid-line)…) , linear-gradient(90deg,…) ; background-size:88px 88px }
```

**Visual overlays:** No browser automation available in this harness — no overlay injection, no console findings. Fallback signal reported: `SKIPPED (no automation exposed)`. No synthetic overlay claim.

**Weave:** Detector caught nothing the LLM missed — in fact the sole finding is an *effective false positive* here. The grid is thematic, not slop: it is datum for `GRID_PX` math, `WistfyIdentity.tsx:391` baseline bus, `WistfyIdentity.tsx:858` VECTOR FIELD chrome, and `GridBackdrop.tsx:4` single fixed `z-0` backdrop at `rgba(255,255,255,0.024)` `globals.css:23` — extremely subtle, single-instance, not repeated per-section AI filler. Keep as advisory guard against copy-paste reuse, but do not remove — it *is* the world-building. Detector also proves its limits: 0 findings ≠ visually perfect; it cannot see hierarchy inversion, contrast failures, or two-hero collision.

#### Overall Impression

Gut reaction: **exquisitely engineered, emotionally vacant.** First 400ms peaks high — huge `VO HUY` `tracking-[-0.03em]` `Hero.tsx:46` + silent globe entry earns instant “premium” tag. Then you sag: HUD spam `SystemField3D.tsx:159-181` and second full-width blueprint `Hero.tsx:108` force a decode task before you know who Vo Huy builds for. You leave remembering a cool wordmark, not a person to hire. Biggest opportunity: make the hero sell *one* idea — person → concrete problem → proof — and demote one of the two sculptures to ambient.

**Cognitive load:** 6/8 fails = **high (critical fix needed)**. Fails: progressive disclosure (30+ data-ink elements at once), chunking (left/right grid vs full-width identity disconnect), visual hierarchy (role 11px `Hero.tsx:54` ranks 5th after viz), working memory (`CORE ACTIVE` duplicated `SystemField3D.tsx:164` vs `WistfyIdentity.tsx:830`), clutter (12:1 decoration-to-signal), affordances (CTA parity). Passes: Hick’s choices (only 2 CTAs) and internal pattern consistency. No decision point exceeds 4, but `WistfyIdentity` alone presents 6 competing parses.

**Emotional journey:** Awe (0-400ms) → confusion valley (400-1200ms, “am I supposed to understand NODES:84?”) → bittersweet craft recovery at `WISTFY` S-curve `WistfyIdentity.tsx:112` / core glow `WistfyIdentity.tsx:811`. Peak-end predicts memory = “cool blueprint” not “Vo Huy solves my ops mess.” Reassurance weak: pulsing `Available` dot `Hero.tsx:36` + no social proof, no “last shipped,” no response-time promise.

#### What's Working

1. **Bespoke instrument language — ownable system.** Per-letter constructions `WistfyIdentity.tsx:92-158`, `W_TRUSS` `211-219`, `W_PATH` `WistfyIdentity.tsx:201` with `CORE_CELLS=1.75` grid-locking is director-level craft. Calibrating SVG to `globals.css:138` 88px grid is obsessive and coherent; nothing off-the-shelf looks like this.
2. **Restrained motion vocabulary.** Stagger `Hero.tsx:12`, `CoreScene.tsx:387` stageP/smooth, sphere tilt `0.38/-0.42rad` `CoreScene.tsx:431`, every viz gated by `useReducedMotion` — no bounce, no spinny cliché, feels tripod-not-toy.
3. **Palette discipline.** Dark `#0a0a0b / #f5f5f5 / #8a8a8a` `globals.css:8` + accent `#4d8dff` `globals.css:17` + `viz-s2 rgba 0.08 / s3 0.05` keeps linework whisper-quiet. Light theme re-inverts `viz-dot/text` `globals.css:58-63` — completeness few portfolios attempt.

#### Priority Issues

**[P0] Hierarchy inversion — the hero sells a screensaver, not a person.**
- **What:** At `lg` `Hero.tsx:28` hero is `1fr / 42%`, but right side is `w-[128%] h-[680px]` `SystemField3D.tsx:142` with `fov:35` + `fog 8.8→15.2` `CoreScene.tsx:877,870` — visual weight ~70% viz vs 30% copy. Eye lands on blue core, then bounces to `WISTFY` `Hero.tsx:108` below fold before reading `site.intro` `Hero.tsx:60` `max-w-lg text-dim`.
- **Why it matters:** Recruiter decides in 8s whether to scroll. They see shader demo, not seniority/domain/outcome — you earn aesthetic respect but lose “can this person ship my product?”
- **Fix:** Constrain `SystemField3D` to `h-[360px] md:h-[420px]` max, `dpr [1,1.5]` not 1.9, reduce orbit opacity `0.88→0.28` `CoreScene.tsx:409`, or move `WistfyIdentity` out of hero entirely (to Work prelude or footer lockup). Reclaim first viewport for person→problem→proof.
- **Suggested command:** `/impeccable layout`

**[P1] Intro copy is maximum generic.**
- **What:** `site.ts:6` “I design and build software systems that turn complex problems into useful products.” + `Hero.tsx:54` `Software Engineer` — zero stack, domain, scale, outcome. Even `site.ts:4` tagline “Engineering systems, products and ideas.” is stronger and unused.
- **Why it matters:** Visual ambition promises senior systems thinking; copy undersells by two brackets. Swap `VO HUY`→`JANE DOE` and nothing breaks — interchangeability test fails.
- **Fix:** Replace with one concrete claim + proof anchor: e.g. “Backend-leaning SE in VN — I ship TS/Next + Go services that absorb messy ops into clear product. Last: trading automation handling X tx/day, 99.9% uptime.” Add seniority/domain in `meta-label` row `Hero.tsx:39`.
- **Suggested command:** `/impeccable clarify`

**[P1] Two-hero collision + false bridge.**
- **What:** Hero contains volumetric organic sphere (`CoreScene.tsx:244-859` with warp `1.2%` `CoreScene.tsx:65`) *and* angular blueprint wordmark `WistfyIdentity.tsx:558` — different visual languages competing for `CORE` (blue sphere `CoreScene.tsx:655` vs blue dot `WistfyIdentity.tsx:811`), stitched only by `Hero.tsx:96` 78.8% hairline `hidden lg:block` — invisible on mobile.
- **Why it matters:** User perceives two logos/systems, taxes working memory. `CORE ACTIVE` appears twice in different places `SystemField3D.tsx:164` / `WistfyIdentity.tsx:830` — ambiguous duplication.
- **Fix:** Choose one hero metaphor. Recommendation: keep angular W system (ownable) and demote sphere to ambient background (remove central axis, lower glow, `ORBIT` opacity 0.25) *or* remove `WistfyIdentity` from hero and let sphere own the moment. Unify `NODES` count (26 vs 84 mismatch `WistfyIdentity.tsx:208` vs `SystemField3D.tsx:165`).
- **Suggested command:** `/impeccable distill`

**[P1] CTA parity & low affordance.**
- **What:** `View Projects` `Hero.tsx:72` `bg-fg text-base` vs `Contact` `Hero.tsx:82` `border-edge text-dim` — both `text-xs mono uppercase tracking-[0.18em]`. No primary. `text-dim #8a8a8a` on `#0a0a0b` ≈3.6:1 fails WCAG AA for 11px. `Contact` hover invisible on touch; `data-cursor="View"` `Hero.tsx:71` only on primary.
- **Why it matters:** Scanner sees two equal pills and defers choice. Low contrast makes secondary feel disabled.
- **Fix:** Single primary: `View Selected Work` `bg-accent text-on-accent`; secondary as quiet text link `link-quiet` `globals.css:145` “Schedule 20m →”. Bump size to `13px`+ or `text-dim`→`#b0b0b5` dark / `#4a4a52` light meeting 4.5:1. Add `data-cursor` to both.
- **Suggested command:** `/impeccable clarify`

**[P2] Instrument typography illegible & inaccessible.**
- **What:** Bracket labels `WistfyIdentity.tsx:478` 8.5px `letterSpacing 1` + HUD `SystemField3D.tsx:158` 9px `0.2em` + `meta-label` 11px all `var(--viz-text) rgba(150,150,155,0.85)` / `faint #7d7d86` on dark — 2.8-3.2:1 fails AA. `SystemField3D` `aria-hidden` `Hero.tsx:90` while HUD `pointer-events-none` — live coords decorative noise to AT.
- **Why it matters:** Sam (a11y) and anyone on 125% zoom / sunlight mobile can’t read chrome; it becomes visual noise not information.
- **Fix:** Bump chrome to 10.5-11px min, `viz-text` dark → `rgba(175,175,180,0.96)`. Add `@media (prefers-contrast: more)` override. Keep one AT source: hide HUD `aria-hidden=true`, keep `CoreScene` alt `SystemField3D.tsx:144` as single truth.
- **Suggested command:** `/impeccable audit`

#### Persona Red Flags

**Jordan (Confused First-Timer — lands cold from LinkedIn/Google, never seen Wistfy):**
- First action not obvious in 5s: reads `VO HUY` → sphere → `WISTFY` and asks “is Wistfy a company? a tool? am I on a product page or portfolio?” No definition in hero intro `site.ts:6`.
- Icon-only `ArrowUpRight 14` `Hero.tsx:75` / `ArrowDown 16` `Hero.tsx:124` (hidden mobile) with no label — Jordan hesitates.
- Zero contextual help at decision point: two equal CTAs without hint which to pick for “just browsing” vs “hiring now” — will abandon at 900px scroll to second hero.

**Casey (Distracted Mobile User — one thumb, 4G, interrupted):**
- Primary actions not in thumb zone: CTAs at `mt-10` `Hero.tsx:65` near top, then 480px tall viz `SystemField3D.tsx:142` pushes `WistfyIdentity` ~1100px down — requires two full swipes to reach second payoff.
- No state persistence, `h-[480px] sm:h-[540px]` `SystemField3D.tsx:142` + `dpr 1.9` loads heavy WebGL every mount — on 3G feels blank 1.45s (frame 0→chrome 1.45 `WistfyIdentity.tsx:65-73`) before identity appears.
- Tap targets small: `px-6 py-3.5` mono pills `Hero.tsx:72,82` are borderline 44pt, stacked `gap-4` `Hero.tsx:67` — easy mis-tap when interrupted.

**Riley (Deliberate Stress Tester — methodical, probes edges):**
- Edge: `SystemField3D.tsx:193` Z:180 static exposes HUD as theater; `NODES:84` vs `WistfyIdentity.tsx:208` NODE:26 mismatch — promises system but delivers set dressing, breaks trust on second look.
- Empty/error state: `webglAvailable() → fallback SystemField` `SystemField3D.tsx:82,150` has no loading→error transition; if three.js throws after mount, `SceneBoundary` `SystemField3D.tsx:42` silently renders null — blank hero trap.
- Consistency gap: `Hero.tsx:121` scroll arrow `hidden md:block` removes affordance on mobile; `W / SELECTED` `WistfyIdentity.tsx:456` hover-only never appears on touch — features that exist but never surface.

#### Minor Observations

- `Hero.tsx:93-101` connector dot `h-1.5 border-accent bg-base` at `78.8%` reads as stray pixel in light theme `accent #2f5fe8` on `#fafafa` `globals.css:49` — needs `shadow-sm` separation.
- `WistfyIdentity.tsx:453-458` `W / SELECTED` opacity `wSel?1:0` desktop-only; touch never reveals N1…N5 labels `WistfyIdentity.tsx:760-782`.
- `CoreScene.tsx:869` `dpr [1,1.9]` generous for `680px` canvas — will throttle on integrated GPU; cap at 1.5.
- `Hero.tsx:12` stagger total entrance ~1.45s (`T.chrome 1.45` `WistfyIdentity.tsx:73`); recruiter may scroll before payoff.
- `globals.css:192` `prefers-reduced-motion` disables `node-pulse` but not `CoreScene` fog drift — minor inconsistency.
- Domain drift: `site.ts:11` `portfolio.wistfy.com` vs `wistfy.com` `site.ts:19`.

#### Questions to Consider

- If you deleted the 3D sphere entirely, would a hiring manager understand you faster? What would you put in that reclaimed 42% — a 1-line system diagram, a metric, or a product screenshot?
- What does WISTFY mean to a stranger? Should the hero subtitle be “Wistfy — Systems by Vo Huy” so the wordmark has a definition?
- Could the same hero work with another name swapped in? Pin the test: `VO HUY → JANE DOE`, `Software Engineer → Product Designer` — only `W` breaks. How do you make the *copy* equally unswappable?
- Do you need *two* COREs competing for the eye, or should one own the blue?
