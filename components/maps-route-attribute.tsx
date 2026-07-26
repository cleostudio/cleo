'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/**
 * Mirrors the Maps route onto <html> so full-bleed globe CSS can unlock the
 * shell (hide rulers / footer padding) the same way Cleo does.
 */
export function MapsRouteAttribute() {
  const isMaps = unlocalizedPathname(usePathname()) === '/maps'

  useEffect(() => {
    const root = document.documentElement

    if (isMaps) {
      root.setAttribute('data-maps-route', '')
    } else {
      root.removeAttribute('data-maps-route')
    }

    return () => {
      root.removeAttribute('data-maps-route')
    }
  }, [isMaps])

  return null
}
