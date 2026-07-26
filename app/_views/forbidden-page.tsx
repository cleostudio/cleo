import Link from 'next/link'

import { T } from '~/lib/i18n'

export function ForbiddenPageView() {
  return (
    <div className="mx-auto w-full max-w-content px-6">
      <section aria-labelledby="forbidden-title" className="mx-auto max-w-sm">
        <p className="text-sm text-muted-foreground">ERROR / 403</p>
        <h1 id="forbidden-title" className="mt-3 text-sm font-semibold">
          <T zh="你没有访问这个页面的权限。" en="You do not have access to this page." />
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          <T
            zh="请返回首页继续浏览。"
            en="Return home to keep browsing."
          />
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground shadow-[0_0_0_1px_var(--border)] outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <T zh="返回首页" en="Go home" />
        </Link>
      </section>
    </div>
  )
}
