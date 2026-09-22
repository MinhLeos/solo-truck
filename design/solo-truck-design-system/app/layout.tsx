import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const display = Barlow_Condensed({ subsets: ['latin'], variable: '--font-display', weight: ['600', '700'] })
const body = Barlow({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600', '700'] })
const mono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Solo Truck — Daily Log',
  description: 'Daily food safety compliance logging for independent food trucks.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f2f4f5',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
