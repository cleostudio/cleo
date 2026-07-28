import Link from 'next/link'

import { GuideIndexFilter } from '~/components/guide-index-filter'
import { PixelCluster } from '~/components/pixel-cluster'
import { countriesByRegion } from '~/lib/countries'
import { T } from '~/lib/i18n'
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
          {regions.map(([region, regionCountries]) => {
            const center = (regionCountries.length - 1) / 2

            return (
              <section
                key={region}
                aria-labelledby={`region-${region}`}
                data-guide-section
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
                    {regionCountries.length}
                  </span>
                </h2>
                <ul className="focus-list mt-2 flex flex-col">
                  {regionCountries.map((country, index) => (
                    <li
                      key={country.slug}
                      className="enter-swing"
                      data-guide-item
                      data-search-text={[
                        country.name,
                        country.code,
                        country.region,
                        country.subregion,
                      ].join(' ')}
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
            )
          })}
        </div>

        <p
          className="mt-6 text-sm text-muted-foreground"
          data-guide-empty
          hidden
          aria-live="polite"
        >
          No countries match that search.
        </p>
      </div>
    </div>
  )
}
