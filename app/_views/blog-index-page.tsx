import { GeistPixelSquare } from 'geist/font/pixel'

import { GuideIndexFilter } from '~/components/guide-index-filter'
import { WritingInkStage } from '~/components/hidden-list-stage'
import { PixelCluster } from '~/components/pixel-cluster'
import { PostRow } from '~/components/post-row'
import { RevealScope } from '~/components/reveal-scope'
import { getAllPosts } from '~/lib/content'
import { T } from '~/lib/i18n'
import { matchesIndexQuery } from '~/lib/index-filter'
import type { Locale } from '~/lib/locale-route'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function BlogIndexPageView({
  locale,
  initialQuery = '',
}: {
  locale: Locale
  initialQuery?: string
}) {
  const posts = getAllPosts()
  const postsByYear = new Map<number, typeof posts>()

  for (const post of posts) {
    const year = post.publishedAt.getUTCFullYear()
    const yearPosts = postsByYear.get(year)

    if (yearPosts) yearPosts.push(post)
    else postsByYear.set(year, [post])
  }

  let totalVisible = 0
  const renderedYears = [...postsByYear].map(([year, yearPosts]) => {
    const center = (yearPosts.length - 1) / 2
    const rows = yearPosts.map((post, index) => {
      const searchText = [post.titleEn, post.descriptionEn].join(' ')
      const visible = matchesIndexQuery(searchText, initialQuery)
      if (visible) totalVisible += 1
      return { post, index, searchText, visible }
    })
    const visibleCount = rows.filter((row) => row.visible).length

    return { year, center, rows, visibleCount }
  })

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="enter flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow">
            <T zh="写作" en="Writing" />
          </h1>
          <p className="page-introduction mt-4 text-balance">
            {publicPageMetadata.blog.description}
          </p>
        </header>
        <PixelCluster variant={1} className="shrink-0" />
      </div>

      <div className="mt-6" data-guide-index>
        <GuideIndexFilter
          label="Search writing"
          placeholder="Essay title or topic"
          initialQuery={initialQuery}
          noun="essays"
          nounOne="essay"
        />

        <p
          className="mb-4 text-sm text-muted-foreground"
          data-guide-status
          hidden={!initialQuery.trim() || totalVisible === 0 || undefined}
          aria-live="polite"
        >
          {initialQuery.trim() && totalVisible > 0
            ? `Showing ${totalVisible} ${totalVisible === 1 ? 'essay' : 'essays'}`
            : ''}
        </p>

        <WritingInkStage contentClassName="flex flex-col gap-8">
          {renderedYears.map(({ year, center, rows, visibleCount }) => (
            <section
              key={year}
              aria-labelledby={`posts-${year}`}
              className="relative"
              data-guide-section
              hidden={visibleCount === 0 || undefined}
            >
              <span
                aria-hidden
                className={`ghost-folio ${GeistPixelSquare.className}`}
              >
                {String(year).slice(2)}
              </span>
              <h2
                id={`posts-${year}`}
                className="enter text-sm font-medium text-muted-foreground tabular-nums"
              >
                {year}
                <span
                  className="ml-2 tabular-nums text-muted-foreground/70"
                  data-guide-count
                >
                  {visibleCount}
                </span>
              </h2>
              <RevealScope as="ul" className="focus-list mt-2 flex flex-col">
                {rows.map(({ post, index, searchText, visible }) => (
                  <li
                    key={post.slug}
                    className="enter-swing"
                    data-guide-item
                    data-search-text={searchText}
                    hidden={!visible || undefined}
                    style={
                      {
                        '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <PostRow
                      post={post}
                      headingLevel="h3"
                      dateStyle="month-day"
                      locale={locale}
                      listStageId={post.slug}
                    />
                  </li>
                ))}
              </RevealScope>
            </section>
          ))}
        </WritingInkStage>

        <p
          className="mt-6 text-sm text-muted-foreground"
          data-guide-empty
          hidden={totalVisible !== 0 || undefined}
          aria-live="polite"
        >
          No essays match that search.
        </p>
      </div>
    </div>
  )
}
