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
      {/* Horizontal padding lives on the shell so max-w-content is the true
          column edge — same line the homepage doorway card borders use. */}
      <main className="site-chrome-main flex-1 px-6 pt-14">{children}</main>
      <div className="site-chrome-footer px-6">{footer}</div>
    </div>
  )
}
