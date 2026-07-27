'use client'

import { AskForm } from '~/components/cleo/ask-form'
import type { CleoAskIntent } from '~/lib/cleo/ask-links'

export function CleoPageView({
  initialAsk = null,
}: {
  initialAsk?: CleoAskIntent | null
}) {
  return (
    <div className="w-full">
      <AskForm initialAsk={initialAsk} />
    </div>
  )
}
