/* ------------------------------------------------------------------ */
/* ACHIEVEMENTS — "THE PROOF" / SIGNAL-IMPACT                       */
/* ------------------------------------------------------------------ */
/* `primary` marks the focal achievement. Only include fields that    */
/* actually exist — omit result/link rather than inventing them.       */
/* ------------------------------------------------------------------ */

export interface AchievementRecord {
  id: string
  year: string
  title: string
  category: string
  description: string
  result?: string
  link?: string
  primary?: boolean
}

export const achievements: AchievementRecord[] = [
  {
    id: 'ictcc-2021',
    year: '2021',
    title: 'ICTCC 2021 Research Publication',
    category: 'RESEARCH',
    description:
      'Published research on a multiple-choice question answering system at the ICTCC 2021 conference.',
    result: '1ST + 3RD PRIZE — SCIENTIFIC RESEARCH',
    primary: true,
  },
  {
    id: 'academic-excellence',
    year: '2022',
    title: 'Academic Excellence Scholarship',
    category: 'SCHOLARSHIP',
    description: 'Awarded for consistently strong academic performance across the programme.',
    result: 'AWARDED',
  },
  {
    id: 'five-merits',
    year: '2022',
    title: 'Student of 5 Merits',
    category: 'RECOGNITION',
    description: 'Recognized across both academic years 2020–2021 and 2021–2022.',
  },
]
