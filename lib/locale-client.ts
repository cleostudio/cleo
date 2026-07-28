'use client'

import type { Locale } from '~/lib/locale-route'

export type { Locale } from '~/lib/locale-route'
export { localize } from '~/lib/locale-route'

/** English-only site — always `'en'`. */
export function useLocale(): Locale {
  return 'en'
}
