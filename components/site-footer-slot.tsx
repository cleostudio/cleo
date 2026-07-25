'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/** Hides the site footer on the full-bleed Cleo chat surface. */
export function SiteFooterSlot({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (unlocalizedPathname(pathname) === '/cleo') return null
  return children
}
