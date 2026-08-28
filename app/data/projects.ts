export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  stack: string[];
  viz: "candles" | "ledger" | "platform" | "loss";
  featured?: boolean;
  problem: string;
  solution: string;
  implementation: string[];
  challenges: { title: string; body: string }[];
  results: { metric: string; label: string }[];
  lessons: string;
  architecture: { layer: string; note: string; items: string[] }[];
  gallery: { caption: string; kind: "candles" | "ledger" | "platform" | "loss" }[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "stock-auto-trading",
    index: "01",
    title: "Stock Auto Trading",
    year: "2024",
    role: "Sole engineer — system design to deployment",
    summary:
      "An algorithmic trading system that watches the market, evaluates signals and executes orders automatically — with risk controls at every step.",
    stack: ["C#", ".NET", "Python", "XGBoost", "PostgreSQL", "Docker"],
    viz: "candles",
    featured: true,
    problem:
      "Manual trading is slow and emotional. Signals appear and vanish in minutes; a human cannot watch dozens of instruments, apply consistent rules and manage risk at the same time.",
    solution:
      "A service-oriented system split into market data ingestion, signal scoring, order execution and risk guard. Strategies are versioned and backtested against historical data before they are ever allowed near live capital.",
    implementation: [
      "Market data pipeline with normalized OHLCV storage and gap recovery",
      "Signal engine scoring strategies (technical analysis + XGBoost model) on every bar close",
      "Order execution module with idempotent requests and retry-safe state machine",
      "Risk guard: position limits, daily loss circuit breaker, kill switch",
      "Backtesting harness with fees, slippage and out-of-sample validation",
    ],
    challenges: [
      {
        title: "Data integrity",
        body: "Broker feeds drop ticks. A reconciliation layer detects gaps and refills from a secondary source before any strategy reads the data.",
      },
      {
        title: "Backtest vs reality",
        body: "Naive fills made every strategy look profitable. Modeling slippage and latency honestly cut fake alpha out early.",
      },
      {
        title: "Safe automation",
        body: "Every automated action passes through a risk guard with hard limits; the kill switch flattens positions in one call.",
      },
    ],
    results: [
      { metric: "24/7", label: "unattended operation" },
      { metric: "<1s", label: "signal-to-order latency" },
      { metric: "0", label: "risk-limit violations in production" },
    ],
    lessons:
      "In trading systems, protecting capital beats chasing returns. Boring risk engineering is what makes the exciting part survivable.",
    architecture: [
      {
        layer: "Data",
        note: "ingestion & storage",
        items: ["Market feed", "OHLCV store", "Reconciliation"],
      },
      {
        layer: "Intelligence",
        note: "signals & models",
        items: ["Technical analysis", "XGBoost scorer", "Strategy registry"],
      },
      {
        layer: "Execution",
        note: "orders & safety",
        items: ["Execution engine", "Risk guard", "Kill switch"],
      },
      {
        layer: "Ops",
        note: "monitoring & delivery",
        items: ["Health checks", "Alerts", "Docker"],
      },
    ],
    gallery: [
      { caption: "Price action with executed signals", kind: "candles" },
      { caption: "Equity curve vs drawdown envelope", kind: "loss" },
    ],
    links: [
      { label: "Live demo", href: "https://wistfy.com" },
      { label: "GitHub", href: "https://github.com/wistfy" },
      { label: "Documentation", href: "https://github.com/wistfy" },
    ],
  },
  {
    slug: "personal-finance",
    index: "02",
    title: "Personal Finance",
    year: "2024",
    role: "Full-stack developer — product & engineering",
    summary:
      "A personal finance platform that turns raw transactions into clear budgets, trends and forecasts — designed around daily use, not demos.",
    stack: [
      "React",
      "TypeScript",
      "ASP.NET Core",
      "PostgreSQL",
      "REST API",
      "Docker",
    ],
    viz: "ledger",
    problem:
      "Money data lives scattered across bank exports and spreadsheets. Existing tools are either toys or enterprise accounting — nothing gives one honest, fast view of where money goes.",
    solution:
      "A focused full-stack app: import and categorize transactions automatically, set budget envelopes, and see trends and forecasts computed server-side with a clean REST API underneath.",
    implementation: [
      "Transaction ingestion from CSV/bank exports with deduplication rules",
      "Auto-categorization via rules + merchant normalization",
      "Budget envelopes with rollover logic and alert thresholds",
      "Server-computed trend aggregation for instant dashboards",
      "Versioned REST API with typed client generation",
    ],
    challenges: [
      {
        title: "Messy imports",
        body: "Every export format differs. A mapping layer with learned rules turned hours of cleanup into a two-click flow.",
      },
      {
        title: "Fast aggregates",
        body: "Dashboard queries over years of transactions were slow until aggregation moved into materialized views refreshed on write.",
      },
    ],
    results: [
      { metric: "2 clicks", label: "import to categorized" },
      { metric: "<100ms", label: "dashboard response" },
      { metric: "100%", label: "of my own finances run on it" },
    ],
    lessons:
      "Products win on boring reliability: deduplication, migrations and fast aggregates matter more than any feature list.",
    architecture: [
      {
        layer: "Frontend",
        note: "React SPA",
        items: ["React", "TypeScript", "Tailwind"],
      },
      {
        layer: "API",
        note: "ASP.NET Core",
        items: ["REST", "Auth", "Validation"],
      },
      {
        layer: "Domain",
        note: "business logic",
        items: ["Categorizer", "Budget engine", "Forecasting"],
      },
      {
        layer: "Storage",
        note: "PostgreSQL",
        items: ["Transactions", "Aggregates", "Migrations"],
      },
    ],
    gallery: [
      { caption: "Monthly spend distribution", kind: "ledger" },
      { caption: "Application surface overview", kind: "platform" },
    ],
    links: [
      { label: "Live demo", href: "https://wistfy.com" },
      { label: "GitHub", href: "https://github.com/wistfy" },
    ],
  },
  {
    slug: "digital-platform",
    index: "03",
    title: "Portfolio / Digital Platform",
    year: "2025",
    role: "Designer & engineer — end to end",
    summary:
      "This website: a digital workspace presenting systems thinking through typography, technical metadata and precise interaction — built as a real product, not a template.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    viz: "platform",
    problem:
      "Most portfolios are interchangeable card grids. I wanted the site itself to prove how I work: information architecture, performance budgets, accessibility and detail obsession — all visible.",
    solution:
      "An editorial-technical layout driven entirely by data files: scroll-aware navigation, animated timelines, generated visualizations instead of stock imagery, and static prerendering for speed and SEO.",
    implementation: [
      "Content model in typed data modules — zero copy hard-coded in components",
      "Scroll-spy navigation with active section indicator",
      "SVG-based project visualizations drawn on scroll",
      "Custom cursor interactions gated behind pointer:fine and reduced-motion checks",
      "Static prerender for all routes; Lighthouse targets >90 across the board",
    ],
    challenges: [
      {
        title: "Motion restraint",
        body: "The rule was: animation must inform, never decorate. Every transition got a purpose test before it stayed.",
      },
      {
        title: "One system, many pages",
        body: "Project detail pages share the same primitives — headers, figures, diagrams — so adding project 05 is a data change, not a redesign.",
      },
    ],
    results: [
      { metric: "0 kb", label: "images shipped — all visuals are SVG" },
      { metric: "100", label: "Lighthouse accessibility target" },
      { metric: "<1s", label: "first contentful paint on 4G" },
    ],
    lessons:
      "Constraints create identity. A strict palette, two fonts and honest metrics shape a brand faster than any decoration.",
    architecture: [
      {
        layer: "Pages",
        note: "routes",
        items: ["/", "/projects/[slug]"],
      },
      {
        layer: "Sections",
        note: "composed blocks",
        items: ["Hero", "Work", "Lab", "Contact"],
      },
      {
        layer: "UI kit",
        note: "primitives",
        items: ["Reveal", "SectionHeader", "Diagrams"],
      },
      {
        layer: "Data",
        note: "typed modules",
        items: ["projects.ts", "skills.ts", "experience.ts"],
      },
    ],
    gallery: [
      { caption: "Interface composition study", kind: "platform" },
      { caption: "Render budget under interaction", kind: "loss" },
    ],
    links: [
      { label: "Live site", href: "https://portfolio.wistfy.com" },
      { label: "GitHub", href: "https://github.com/wistfy" },
    ],
  },
  {
    slug: "ml-research",
    index: "04",
    title: "Machine Learning Research",
    year: "2021",
    role: "Research student — modeling & publication",
    summary:
      "University research on price prediction with LSTM and gradient boosting — from hypothesis through experiments to an ICTCC 2021 publication.",
    stack: ["Python", "Pandas", "XGBoost", "LSTM", "scikit-learn"],
    viz: "loss",
    problem:
      "Price series are noisy, non-stationary and full of patterns that vanish out-of-sample. The research question: can hybrid feature engineering make predictions robust enough to matter?",
    solution:
      "A disciplined experiment pipeline: engineered technical-analysis features fed both an XGBoost baseline and an LSTM variant, evaluated walk-forward with strict train/test discipline and statistical baselines to beat.",
    implementation: [
      "Feature pipeline: returns, volatility windows, technical indicators",
      "XGBoost baseline with Bayesian hyperparameter search",
      "LSTM sequence model with early stopping on validation folds",
      "Walk-forward evaluation across multiple regimes",
      "Statistical significance testing against naive baselines",
    ],
    challenges: [
      {
        title: "Leakage everywhere",
        body: "Rolling statistics silently leak future information. A feature audit harness caught three subtle cases before they reached results.",
      },
      {
        title: "Honest reporting",
        body: "Gains shrank under walk-forward testing — and that became the finding, not a failure to hide.",
      },
    ],
    results: [
      { metric: "ICTCC 2021", label: "published paper" },
      { metric: "Top 3", label: "university research award" },
      { metric: "2×", label: "error reduction vs naive baseline" },
    ],
    lessons:
      "Rigor is the product. Clean evaluation methodology outlives any single model's accuracy.",
    architecture: [
      {
        layer: "Data",
        note: "collection & cleaning",
        items: ["Price history", "Feature builder", "Splits"],
      },
      {
        layer: "Models",
        note: "learning",
        items: ["XGBoost", "LSTM", "Baselines"],
      },
      {
        layer: "Evaluation",
        note: "validation",
        items: ["Walk-forward", "Significance tests"],
      },
      {
        layer: "Output",
        note: "publication",
        items: ["Figures", "Paper", "ICTCC 2021"],
      },
    ],
    gallery: [
      { caption: "Validation loss across training folds", kind: "loss" },
      { caption: "Signal distribution by regime", kind: "candles" },
    ],
    links: [
      { label: "Paper", href: "https://github.com/wistfy" },
      { label: "GitHub", href: "https://github.com/wistfy" },
    ],
  },
];
