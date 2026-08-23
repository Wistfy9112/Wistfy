export type StackCategory = {
  title: string;
  items: string[];
};

export const stackCategories: StackCategory[] = [
  { title: "Languages", items: ["C#", "Python", "TypeScript", "JavaScript"] },
  {
    title: "Backend",
    items: [".NET", "ASP.NET Core", "Flask", "REST API"],
  },
  { title: "Frontend", items: ["React", "Vite", "Tailwind CSS"] },
  { title: "Database", items: ["PostgreSQL", "SQLite"] },
  {
    title: "Data / ML",
    items: ["Pandas", "XGBoost", "LSTM", "Technical Analysis"],
  },
  { title: "DevOps", items: ["Docker", "Caddy", "Cloudflare", "Git"] },
];

export const stackLayers = [
  {
    id: "frontend",
    label: "Frontend",
    note: "interfaces",
    items: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "api",
    label: "API",
    note: "contracts",
    items: ["ASP.NET Core", "REST", "Validation"],
  },
  {
    id: "logic",
    label: "Business Logic",
    note: "domain",
    items: [".NET services", "Automation", "ML scoring"],
  },
  {
    id: "data",
    label: "Database",
    note: "state",
    items: ["PostgreSQL", "SQLite", "Migrations"],
  },
] as const;
