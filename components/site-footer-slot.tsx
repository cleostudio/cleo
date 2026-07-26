'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/** Hides the site footer on full-bleed surfaces (Cleo chat, Maps globe). */
export function SiteFooterSlot({ children }: { children: ReactNode }) {
  const pathname = unlocalizedPathname(usePathname())
  if (pathname === '/cleo' || pathname === '/maps') return null
  return children
}
