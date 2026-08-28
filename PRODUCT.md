# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — Hiring managers, technical recruiters, engineering leads** evaluating Vo Huy (Wistfy) for Software Engineer / Backend / Full-stack / Data & Automation roles.

- **Situation:** Discover portfolio via CV, LinkedIn, GitHub, or referral. Time-constrained scan (30–90s) to decide interview-worthiness. Seeks evidence of production engineering ability, not visual showcase.
- **Job to be done:** Quickly verify that Vo Huy can build and own reliable backend and full-stack systems — APIs, databases, data pipelines, automation — and assess depth in C#/.NET, Python, React, PostgreSQL, plus practical data/ML.
- **Success for user:** Confident yes/no on "can this person build and own complex systems? I want to talk to them."

**Secondary:**
- Engineering managers / tech leads (deeper architecture review)
- Potential collaborators / peers (technical credibility)
- Technical clients evaluating delivery ownership

All secondary audiences defer to primary; hiring decision is the governing task.

## Product Purpose

Portfolio for Vo Huy, operating as **Wistfy** — a personal site that proves systems engineering capability through shipped work and the site itself.

- **What it does:** Presents experience, selected work, lab experiments, and contact in a single editorial-technical narrative. The site *is* a project: typed data model, generated visualizations, scroll-aware navigation, static performance.
- **Why it exists:** Resumes and GitHub links alone do not convey architecture, reliability, and ownership mindset. Portfolio compresses concept → architecture → implementation → deployment evidence into one scannable surface.
- **What success means:** Primary user leaves with impression: "This engineer turns complex data and processes into robust automated systems — not generic CRUD." Action is contact/interview request via email, GitHub, LinkedIn, or site contact.

## Positioning

**Mechanism that neighbors cannot truthfully copy:** End-to-end system ownership across **data → backend architecture → business logic → automation → product**.

Not "Full-stack who builds websites" but:
- Risk-aware automation (market data ingestion, signal scoring, idempotent execution, circuit-breaker / kill switch — Stock Auto Trading `app/data/projects.ts:26`)
- Data pipelines that collect → transform → validate → analyze real-world messy data (Personal Finance CSV ingestion, deduplication, materialized aggregates `app/data/projects.ts:101`)
- Systems where correctness, traceability, and consistency matter (finance, trading research)
- Strictly typed content/data models (`projects.ts`, `skills.ts`, `experience.ts` as source of truth, zero hard-coded copy in components) and zero-stock-imagery visuals (all SVG / generative)

**60-second memory:** *"I don't just build features. I engineer systems that make complex processes reliable and automatic."* Visual identity (precise, slightly experimental instrument language) supports engineering credibility, never replaces it.

## Operating Context

- **Entry points:** CV link, LinkedIn `in/wistfy`, GitHub `@wistfy`, `wistfy.com` / `portfolio.wistfy.com` (`app/data/site.ts:11,13-19`), referral.
- **Primary workflow:** Land on hero → scan positioning → inspect Work (4 projects, each with problem/solution/implementation/challenges/results/architecture) → glance Experience/Lab/Achievements → Contact (email `hello@wistfy.dev`, socials, CTA). Project detail route `/projects/[slug]` (`app/projects/[slug]/page.tsx`) for depth.
- **Environments:** Desktop evaluation at desk (primary) and mobile quick-check. Fast load expectation; static prerendered routes, Lighthouse targets >90 / accessibility 100 (`app/data/projects.ts:211`).
- **Tools & rituals present in portfolio:** Material includes timelines, stack diagrams, lab experiments (`market`, `network`, `backtest`, `pipeline`), code sample of risk guard (`app/data/lab.ts:35`), ICTCC paper reference.
- **Evaluation ritual:** Recruiter skims hero + first project card within first viewport; proof (metrics, architecture, publication) must be findable in seconds, not buried.

## Capabilities and Constraints

**Confirmed capabilities (portfolio as product):**
- Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, Three.js + @react-three/fiber/drei (`package.json:12-20`)
- Routes: `/`, `/projects/[slug]`, OG image, robots/sitemap; typed data modules drive all copy
- Project visualizations via bespoke SVG/Three.js (candles/ledger/platform/loss kinds), no shipped images
- Scroll-spy navigation (`app/hooks/useScrollSpy.ts`), reveal animations, GridBackdrop, CursorRing gated by `pointer:fine` and `prefers-reduced-motion`

**Content & stack coverage:**
- Languages: C#, Python, TypeScript/JavaScript; Backend: .NET/ASP.NET Core/Flask/REST; Frontend: React/Vite/Tailwind; DB: PostgreSQL/SQLite; Data/ML: Pandas/XGBoost/LSTM/TA; DevOps: Docker/Caddy/Cloudflare (`app/data/skills.ts:6`)
- Experience 2022—Now Product company (C#/.NET/PostgreSQL/Docker), 2021—2022 Research (Python/Pandas), 2020—2021 Freelance (`app/data/experience.ts:9`)

**Constraints — must preserve:**
- Do not invent employers, clients, projects, metrics, testimonials, awards, or technical achievements. Only 4 projects (`stock-auto-trading`, `personal-finance`, `digital-platform`, `ml-research`) and achievements ICTCC 2021, Research Award, Scholarships, Certificates (`app/data/achievements.ts:8`) are factual.
- Keep WISTFY as alias; domain drift `portfolio.wistfy.com` vs `wistfy.com` is known — canonical is `/` at `site.url`.
- Portfolio is web-only (static); no iOS/Android/adaptive requirement. Mobile web remains `web`.
- Visual experimentation allowed only when it supports engineering identity; remain credible/professional for hiring managers.

**Explicitly undecided:** Pricing/licensing (not a product for sale), future project additions (mechanism accommodates via data file), CMS vs file-based content (currently file-based by choice).

## Brand Commitments

- **Name:** WISTFY — personal brand/alias, consistently `WISTFY / SYSTEM` and `VO HUY` pairing. Preserve across redesigns.
- **Voice:** Technical, confident, modern, distinctive; measurable and testable. Not generic "passionate developer" nor overly flashy showcase. Editorial-technical, concise.
- **Assets on hand:** Incumbent instrument world — grid `88px` (`app/globals.css:138`), Geist + JetBrains Mono (`app/layout.tsx:6`), mono meta-labels, hair/edge tokens, viz palette (`--viz-s*`, `--viz-text`), no hard-coded stock photography.
- **Commitment:** Distinctiveness must remain credible. Cold, precise, intelligent, slightly experimental — engineering-first. Future work expands world, not replaces with generic SaaS minimal.

## Evidence on Hand

**Real content (paths):**
- Site metadata `app/data/site.ts` (name, role Software Engineer, tagline, intro, location Vietnam GMT+7, status Available, socials GitHub/LinkedIn/Website)
- Projects `app/data/projects.ts` — 4 detailed entries with architecture, challenges, results (e.g., Trading: 24/7 unattended, <1s latency, 0 risk-limit violations; Finance: 2-click import, <100ms dashboard)
- Experience `app/data/experience.ts`, Achievements `app/data/achievements.ts`, Lab `app/data/lab.ts` (4 experiments + risk-guard code sample), Skills `app/data/skills.ts`, Profile timeline `app/data/profile.ts`
- No testimonials, no client logos, no invented press — absences that must not be fabricated

**Visual proof:** Live sections `Hero`, `Work`, `Stack`, `Experience`, `Achievements`, `Lab`, `Contact`, plus `SystemField3D` / `WistfyIdentity` systems; all visuals are code-generated.

## Product Principles

1. **Systems over features** — Show how data, backend, automation, and interface were designed as one coherent system, not a list of features.
2. **Reliability before novelty** — Risk controls, data integrity, and correctness are the headline; cleverness is secondary (trading risk guard > model accuracy).
3. **Own the whole path** — Demonstrate end-to-end ownership from concept and architecture through implementation, deployment, and operation.
4. **Data discipline is craft** — Typed models, validated pipelines, walk-forward rigor, and materialized aggregates are visible proof, not hidden implementation detail.
5. **Distinct but credible** — Technical experimentation earns attention, but hiring-manager credibility decides. Every visual choice must pass "would an engineering lead trust this?"

## Accessibility & Inclusion

- Target: WCAG AA minimum; portfolio explicitly targets Lighthouse accessibility 100 (`app/data/projects.ts:210`) and respects `prefers-reduced-motion` (global disable for `node-pulse`/`dash-rotate`, `useReducedMotion` gating for Three.js and Framer Motion).
- Keyboard navigation, focus-visible outlines (`app/globals.css:119`), skip link `#main-content` (`app/layout.tsx:80`), semantic headings/landmarks required.
- No product-specific exclusion criteria established beyond standard inclusive hiring context; content is English, location Vietnam remote-friendly, timezone GMT+7 communicated.
