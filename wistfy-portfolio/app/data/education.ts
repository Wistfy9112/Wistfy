/* ------------------------------------------------------------------ */
/* EDUCATION — "THE FOUNDATION"                                       */
/* ------------------------------------------------------------------ */
/* A single academic record. One origin, one period, one foundation. */
/* ------------------------------------------------------------------ */

export interface EducationRecord {
  id: string
  period: string
  yearStart: string
  yearEnd: string
  institution: string
  degree: string
  description: string
  focus: string[]
  gpa?: string
  honors?: string[]
}

export const education: EducationRecord = {
  id: 'foundation',
  period: '2018 — 2022',
  yearStart: '2018',
  yearEnd: '2022',
  institution: 'Open University Ho Chi Minh City',
  degree: 'B.Sc. Computer Science',
  description:
    'A four-year academic foundation that shaped how I approach software, systems and graphics programming.',
  focus: ['Computer Science', 'Programming', 'Software Engineering', 'Systems'],
  gpa: '3.64 / 4.00',
  honors: ['Salutatorian — Faculty of Information Technology'],
}
