import Link from 'next/link'

import { GuideIndexFilter } from '~/components/guide-index-filter'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { matchesIndexQuery } from '~/lib/index-filter'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { spaceSubjectsByCategory } from '~/lib/space'

export function spacePageMetadata() {
  const copy = publicPageMetadata.space
  return localeMetadata({
    path: '/space',
    title: copy.title,
    description: copy.description,
  })
}

export function SpacePageView({
  initialQuery = '',
}: {
  initialQuery?: string
}) {
  const categories = spaceSubjectsByCategory()
  let totalVisible = 0

  const renderedCategories = categories.map(([category, subjects]) => {
    const center = (subjects.length - 1) / 2
    const rows = subjects.map((subject, index) => {
      const searchText = [
        subject.name,
        subject.code,
        subject.category,
        subject.facts.kind,
        subject.subtitle,
      ].join(' ')
      const visible = matchesIndexQuery(searchText, initialQuery)
      if (visible) totalVisible += 1
      return { subject, index, searchText, visible }
    })
    const visibleCount = rows.filter((row) => row.visible).length

    return { category, center, rows, visibleCount }
  })

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="太空" en="Space" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.space.description}
          </p>
        </header>
        <PixelCluster variant={6} className="enter shrink-0" />
      </div>

      <div className="mt-10" data-guide-index>
        <GuideIndexFilter
          label="Search space guides"
          placeholder="Planet, moon, or deep-space body"
          initialQuery={initialQuery}
          noun="space guides"
        />

        <p
          className="mb-4 text-sm text-muted-foreground"
          data-guide-status
          hidden={!initialQuery.trim() || totalVisible === 0 || undefined}
          aria-live="polite"
        >
          {initialQuery.trim() && totalVisible > 0
            ? `Showing ${totalVisible} space guides`
            : ''}
        </p>

        <div className="flex flex-col gap-10">
          {renderedCategories.map(({ category, center, rows, visibleCount }) => (
            <section
              key={category}
              aria-labelledby={`space-${category}`}
              data-guide-section
              hidden={visibleCount === 0 || undefined}
            >
              <h2
                id={`space-${category}`}
                className="enter text-sm font-medium text-muted-foreground"
              >
                {category}
                <span
                  className="ml-2 tabular-nums text-muted-foreground/70"
                  data-guide-count
                >
                  {visibleCount}
                </span>
              </h2>
              <ul className="focus-list mt-2 flex flex-col">
                {rows.map(({ subject, index, searchText, visible }) => (
                  <li
                    key={subject.slug}
                    className="enter-swing"
                    data-guide-item
                    data-search-text={searchText}
                    hidden={!visible || undefined}
                    style={
                      {
                        '--enter-delay': `${80 + Math.min(Math.abs(index - center), 12) * 18}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <Link
                      href={`/space/${subject.slug}`}
                      className="country-row hairline-top group"
                    >
                      <span className="country-code text-muted-foreground tabular-nums">
                        {subject.code}
                      </span>
                      <span className="country-name font-medium">{subject.name}</span>
                      <span className="country-subregion text-muted-foreground">
                        {subject.facts.kind}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p
          className="mt-6 text-sm text-muted-foreground"
          data-guide-empty
          hidden={totalVisible !== 0 || undefined}
          aria-live="polite"
        >
          No space guides match that search.
        </p>
      </div>
    </div>
  )
}
