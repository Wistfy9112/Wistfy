import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wistfy | Portfolio',
  description: 'Full-stack developer portfolio showcasing projects, skills, and experience',
  openGraph: {
    title: 'Wistfy | Portfolio',
    description: 'Full-stack developer portfolio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" style={{ backgroundColor: '#0a0a1a' }}>
      <body className="antialiased" style={{ backgroundColor: '#0a0a1a' }}>
        {children}
      </body>
    </html>
  )
}
