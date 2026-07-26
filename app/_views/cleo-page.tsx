'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { AskForm } from '~/components/cleo/ask-form'

function CleoAskForm() {
  const searchParams = useSearchParams()
  const initialAsk = searchParams.get('ask')
  return <AskForm initialAsk={initialAsk} />
}

export function CleoPageView() {
  return (
    <div className="w-full">
      <Suspense fallback={<AskForm />}>
        <CleoAskForm />
      </Suspense>
    </div>
  )
}
