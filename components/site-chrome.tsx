'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { unlocalizedPathname } from '~/lib/locale-route'
import { cn } from '~/lib/utils'

/** Public page shell: full document scroll everywhere except the Cleo chat surface. */
export function SiteChrome({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  const isCleo = unlocalizedPathname(usePathname()) === '/cleo'

  return (
    <div
      className={cn(
        'flex flex-col',
        isCleo ? 'h-svh overflow-hidden' : 'min-h-screen pb-20',
      )}
    >
      <main
        className={cn(
          isCleo ? 'relative min-h-0 flex-1' : 'flex-1 pt-14',
        )}
      >
        {isCleo ? (
          <div className="absolute inset-0 flex flex-col">{children}</div>
        ) : (
          children
        )}
      </main>
      {footer}
    </div>
  )
}
