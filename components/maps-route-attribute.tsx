'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/**
 * Mirrors `/maps` onto <html> so immersive layout CSS can unlock the shell
 * as soon as the pathname leaves Maps — even while a view transition still
 * keeps the old globe DOM mounted.
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
