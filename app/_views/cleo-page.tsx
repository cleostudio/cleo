'use client'

import { ThreadSession } from '~/components/cleo/thread-session'

/**
 * `/cleo` shell. Thread identity, IndexedDB hydration, and the `/cleo?q=…`
 * handoff are owned by `ThreadSession` so this route stays prerenderable.
 */
export function CleoPageView() {
  return <ThreadSession />
}
