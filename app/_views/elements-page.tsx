import Link from 'next/link'

import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { elementSubjectsByCategory } from '~/lib/elements'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function elementsPageMetadata() {
  const copy = publicPageMetadata.elements
  return localeMetadata({
    path: '/elements',
    title: copy.title,
    description: copy.description,
  })
}

export function ElementsPageView() {
  const categories = elementSubjectsByCategory()

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="元素" en="Elements" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.elements.description}
          </p>
        </header>
        <PixelCluster variant={5} className="enter shrink-0" />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {categories.map(([category, subjects]) => {
          const center = (subjects.length - 1) / 2

          return (
            <section key={category} aria-labelledby={`elements-${category}`}>
              <h2
                id={`elements-${category}`}
                className="enter text-sm font-medium text-muted-foreground"
              >
                {category}
                <span className="ml-2 tabular-nums text-muted-foreground/70">
                  {subjects.length}
                </span>
              </h2>
              <ul className="focus-list mt-2 flex flex-col">
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
                      href={`/elements/${subject.slug}`}
                      className="country-row hairline-top group"
                    >
                      <span className="country-code text-muted-foreground tabular-nums">
                        {subject.code}
                      </span>
                      <span className="country-name font-medium">{subject.name}</span>
                      <span className="country-subregion text-muted-foreground">
                        Z = {subject.facts.atomicNumber}
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
