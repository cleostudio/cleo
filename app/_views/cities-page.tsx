import Link from 'next/link'

import { PixelCluster } from '~/components/pixel-cluster'
import { citySubjectsByCategory } from '~/lib/cities'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function citiesPageMetadata() {
  const copy = publicPageMetadata.cities
  return localeMetadata({
    path: '/cities',
    title: copy.title,
    description: copy.description,
  })
}

export function CitiesPageView() {
  const categories = citySubjectsByCategory()

  return (
    <div className="page-stack mx-auto w-full max-w-content">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">Cities</h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.cities.description}
          </p>
        </header>
        <PixelCluster variant={6} className="enter shrink-0" />
      </div>

      {categories.map(([category, subjects]) => {
        const center = (subjects.length - 1) / 2

        return (
          <section key={category} aria-labelledby={`cities-${category}`}>
            <h2
              id={`cities-${category}`}
              className="enter text-sm font-medium text-muted-foreground"
            >
              {category}
              <span className="ml-2 tabular-nums text-muted-foreground/70">
                {subjects.length}
              </span>
            </h2>
            <ul className="focus-list page-section-body flex flex-col">
              {subjects.map((subject, index) => (
                <li
                  key={subject.slug}
                  className="enter-swing"
                  style={
                    {
                      '--enter-delay': `${80 + Math.min(Math.abs(index - center), 12) * 18}ms`,
                    } as React.CSSProperties
                  }
                >
                  <Link
                    href={`/cities/${subject.slug}`}
                    className="country-row hairline-top group"
                  >
                    <span className="country-code text-muted-foreground tabular-nums">
                      {subject.code}
                    </span>
                    <span className="country-name font-medium">
                      {subject.name}
                    </span>
                    <span className="country-subregion text-muted-foreground">
                      {subject.facts.kind}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
