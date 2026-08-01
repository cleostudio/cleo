'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'

/**
 * Mirrors the active route onto <html> so Cleo layout CSS can unlock the
 * shell as soon as pathname leaves /cleo — even while a view transition still
 * keeps the old chat DOM mounted (body:has([data-cleo-*]) would stay locked).
 */
function isCleoPath(pathname: string) {
  return pathname === '/cleo' || pathname.startsWith('/cleo/')
}

export function CleoRouteAttribute() {
  const isCleo = isCleoPath(unlocalizedPathname(usePathname()))

  useEffect(() => {
    const root = document.documentElement

    if (isCleo) {
      root.setAttribute('data-cleo-route', '')
    } else {
      root.removeAttribute('data-cleo-route')
      root.removeAttribute('data-cleo-empty')
    }

    return () => {
      root.removeAttribute('data-cleo-route')
      root.removeAttribute('data-cleo-empty')
    }
  }, [isCleo])

  return null
}
