import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "./data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  keywords: [
    "Vo Huy",
    "software engineer",
    "full-stack developer",
    "backend engineer",
    ".NET",
    "React",
    "TypeScript",
    "machine learning",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    address: { "@type": "PostalAddress", addressCountry: "VN" },
    sameAs: site.socials.map((s) => s.href),
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var l=window.matchMedia("(prefers-color-scheme: light)").matches;if(s==="light"||(!s&&l)){document.documentElement.classList.add("light")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-base text-fg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-edge focus:bg-base focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=0a9f03d9-f040-4c14-8a6f-991b312e96f9"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
