export type ProjectStatus = 'COMPLETED' | 'IN PROGRESS' | 'ARCHIVED'

export interface Project {
  id: string
  title: string
  category: string
  status: ProjectStatus
  language: string
  api: string
  shaders?: string
  year: string
  description: string
  architecture: string[]
  challenges: string[]
  solutions: string[]
  technologies: string[]
  github?: string
  demo?: string
  demoType?: 'webgl' | 'none'
  node: { x: number; y: number }
}

export interface Sector {
  id: string
  code: string
  name: string
  description: string
  color: string
  projects: string[]
}

export const sectors: Sector[] = [
  {
    id: 'graphics',
    code: 'SECTOR_01',
    name: 'GRAPHICS',
    description: 'Rendering systems, GPU programming and visual experiments.',
    color: '#3ee6ff',
    projects: ['opengl-renderer', 'shader-lab', 'particle-system'],
  },
  {
    id: 'systems',
    code: 'SECTOR_02',
    name: 'SYSTEMS',
    description: 'Low-level engineering, performance and tooling.',
    color: '#8b9bff',
    projects: ['cpp-sandbox', 'voxel-world', 'raytracer'],
  },
  {
    id: 'intelligence',
    code: 'SECTOR_03',
    name: 'INTELLIGENCE',
    description: 'Machine learning, data analysis and prediction experiments.',
    color: '#5fd0c0',
    projects: ['trade-bot', 'ml-notebooks'],
  },
  {
    id: 'web',
    code: 'SECTOR_04',
    name: 'WEB',
    description: 'Interactive applications and full-stack systems.',
    color: '#9fd4f5',
    projects: ['fin-manager', 'wistfy-site'],
  },
]

export const projects: Project[] = [
  {
    id: 'opengl-renderer',
    title: 'Real-Time Rendering Engine',
    category: 'GRAPHICS',
    status: 'COMPLETED',
    language: 'C++',
    api: 'OpenGL 4.6',
    shaders: 'GLSL',
    year: '2025',
    description:
      'A real-time rendering system focused on understanding the graphics pipeline end-to-end: vertex processing, rasterization, fragment shading, camera systems, lighting and GPU resource management.',
    architecture: [
      'OpenGL rendering context and resource abstraction',
      'Forward renderer with multi-light support',
      'GLSL shader pipeline with uniform management',
      'Mesh, texture and material cache',
      'Camera + orbit controls',
      'Debug overlays and metrics HUD',
    ],
    challenges: [
      'Managing GPU resource lifetimes correctly',
      'Shader compilation and validation across drivers',
      'Keeping the render loop at a stable frame rate',
    ],
    solutions: [
      'RAII-style wrappers for every GL object',
      'Central shader builder with reflection caching',
      'Delta-timed updates decoupled from frame rate',
    ],
    technologies: ['C++', 'OpenGL', 'GLSL', 'GLM', 'CMake'],
    github: 'https://github.com/Wistfy9112',
    demoType: 'webgl',
    node: { x: 24, y: 22 },
  },
  {
    id: 'shader-lab',
    title: 'Shader Experiments Lab',
    category: 'GRAPHICS',
    status: 'IN PROGRESS',
    language: 'GLSL',
    api: 'WebGL 2',
    shaders: 'GLSL ES',
    year: '2026',
    description:
      'An interactive environment for prototyping fragment shaders. Each experiment is a live shader with hot-reloadable uniforms, parameter sliders and waveform visualizations.',
    architecture: [
      'Live shader editor with compilation feedback',
      'Uniform binding panel generated from shader source',
      'Procedural geometry and post-processing passes',
      'Preset gallery organized by technique',
    ],
    challenges: [
      'Compiling shaders in the browser efficiently',
      'Making the interface fast enough for live editing',
    ],
    solutions: [
      'Debounced recompilation with error overlay',
      'Web Worker shader pre-processing',
    ],
    technologies: ['GLSL', 'TypeScript', 'WebGL 2'],
    demoType: 'webgl',
    node: { x: 68, y: 14 },
  },
  {
    id: 'particle-system',
    title: 'GPU Particle System',
    category: 'GRAPHICS',
    status: 'COMPLETED',
    language: 'C++',
    api: 'OpenGL',
    shaders: 'GLSL',
    year: '2025',
    description:
      'A transform-feedback particle system simulating tens of thousands of particles on the GPU with velocity, attraction and emitter fields — rendered with additive point sprites.',
    architecture: [
      'Transform feedback ping-pong particle buffers',
      'Emitter and force-field shader stages',
      'Additive-blended point sprite rendering',
      'CPU-side emitter configuration API',
    ],
    challenges: [
      'Synchronizing GPU readback with rendering',
      'Tuning particle counts against fill-rate',
    ],
    solutions: [
      'Buffer storage barriers and double buffering',
      'Configurable LOD with adaptive particle count',
    ],
    technologies: ['C++', 'OpenGL', 'GLSL', 'GLM'],
    github: 'https://github.com/Wistfy9112',
    demoType: 'webgl',
    node: { x: 8, y: 52 },
  },
  {
    id: 'cpp-sandbox',
    title: 'C++ Systems Sandbox',
    category: 'SYSTEMS',
    status: 'COMPLETED',
    language: 'C++',
    api: 'STL / CLI',
    year: '2024',
    description:
      'A collection of low-level systems experiments: custom allocators, thread pools, lock-free queues, SIMD microbenchmarks and performance profiling harnesses.',
    architecture: [
      'Custom memory allocators and arena pools',
      'Thread pool with work stealing',
      'SIMD vectorized kernels with scalar fallback',
      'Microbenchmark and profiling tooling',
    ],
    challenges: [
      'Writing lock-free structures without UB',
      'Interpreting benchmark noise reliably',
    ],
    solutions: [
      'Strict memory-order discipline and TSan runs',
      'Statistical benchmark runs with outlier pruning',
    ],
    technologies: ['C++20', 'CMake', 'Google Benchmark', 'SIMD'],
    github: 'https://github.com/Wistfy9112',
    node: { x: 38, y: 34 },
  },
  {
    id: 'voxel-world',
    title: 'Voxel World Prototype',
    category: 'SYSTEMS',
    status: 'IN PROGRESS',
    language: 'C++',
    api: 'OpenGL',
    shaders: 'GLSL',
    year: '2026',
    description:
      'A chunked voxel renderer exploring meshing, greedy meshing and chunk streaming. Built to study spatial data structures and memory-efficient geometry generation.',
    architecture: [
      'Chunk-based world with 3D spatial hashing',
      'Greedy meshing for reduced vertex counts',
      'Simple sky + fog + texture atlas',
      'Fly camera with frustum-aware chunk loading',
    ],
    challenges: [
      'Mesh regeneration latency while editing',
      'Atlas bleeding artifacts between voxel types',
    ],
    solutions: [
      'Background meshing threads with priority queues',
      'Inset UVs with half-texel padding',
    ],
    technologies: ['C++', 'OpenGL', 'GLSL', 'GLM'],
    github: 'https://github.com/Wistfy9112',
    demoType: 'webgl',
    node: { x: 82, y: 40 },
  },
  {
    id: 'raytracer',
    title: 'CPU Ray Tracer',
    category: 'SYSTEMS',
    status: 'ARCHIVED',
    language: 'C++',
    api: 'STL',
    year: '2024',
    description:
      'A from-scratch CPU ray tracer supporting spheres, planes, soft shadows, reflections, refractions and a basic path tracing mode for indirect lighting.',
    architecture: [
      'BVH acceleration structure for ray intersection',
      'Surface shader framework (diffuse/specular/transmissive)',
      'Path tracing integrator with Russian roulette',
      'PPM / PBM image writer and scene loader',
    ],
    challenges: [
      'BVH construction and traversal correctness',
      'Monte Carlo noise reduction with limited samples',
    ],
    solutions: [
      'Surface-area-heuristic splitter and stack traversal',
      'Stratified sampling + clamping + simple denoise pass',
    ],
    technologies: ['C++', 'STL', 'CMake'],
    github: 'https://github.com/Wistfy9112',
    node: { x: 58, y: 62 },
  },
  {
    id: 'trade-bot',
    title: 'Stock Auto-Trading System',
    category: 'INTELLIGENCE',
    status: 'IN PROGRESS',
    language: 'Python',
    api: 'REST / WebSocket',
    year: '2025',
    description:
      'An automated trading research platform: data ingestion, feature engineering, model backtesting and paper-trading execution with risk controls.',
    architecture: [
      'Data pipeline for OHLCV and order book snapshots',
      'Feature store with technical indicators',
      'Backtesting engine with realistic fill simulation',
      'Strategy registry with pluggable signals',
      'Paper-trading executor with risk limits',
    ],
    challenges: [
      'Avoiding look-ahead bias in backtests',
      'Latency between signal generation and fill',
    ],
    solutions: [
      'Point-in-time data validation harness',
      'Local-queue buffering with timestamp alignment',
    ],
    technologies: ['Python', 'Pandas', 'NumPy', 'SQLite', 'REST'],
    github: 'https://github.com/Wistfy9112',
    node: { x: 30, y: 78 },
  },
  {
    id: 'ml-notebooks',
    title: 'ML & Data Experiments',
    category: 'INTELLIGENCE',
    status: 'ARCHIVED',
    language: 'Python',
    api: 'SciPy / sklearn',
    year: '2024',
    description:
      'A series of experiments on datasets, prediction tasks and visualization. Focused on building intuition for model behavior rather than chasing benchmarks.',
    architecture: [
      'Reproducible experiment notebooks with fixed seeds',
      'Feature analysis and dimensionality reduction',
      'Baseline-to-sophisticated model ladder',
      'Interpretability reports (feature importance, residuals)',
    ],
    challenges: [
      'Presenting results honestly without overfitting',
    ],
    solutions: [
      'Strict train/test/validation split protocol',
    ],
    technologies: ['Python', 'Pandas', 'scikit-learn', 'Matplotlib', 'Jupyter'],
    github: 'https://github.com/Wistfy9112',
    node: { x: 70, y: 86 },
  },
  {
    id: 'fin-manager',
    title: 'Personal Finance Manager',
    category: 'WEB',
    status: 'COMPLETED',
    language: 'TypeScript / Python',
    api: 'REST',
    year: '2025',
    description:
      'A full-stack application for tracking budgets and transactions with dashboards, categorization rules and exportable reports.',
    architecture: [
      'React front-end with typed state management',
      'Flask REST API with SQLAlchemy models',
      'PostgreSQL persistence with migrations',
      'Budget/rule engine running server-side',
    ],
    challenges: [
      'Keeping client/server types in sync',
      'Correct currency and date handling',
    ],
    solutions: [
      'Shared OpenAPI-generated types',
      'ISO 8601 + money-as-integer policy',
    ],
    technologies: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'REST'],
    github: 'https://github.com/Wistfy9112',
    demo: '#',
    node: { x: 44, y: 94 },
  },
  {
    id: 'wistfy-site',
    title: 'WISTFY Virtual System',
    category: 'WEB',
    status: 'IN PROGRESS',
    language: 'TypeScript',
    api: 'WebGL / DOM',
    shaders: 'GLSL ES',
    year: '2026',
    description:
      'This very site. A portfolio designed as a virtual computer system — boot sequence, HUD modules, a 3D world layer and a project map.',
    architecture: [
      'Next.js App Router + React 19',
      'React Three Fiber virtual world layer',
      'Data-driven project sectors',
      'System log driven by interaction events',
    ],
    challenges: [
      'Keeping WebGL smooth alongside DOM UI',
      'Making the experience accessible and mobile-friendly',
    ],
    solutions: [
      'Reduced particle counts and lazy 3D on mobile',
      'Reduced-motion and keyboard navigation support',
    ],
    technologies: ['React', 'TypeScript', 'Next.js', 'Three.js', 'GLSL'],
    github: 'https://github.com/Wistfy9112',
    demoType: 'webgl',
    node: { x: 92, y: 70 },
  },
]

export const getProjectById = (id: string) => projects.find((p) => p.id === id)

export const getSectorForProject = (projectId: string) =>
  sectors.find((s) => s.projects.includes(projectId))
