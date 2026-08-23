export type Achievement = {
  index: string;
  title: string;
  detail: string;
  year: string;
};

export const achievements: Achievement[] = [
  {
    index: "01",
    title: "Research Publication — ICTCC 2021",
    detail:
      "Authored a conference paper on machine learning for price prediction: hybrid feature engineering with walk-forward validation.",
    year: "2021",
  },
  {
    index: "02",
    title: "Scientific Research Award",
    detail:
      "University-level award for outstanding student research, recognizing the publication and experimental rigor.",
    year: "2021",
  },
  {
    index: "03",
    title: "Academic Scholarships",
    detail:
      "Multiple merit scholarships across undergraduate studies for consistent academic performance.",
    year: "2018 — 2021",
  },
  {
    index: "04",
    title: "Certificates",
    detail:
      "Supplementary certifications in machine learning and cloud fundamentals alongside formal education.",
    year: "2020 — 2022",
  },
];
