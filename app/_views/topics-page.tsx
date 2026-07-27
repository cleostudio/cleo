import Link from 'next/link'

import { GhostSchematic } from '~/components/ghost-schematic'
import { TopicsBlueprintStage } from '~/components/hidden-list-stage'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
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
    <div className="relative mx-auto w-full max-w-content px-6">
      <GhostSchematic className="top-4 right-6 hidden w-56 sm:block" />
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="主题" en="Topics" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.topics.description}
          </p>
        </header>
        <PixelCluster variant={3} className="enter shrink-0" />
      </div>

      <TopicsBlueprintStage className="mt-10">
        <ul className="focus-list flex flex-col">
          {topics.map((topic, index) => (
            <li
              key={topic.slug}
              className="enter-swing"
              style={
                {
                  '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
                } as React.CSSProperties
              }
            >
              <div
                className="topic-row hairline-top"
                data-list-stage-row
                data-list-stage-id={topic.slug}
              >
                <Link href={topic.href} className="topic-primary group">
                  <span
                    className="topic-index tabular-nums text-muted-foreground"
                    aria-hidden
                    data-list-stage-anchor
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
      </TopicsBlueprintStage>
    </div>
  )
}
