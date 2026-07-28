import Link from 'next/link'

import { GuideIndexFilter } from '~/components/guide-index-filter'
import { PixelCluster } from '~/components/pixel-cluster'
import { countriesByRegion } from '~/lib/countries'
import { T } from '~/lib/i18n'
import { matchesIndexQuery } from '~/lib/index-filter'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function explorePageMetadata() {
  const copy = publicPageMetadata.explore
  return localeMetadata({
    path: '/explore',
    title: copy.title,
    description: copy.description,
  })
}

export function ExplorePageView({
  initialQuery = '',
}: {
  initialQuery?: string
}) {
  const regions = countriesByRegion()
  let totalVisible = 0

  const renderedRegions = regions.map(([region, regionCountries]) => {
    const center = (regionCountries.length - 1) / 2
    const rows = regionCountries.map((country, index) => {
      const searchText = [
        country.name,
        country.code,
        country.region,
        country.subregion,
      ].join(' ')
      const visible = matchesIndexQuery(searchText, initialQuery)
      if (visible) totalVisible += 1
      return { country, index, searchText, visible }
    })
    const visibleCount = rows.filter((row) => row.visible).length

    return { region, center, rows, visibleCount }
  })

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="探索" en="Explore" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.explore.description}
          </p>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <div className="mt-10" data-guide-index>
        <GuideIndexFilter
          label="Search countries"
          placeholder="Country, code, or region"
          initialQuery={initialQuery}
        />

        <div className="flex flex-col gap-10">
          {renderedRegions.map(({ region, center, rows, visibleCount }) => (
            <section
              key={region}
              aria-labelledby={`region-${region}`}
              data-guide-section
              hidden={visibleCount === 0 || undefined}
            >
              <h2
                id={`region-${region}`}
                className="enter text-sm font-medium text-muted-foreground"
              >
                {region}
                <span
                  className="ml-2 tabular-nums text-muted-foreground/70"
                  data-guide-count
                >
                  {visibleCount}
                </span>
              </h2>
              <ul className="focus-list mt-2 flex flex-col">
                {rows.map(({ country, index, searchText, visible }) => (
                  <li
                    key={country.slug}
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
                      href={`/explore/${country.slug}`}
                      className="country-row hairline-top group"
                    >
                      <span className="country-code text-muted-foreground tabular-nums">
                        {country.code}
                      </span>
                      <span className="country-name font-medium">{country.name}</span>
                      <span className="country-subregion text-muted-foreground">
                        {country.subregion}
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
          No countries match that search.
        </p>
      </div>
    </div>
  )
}
