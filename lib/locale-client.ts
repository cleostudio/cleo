'use client'

import type { Locale } from '~/lib/locale-route'

export type { Locale } from '~/lib/locale-route'
export { localize } from '~/lib/locale-route'

export const LOCALE_CHANGE_EVENT = 'cali:locale-change'

/** English-only site — always `'en'`. */
export function useLocale(): Locale {
  return 'en'
}
