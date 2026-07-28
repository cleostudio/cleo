'use client'

import Link from 'next/link'

import { T } from '~/lib/i18n'
import { localize, useLocale } from '~/lib/locale-client'
import { localePath } from '~/lib/locale-route'

const RECOVERY_LINKS = [
  { href: '/explore', zh: '探索', en: 'Explore' },
  { href: '/space', zh: '太空', en: 'Space' },
  { href: '/gallery', zh: '图库', en: 'Gallery' },
  { href: '/blog', zh: '写作', en: 'Writing' },
  { href: '/cleo', zh: '询问', en: 'Ask Cleo' },
] as const

/** Secondary destinations on the 404 proof sheet. */
export function ErrorRecoveryLinks() {
  const locale = useLocale()

  return (
    <div className="error-recovery-links" aria-label={localize(locale, '继续浏览', 'Keep browsing')}>
      {RECOVERY_LINKS.map((link) => (
        <Link key={link.href} href={localePath(locale, link.href)}>
          <T zh={link.zh} en={link.en} />
        </Link>
      ))}
    </div>
  )
}
