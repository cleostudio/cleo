import Link from 'next/link'

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

export function ExplorePageView() {
  const regions = countriesByRegion()

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="探索" en="Explore" />
          </h1>
          <p
            className="enter mt-3 text-sm text-muted-foreground"
            style={{ '--enter-delay': '50ms' } as React.CSSProperties}
          >
            <Link href="/world" className="hover:text-foreground">
              Open the interactive World globe →
            </Link>
          </p>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {regions.map(([region, regionCountries]) => {
          const center = (regionCountries.length - 1) / 2

          return (
            <section key={region} aria-labelledby={`region-${region}`}>
              <h2
                id={`region-${region}`}
                className="enter text-sm font-medium text-muted-foreground"
              >
                {region}
                <span className="ml-2 tabular-nums text-muted-foreground/70">
                  {regionCountries.length}
                </span>
              </h2>
              <ul className="focus-list mt-2 flex flex-col">
                {regionCountries.map((country, index) => (
                  <li
                    key={country.slug}
                    className="enter-swing"
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
    </div>
  )
}
