'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/** Hides the site footer on full-bleed surfaces (Cleo chat, World globe). */
export function SiteFooterSlot({ children }: { children: ReactNode }) {
  const pathname = unlocalizedPathname(usePathname())
  if (pathname === '/cleo' || pathname === '/world') return null
  return children
}
