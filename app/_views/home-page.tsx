import Link from 'next/link'

import { HomeHighlightedPlaces } from '~/components/home-highlighted-places'
import { HomeSiteSearch } from '~/components/home-site-search'
import { GalleryNavCard, NavCards } from '~/components/nav-cards'
import { HOME_MASTHEAD_VARIANT, PixelCluster } from '~/components/pixel-cluster'
import { PostRow } from '~/components/post-row'
import { highlightedAtlasEntries } from '~/lib/atlas'
import { getAllPosts } from '~/lib/content'
import { countries } from '~/lib/countries'
import { T } from '~/lib/i18n'
import type { Locale } from '~/lib/locale-route'
import {
  buildSiteSearchHits,
  siteSearchSpotlightIds,
} from '~/lib/site-search-catalog'
import { allTopics } from '~/lib/topics'

const HOME_WRITING_POST_COUNT = 5

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

function SectionLink({
  href,
  delay,
  children,
}: {
  href: string
  delay: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="enter relative shrink-0 text-sm text-muted-foreground transition-colors duration-150 ease-[ease] after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
      style={{ '--enter-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Link>
  )
}

export async function HomePageView({ locale }: { locale: Locale }) {
  const topics = allTopics()
  const posts = getAllPosts()
  const highlights = highlightedAtlasEntries(6)
  const writingPosts = posts.slice(0, HOME_WRITING_POST_COUNT)
  const searchHits = buildSiteSearchHits()
  const topicCenter = (topics.length - 1) / 2
  const writingCenter = (writingPosts.length - 1) / 2

  return (
    <div className="home-page mx-auto w-full max-w-content">
      <div className="home-portal">
        <div className="enter max-w-content-narrow">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-foreground">Cleo</h1>
            <PixelCluster variant={HOME_MASTHEAD_VARIANT} className="shrink-0" />
          </div>
        </div>

        <NavCards
          postCount={posts.length}
          exploreCount={countries.length}
          topicCount={topics.length}
          locale={locale}
          photoCard={<GalleryNavCard locale={locale} />}
        />

        <section aria-label="Search">
          <div className="enter" style={{ '--enter-delay': '100ms' } as React.CSSProperties}>
            <HomeSiteSearch
              hits={searchHits}
              spotlightIds={siteSearchSpotlightIds(searchHits)}
            />
          </div>
        </section>
      </div>

      <section aria-labelledby="home-places-heading">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle index="01" delay={160}>
            <span id="home-places-heading">
              <T zh="精选地点" en="Highlighted places" />
            </span>
          </SectionTitle>
          <SectionLink href="/gallery" delay={160}>
            <T zh="全部图库" en="Full gallery" />
          </SectionLink>
        </div>
        <div className="enter mt-4" style={{ '--enter-delay': '190ms' } as React.CSSProperties}>
          <HomeHighlightedPlaces entries={highlights} />
        </div>
      </section>

      <section aria-labelledby="home-topics-heading">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle index="02" delay={220}>
            <span id="home-topics-heading">
              <T zh="主题发现" en="Topic discovery" />
            </span>
          </SectionTitle>
          <SectionLink href="/topics" delay={220}>
            <T zh="全部主题" en="All topics" />
          </SectionLink>
        </div>
        <ul className="focus-list mt-4 flex flex-col">
          {topics.map((topic, index) => (
            <li
              key={topic.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${250 + Math.abs(index - topicCenter) * 40}ms`,
                } as React.CSSProperties
              }
            >
              <Link href={topic.href} className="topic-row hairline-top group block">
                <span className="topic-primary">
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
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {writingPosts.length > 0 && (
        <section aria-labelledby="home-writing-heading">
          <div className="flex items-center justify-between gap-4">
            <SectionTitle index="03" delay={300}>
              <span id="home-writing-heading">
                <T zh="写作" en="Writing" />
              </span>
            </SectionTitle>
            <SectionLink href="/blog" delay={300}>
              <T zh="全部写作" en="All writing" />
            </SectionLink>
          </div>
          <ul className="focus-list mt-4 flex flex-col">
            {writingPosts.map((post, index) => (
              <li
                key={post.slug}
                className="enter-swing"
                style={
                  {
                    '--enter-delay': `${330 + Math.abs(index - writingCenter) * 40}ms`,
                  } as React.CSSProperties
                }
              >
                <PostRow
                  post={post}
                  headingLevel="h3"
                  dateStyle="short"
                  locale={locale}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
