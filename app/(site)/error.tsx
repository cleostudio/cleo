'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

import { ErrorPageView, type ErrorBoundaryProps } from '../_views/error-page'

export default function EnglishError({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return <ErrorPageView retry={retry} />
}
