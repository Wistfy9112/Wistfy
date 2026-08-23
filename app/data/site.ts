export const site = {
  name: "Vo Huy",
  role: "Software Engineer",
  tagline: "Engineering systems, products and ideas.",
  intro:
    "I design and build software systems that turn complex problems into useful products.",
  location: "Vietnam",
  timezone: "GMT+7",
  status: "Available for opportunities",
  email: "hello@wistfy.dev",
  url: "https://portfolio.wistfy.com",
  socials: [
    { label: "GitHub", handle: "@wistfy", href: "https://github.com/wistfy" },
    {
      label: "LinkedIn",
      handle: "in/wistfy",
      href: "https://www.linkedin.com/in/wistfy",
    },
    { label: "Website", handle: "wistfy.com", href: "https://wistfy.com" },
  ],
} as const;

export const navLinks = [
  { href: "/#work", id: "work", label: "Work" },
  { href: "/#about", id: "about", label: "About" },
  { href: "/#lab", id: "lab", label: "Lab" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;
