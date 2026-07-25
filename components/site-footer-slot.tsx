'use client'

import { usePathname } from 'next/navigation'

import { SiteFooter } from '~/components/site-footer'
import { unlocalizedPathname } from '~/lib/locale-route'

/** Site footer for every public route except the full-bleed Cleo chat surface. */
export function SiteFooterSlot() {
  const pathname = usePathname()
  if (unlocalizedPathname(pathname) === '/cleo') return null
  return <SiteFooter locale="en" />
}
