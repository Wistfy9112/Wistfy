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
  connections: string[]
  github?: string
  demo?: string
  demoType?: 'webgl' | 'none'
  node: { x: number; y: number; z?: number }
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
    id: 'web',
    code: 'SECTOR_01',
    name: 'WEB',
    description: 'Interactive applications and full-stack systems.',
    color: '#9fd4f5',
    projects: ['smart-english'],
  },
  {
    id: 'experiments',
    code: 'SECTOR_02',
    name: 'EXPERIMENTS',
    description: 'Research, data experiments and prototypes.',
    color: '#5fd0c0',
    projects: ['mcqa-system'],
  },
]

export const projects: Project[] = [
  {
    id: 'mcqa-system',
    title: 'Multiple Choice Question Answering System',
    category: 'EXPERIMENTS',
    status: 'COMPLETED',
    language: 'Python',
    api: 'scikit-learn / NLTK',
    year: '2021',
    description:
      'A machine-learning system that answers multiple-choice questions, published as scientific research at ICTCC 2021 — awarded 1st and 3rd prizes in scientific research.',
    architecture: [
      'Question-answering pipeline with retrieval and scoring',
      'Feature extraction and classification for answer selection',
      'Evaluation harness on the competition question sets',
    ],
    challenges: [
      'Handling the linguistic variance of natural-language questions',
      'Keeping the research results reproducible',
    ],
    solutions: [
      'Normalization and keyword-retrieval preprocessing',
      'Fixed-seed, documented experiment protocol',
    ],
    technologies: ['Python', 'Machine Learning', 'NLP', 'scikit-learn'],
    connections: [],
    github: 'https://github.com/Wistfy9112',
    node: { x: 30, y: 30, z: 0.1 },
  },
  {
    id: 'smart-english',
    title: 'Smart English Learning Platform',
    category: 'WEB',
    status: 'COMPLETED',
    language: 'Python',
    api: 'Django / MySQL',
    year: '2021',
    description:
      'A web platform integrating automated English question answering into a learning experience — students practise and receive instant feedback.',
    architecture: [
      'Django application with MySQL persistence',
      'Automated question-answering integration',
      'User progress and exercise management',
    ],
    challenges: [
      'Integrating the Q&A engine into a usable web flow',
      'Keeping responses fast enough for interactive practice',
    ],
    solutions: [
      'Server-side caching of answer retrieval',
      'Asynchronous question generation off the request path',
    ],
    technologies: ['Python', 'Django', 'MySQL', 'HTML/CSS', 'JavaScript'],
    connections: ['mcqa-system'],
    github: 'https://github.com/Wistfy9112',
    demo: '#',
    node: { x: 70, y: 60, z: 0.3 },
  },
]

export const getProjectById = (id: string) => projects.find((p) => p.id === id)

export const getSectorForProject = (projectId: string) =>
  sectors.find((s) => s.projects.includes(projectId))