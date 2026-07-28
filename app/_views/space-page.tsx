import Link from 'next/link'

import { PixelCluster } from '~/components/pixel-cluster'
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

export function SpacePageView() {
  const categories = spaceSubjectsByCategory()

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">Reference articles</p>
          <h1
            className="enter mt-4 text-2xl font-semibold tracking-tight text-foreground text-balance"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            Space
          </h1>
          <p
            className="page-introduction enter mt-3 text-balance"
            style={{ '--enter-delay': '55ms' } as React.CSSProperties}
          >
            {publicPageMetadata.space.description}
          </p>
        </header>
        <PixelCluster variant={6} className="enter shrink-0" />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {categories.map(([category, subjects]) => {
          const center = (subjects.length - 1) / 2

          return (
            <section key={category} aria-labelledby={`space-${category}`}>
              <h2
                id={`space-${category}`}
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
          )
        })}
      </div>
    </div>
  )
}
