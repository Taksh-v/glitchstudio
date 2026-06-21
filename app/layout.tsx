import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
})
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono-glitch',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GLITCHSTUDIO // turn your photos into corrupted art',
  description:
    'GlitchStudio takes your boring photos and runs them through the machine — chromatic aberration, datamosh, CRT decay, and Y2K corruption, printed on real archival paper.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0d10',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
