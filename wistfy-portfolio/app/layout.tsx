import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WISTFY | SYSTEM PORTFOLIO',
  description:
    'Interactive virtual portfolio of WISTFY — graphics programmer, software engineer, creative technologist. Building systems, rendering experiences, turning ideas into interactive worlds.',
  openGraph: {
    title: 'WISTFY | SYSTEM PORTFOLIO',
    description: 'Enter the WISTFY virtual system — a graphics programmer portfolio that behaves like a computer.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#030509',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      style={{ backgroundColor: '#030509' }}
    >
      <body style={{ backgroundColor: '#030509' }}>{children}</body>
    </html>
  )
}