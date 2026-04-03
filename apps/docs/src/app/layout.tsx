import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { ChildrenProps } from 'react'

const bodyFont = localFont({
  src: '../../../../packages/mui-components/src/theme/fonts/NunitoSans.ttf',
  variable: '--font-body',
  display: 'swap',
})

const displayFont = localFont({
  src: '../../../../packages/mui-components/src/theme/fonts/NunitoSans-Italic.ttf',
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Batoanng JS Library',
    template: '%s | Batoanng JS Library',
  },
  description: 'Editorial package docs for the shared packages that power the monorepo.',
}

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html className="h-full" lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} min-h-full bg-white text-slate-950 antialiased`}>
        {children}
      </body>
    </html>
  )
}
