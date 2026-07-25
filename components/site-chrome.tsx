import type { ReactNode } from 'react'

/** Public page shell. Cleo layout overrides use html[data-cleo-route]. */
export function SiteChrome({
  children,
  footer,
}: {
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="site-chrome flex min-h-screen flex-col pb-20">
      <main className="site-chrome-main flex-1 pt-14">{children}</main>
      {footer}
    </div>
  )
}
