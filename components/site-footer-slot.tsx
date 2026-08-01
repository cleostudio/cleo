'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/**
 * Hides the site footer on the full-bleed Cleo chat surface without
 * unmounting it. Unmounting remounted FooterCoordinates on every leave from
 * `/cleo`, which cleared the stamp to “Locating…” while a fresh high-accuracy
 * geolocation request ran — a laggy flash on Topics and other public pages.
 */
export function SiteFooterSlot({ children }: { children: ReactNode }) {
  const hide = unlocalizedPathname(usePathname()) === '/cleo'

  return (
    <div className={hide ? 'hidden' : 'contents'} aria-hidden={hide || undefined}>
      {children}
    </div>
  )
}
