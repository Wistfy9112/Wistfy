export const PROFILE = {
  name: 'WISTFY',
  roles: ['GRAPHICS PROGRAMMER', 'SOFTWARE ENGINEER', 'CREATIVE TECHNOLOGIST'],
  statement:
    'Building systems, rendering experiences, and turning ideas into interactive worlds.',
  tagline: 'A portfolio that behaves like a virtual system, not a normal website.',
  interests: [
    'Real-time Rendering',
    'Computer Graphics',
    'GPU Programming',
    'Systems Engineering',
    'Interactive Technology',
    'Software Architecture',
  ],
  bio: [
    'I am a graphics programmer and software engineer who likes opening the box that normal applications hide away — the rendering pipeline, the memory layout, the frame loop, the shader.',
    'Most of my work lives between C++ and the GPU: renderers, particle systems, voxel worlds, and the systems that make them fast. I care about precision, about understanding why something is slow, and about turning abstract algorithms into something you can see and touch.',
    'This portfolio is itself one of those experiments — a virtual system where you, the visitor, connect to a machine and explore the work inside it.',
  ],
  location: 'HCM / REMOTE',
  contact: {
    email: 'huy2003vn@gmail.com',
    github: 'https://github.com/Wistfy9112',
    linkedin: 'https://www.linkedin.com/in/vo-dinh-huy-bb6a45257/',
    facebook: 'https://www.facebook.com/Wistfy',
    instagram: 'https://www.instagram.com/wistfy_/',
  },
}

export const SKILL_MODULES = [
  {
    id: 'graphics-engine',
    name: 'GRAPHICS ENGINE',
    description: 'GPU programming and real-time rendering',
    items: ['OpenGL', 'GLSL', 'Rendering Pipelines', 'Shaders', 'GPU Programming', 'WebGL'],
  },
  {
    id: 'software-engineering',
    name: 'SOFTWARE ENGINEERING',
    description: 'Systems thinking and performance engineering',
    items: ['C++', 'Python', 'C#', 'Architecture', 'Performance', 'Data Structures'],
  },
  {
    id: 'web-systems',
    name: 'WEB SYSTEMS',
    description: 'Full-stack interactive applications',
    items: ['React', 'TypeScript', 'Flask', 'Next.js', 'PostgreSQL', 'REST APIs'],
  },
]

export const BOOT_LINES = [
  { text: 'WISTFY SYSTEM v2.0.26', delay: 60 },
  { text: '--------------------------------', delay: 40 },
  { text: '', delay: 30 },
  { text: 'INITIALIZING CORE...', delay: 120 },
  { text: '', delay: 30 },
  { text: 'GRAPHICS MODULE       ONLINE', delay: 160 },
  { text: 'RENDERING ENGINE      ONLINE', delay: 160 },
  { text: 'PROJECT DATABASE      ONLINE', delay: 160 },
  { text: 'VIRTUAL ENVIRONMENT   ONLINE', delay: 160 },
  { text: '', delay: 30 },
  { text: 'SYSTEM CHECK          COMPLETE', delay: 140 },
  { text: '', delay: 30 },
  { text: '> ACCESS GRANTED', delay: 200 },
]

export const BOOT_END_LINE = 'ENTER VIRTUAL ENVIRONMENT'

export const INITIAL_LOGS = [
  'User connected',
  'Virtual environment initialized',
  'Project database loaded',
  'Graphics subsystem ready',
]