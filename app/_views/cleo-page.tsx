'use client'

import { AskForm } from '~/components/cleo/ask-form'

/**
 * `initialPrompt` is for callers that already hold the question. Arrivals from
 * a `/cleo?q=…` link are read from the URL inside `AskForm`, which keeps this
 * route prerendered.
 */
export function CleoPageView({ initialPrompt }: { initialPrompt?: string }) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <AskForm initialPrompt={initialPrompt} />
    </div>
  )
}
