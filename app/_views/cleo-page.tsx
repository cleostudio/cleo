'use client'

import { Suspense } from 'react'

import { AskForm } from '~/components/cleo/ask-form'

function AskFormFallback() {
  return <div className="app-column min-w-0" aria-busy="true" />
}

export function CleoPageView() {
  return (
    <div className="w-full">
      <Suspense fallback={<AskFormFallback />}>
        <AskForm />
      </Suspense>
    </div>
  )
}
