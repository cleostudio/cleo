import Link from 'next/link'

import { HomeCountrySearch } from '~/components/home-country-search'
import { HomeHighlightedPlaces } from '~/components/home-highlighted-places'
import { HomeIntroduction } from '~/components/home-introduction'
import { PixelCluster } from '~/components/pixel-cluster'
import { highlightedAtlasEntries } from '~/lib/atlas'
import { countries } from '~/lib/countries'
import { T } from '~/lib/i18n'
import { allTopics } from '~/lib/topics'
import type { Locale } from '~/lib/locale-route'

function SectionTitle({
  index,
  children,
  delay,
}: {
  index: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <h2
      className="section-tag enter"
      style={{ '--enter-delay': `${delay}ms` } as React.CSSProperties}
    >
      <span className="section-tag-index" aria-hidden>
        {index}
      </span>
      <span className="section-tag-hatch" aria-hidden />
      <span className="section-tag-label">{children}</span>
    </h2>
  )
}

export async function HomePageView({ locale: _locale }: { locale: Locale }) {
  const topics = allTopics()
  const highlights = highlightedAtlasEntries(6)
  const center = (topics.length - 1) / 2

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="enter max-w-content-narrow">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold tracking-tight text-foreground">Cleo</h1>
          <PixelCluster variant={2} className="shrink-0" />
        </div>
        <div className="mt-4">
          <HomeIntroduction />
        </div>
      </div>

      <section className="mt-12" aria-labelledby="home-search-heading">
        <SectionTitle index="01" delay={100}>
          <span id="home-search-heading">
            <T zh="国家检索" en="Country search" />
          </span>
        </SectionTitle>
        <div className="enter mt-4" style={{ '--enter-delay': '130ms' } as React.CSSProperties}>
          <HomeCountrySearch countries={countries} />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="home-places-heading">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle index="02" delay={160}>
            <span id="home-places-heading">
              <T zh="精选地点" en="Highlighted places" />
            </span>
          </SectionTitle>
          <Link
            href="/gallery"
            className="enter relative shrink-0 text-sm text-muted-foreground transition-colors duration-150 ease-[ease] after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
            style={{ '--enter-delay': '160ms' } as React.CSSProperties}
          >
            <T zh="全部图库" en="Full gallery" />
          </Link>
        </div>
        <div className="enter mt-5" style={{ '--enter-delay': '190ms' } as React.CSSProperties}>
          <HomeHighlightedPlaces entries={highlights} />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="home-topics-heading">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle index="03" delay={220}>
            <span id="home-topics-heading">
              <T zh="主题发现" en="Topic discovery" />
            </span>
          </SectionTitle>
          <Link
            href="/topics"
            className="enter relative shrink-0 text-sm text-muted-foreground transition-colors duration-150 ease-[ease] after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
            style={{ '--enter-delay': '220ms' } as React.CSSProperties}
          >
            <T zh="全部主题" en="All topics" />
          </Link>
        </div>
        <ul className="focus-list mt-4 flex flex-col">
          {topics.map((topic, index) => (
            <li
              key={topic.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${250 + Math.abs(index - center) * 40}ms`,
                } as React.CSSProperties
              }
            >
              <div className="topic-row hairline-top">
                <Link href={topic.href} className="topic-primary group">
                  <span className="topic-index tabular-nums text-muted-foreground" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="topic-identity">
                    <span className="topic-name font-medium text-foreground">{topic.name}</span>
                    <span className="topic-tally text-muted-foreground">{topic.tally}</span>
                  </span>
                  <span className="topic-description text-muted-foreground">
                    {topic.description}
                  </span>
                </Link>
                {topic.secondaryHref && topic.secondaryLabel ? (
                  <p className="topic-secondary">
                    <Link
                      href={topic.secondaryHref}
                      className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {topic.secondaryLabel} →
                    </Link>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
