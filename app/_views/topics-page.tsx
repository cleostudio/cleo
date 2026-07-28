import Link from 'next/link'

import { PixelCluster } from '~/components/pixel-cluster'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { allTopics } from '~/lib/topics'

export function topicsPageMetadata() {
  const copy = publicPageMetadata.topics
  return localeMetadata({
    path: '/topics',
    title: copy.title,
    description: copy.description,
  })
}

export function TopicsPageView() {
  const topics = allTopics()
  const center = (topics.length - 1) / 2

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">Reference library</p>
          <h1
            className="enter mt-4 text-2xl font-semibold tracking-tight text-foreground text-balance"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            Topics
          </h1>
          <p
            className="page-introduction enter mt-3 text-balance"
            style={{ '--enter-delay': '55ms' } as React.CSSProperties}
          >
            Browse concise, sourced articles on countries, space, and the subjects that connect
            them.
          </p>
        </header>
        <PixelCluster variant={3} className="enter shrink-0" />
      </div>

      <section className="mt-10" aria-labelledby="topic-collections">
        <h2 id="topic-collections" className="sr-only">
          Reference collections
        </h2>
        <ul className="focus-list flex flex-col">
          {topics.map((topic, index) => (
            <li
              key={topic.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${100 + Math.abs(index - center) * 50}ms`,
                } as React.CSSProperties
              }
            >
              <div className="topic-row hairline-top">
                <Link href={topic.href} className="topic-primary group">
                  <span
                    className="topic-index tabular-nums text-muted-foreground"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="topic-identity">
                    <span className="topic-name font-medium text-foreground">
                      {topic.name}
                    </span>
                    <span className="topic-tally text-muted-foreground">
                      {topic.tally}
                    </span>
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
