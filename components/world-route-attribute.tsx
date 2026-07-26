'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/**
 * Mirrors the World route onto <html> so full-bleed globe CSS can unlock the
 * shell (hide rulers / footer padding) the same way Cleo does.
 */
export function WorldRouteAttribute() {
  const isWorld = unlocalizedPathname(usePathname()) === '/world'

  useEffect(() => {
    const root = document.documentElement

    if (isWorld) {
      root.setAttribute('data-world-route', '')
    } else {
      root.removeAttribute('data-world-route')
    }

    return () => {
      root.removeAttribute('data-world-route')
    }
  }, [isWorld])

  return null
}
