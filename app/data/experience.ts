export type Experience = {
  year: string;
  role: string;
  place: string;
  body: string;
  tech: string[];
};

export const experience: Experience[] = [
  {
    year: "2022 — Now",
    role: "Software Engineer",
    place: "Product company · Full-time",
    body: "Building and operating backend services and full-stack features in production: API design, data pipelines, automation and observability.",
    tech: ["C#", ".NET", "PostgreSQL", "Docker"],
  },
  {
    year: "2021 — 2022",
    role: "Research Student",
    place: "University research group",
    body: "Machine-learning research on financial time series. Designed experiments, ran walk-forward evaluations, published at ICTCC 2021.",
    tech: ["Python", "Pandas", "XGBoost", "LSTM"],
  },
  {
    year: "2020 — 2021",
    role: "Freelance Developer",
    place: "Client projects",
    body: "Shipped web applications end to end for small clients — from requirements and UI to deployment and handover documentation.",
    tech: ["JavaScript", "React", "Flask", "SQLite"],
  },
];
