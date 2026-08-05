'use client'

import './globals.css'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

import { AmbientBackground } from '~/components/ambient-background'
import { ThemeProvider } from '~/components/theme-provider'
import { PREPAINT_SCRIPT } from '~/lib/security/inline-scripts'
import { cn } from '~/lib/utils'

import { fontVariables } from './fonts'
import { ErrorPageView, type ErrorBoundaryProps } from './_views/error-page'

export default function GlobalError({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html
      lang="en"
      data-locale="en"
      suppressHydrationWarning
      className={cn('font-sans', fontVariables)}
    >
      <head>
        <title>Something went wrong | Cleo</title>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AmbientBackground />
          <main className="min-h-screen pt-14">
            <ErrorPageView retry={retry} />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
