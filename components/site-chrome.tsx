import type { ReactNode } from 'react'

/**
 * Public page shell. Cleo locks to the viewport via CSS `:has([data-cleo-surface])`
 * so path-based conditional wrappers never remount the chat tree mid-request.
 */
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
