import Link from 'next/link'
import type { Metadata } from 'next'

import { T } from '~/lib/i18n'
import { localeRoutePair } from '~/lib/locale-metadata'
import { localePath, type Locale } from '~/lib/locale-route'
import { nonPublicRobots } from '~/lib/non-public-metadata'

const retiredCopy = {
  title: 'Newsletter confirmation is retired',
  description:
    'This old link no longer reads or updates subscriber information. The newsletter service has ended, but site updates remain available through RSS.',
} as const

export function newsletterRetiredMetadata(_locale: Locale = 'en'): Metadata {
  const { title, description } = retiredCopy
  const pair = localeRoutePair('/confirm/retired')

  return {
    title,
    description,
    alternates: { languages: pair.languages },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Cleo',
      url: pair.en,
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: nonPublicRobots,
  }
}

export function NewsletterRetiredPageView({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto box-border w-full max-w-[42rem] px-6">
      <section
        className="hairline-y py-8"
        aria-labelledby="newsletter-retired-title"
      >
        <p className="font-mono text-sm tracking-[-0.011em] text-muted-foreground">
          <T zh="确认链接已停用" en="CONFIRMATION_RETIRED" />
        </p>
        <h1
          id="newsletter-retired-title"
          className="mt-4 text-sm font-semibold tracking-[-0.011em]"
        >
          <T zh={retiredCopy.title} en={retiredCopy.title} />
        </h1>
        <p className="mt-3 max-w-[32rem] text-sm leading-relaxed text-muted-foreground">
          <T zh={retiredCopy.description} en={retiredCopy.description} />
        </p>
        <nav
          className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm"
          aria-label="Newsletter options"
        >
          <a
            href="/feed.xml"
            className="underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            <T zh="打开 RSS" en="Open RSS" />
          </a>
          <Link
            href={localePath(locale, '/')}
            className="underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            <T zh="返回首页" en="Return home" />
          </Link>
        </nav>
      </section>
    </div>
  )
}
