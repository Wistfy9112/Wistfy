export interface ExperienceRecord {
  id: string
  role: string
  company: string
  period: string
  description: string
  tags: string[]
}

export const experiences: ExperienceRecord[] = [
  {
    id: 'boolfly',
    role: 'Frontend Developer',
    company: 'Boolfly Vietnam',
    period: 'Oct 2021 — Dec 2021',
    description:
      'Built and maintained production frontend interfaces, translating designs into responsive, accessible web UI across client projects.',
    tags: ['Frontend', 'JavaScript', 'HTML/CSS', 'Responsive UI'],
  },
]