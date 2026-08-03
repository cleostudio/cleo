import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuidePhotoCollection } from '~/components/guide-photo-collection'
import { GuideAbout } from '~/components/guide-about'
import { PixelCluster } from '~/components/pixel-cluster'
import { getCountryByName } from '~/lib/countries'
import { localeMetadata } from '~/lib/locale-metadata'
import {
  getRiverSubject,
  riverDescription,
  riverSubjectSlugs,
} from '~/lib/rivers'

export function riverSubjectStaticParams() {
  return riverSubjectSlugs().map((slug) => ({ slug }))
}

export function riverSubjectMetadata(slug: string) {
  const subject = getRiverSubject(slug)
  if (!subject) return {}

  return localeMetadata({
    path: `/rivers/${subject.slug}`,
    title: subject.name,
    description: riverDescription(subject).slice(0, 160),
  })
}

export function RiverSubjectPageView({ slug }: { slug: string }) {
  const subject = getRiverSubject(slug)
  if (!subject) notFound()

  return (
    <article className="field-guide mx-auto w-full max-w-content">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">
            <Link href="/rivers" className="hover:text-foreground">
              Rivers
            </Link>
            <span aria-hidden className="mx-2 text-muted-foreground/50">
              /
            </span>
            <span className="tabular-nums">{subject.code}</span>
          </p>
          <h1
            className="enter mt-4 text-2xl font-semibold tracking-tight text-foreground text-balance"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            {subject.name}
          </h1>
          <p
            className="enter mt-2 text-sm text-muted-foreground"
            style={{ '--enter-delay': '55ms' } as React.CSSProperties}
          >
            {subject.subtitle}
          </p>
        </header>
        <PixelCluster variant={3} className="enter shrink-0" />
      </div>

      <GuidePhotoCollection
        collection="rivers"
        subject={subject.name}
        sourceLabel="Wikimedia Commons"
        photos={subject.photos.map((photo) => ({
          ...photo,
          title: photo.featureName,
        }))}
      />

      <section
        className="enter"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
        aria-labelledby="river-about"
      >
        <h2 id="river-about" className="guide-label">
          About
        </h2>
        <GuideAbout about={subject.about} />
      </section>

      <section
        className="enter"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="river-features"
      >
        <h2 id="river-features" className="guide-label">
          Features
        </h2>
        <ol className="page-section-body flex flex-col">
          {subject.features.map((feature, index) => (
            <li
              key={feature.name}
              className="hairline-top grid grid-cols-[2rem_1fr] gap-3 py-3 text-sm"
            >
              <span className="tabular-nums text-muted-foreground" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-medium text-foreground">{feature.name}</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="enter"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
        aria-labelledby="river-facts"
      >
        <h2 id="river-facts" className="guide-label">
          Fact plate
        </h2>
        <dl className="spec-plate spec-plate-guide page-section-body">
          <div>
            <dt>Kind</dt>
            <dd>
              <span className="spec-signal" aria-hidden />
              {subject.facts.kind}
            </dd>
          </div>
          <div>
            <dt>Course</dt>
            <dd>{subject.facts.course}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>{subject.facts.region}</dd>
          </div>
          <div>
            <dt>Hydrology</dt>
            <dd>{subject.facts.hydrology}</dd>
          </div>
          <div>
            <dt>Basin</dt>
            <dd>{subject.facts.basin}</dd>
          </div>
          <div>
            <dt>Climate role</dt>
            <dd>{subject.facts.climateRole}</dd>
          </div>
          <div>
            <dt>Explore</dt>
            <dd>
              {subject.facts.exploreLinks.map((name, index) => {
                const country = getCountryByName(name)
                const separator =
                  index < subject.facts.exploreLinks.length - 1 ? ', ' : null
                if (!country) {
                  return (
                    <span key={name}>
                      {name}
                      {separator}
                    </span>
                  )
                }
                return (
                  <span key={country.slug}>
                    <Link
                      href={`/explore/${country.slug}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {country.name}
                    </Link>
                    {separator}
                  </span>
                )
              })}
            </dd>
          </div>
          <div>
            <dt>Catalog</dt>
            <dd>{subject.code}</dd>
          </div>
        </dl>
      </section>

      <section
        className="enter"
        style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        aria-labelledby="river-sources"
      >
        <h2 id="river-sources" className="guide-label">
          Sources
        </h2>
        <ul className="page-section-body flex flex-col gap-2 text-sm">
          {subject.sources.map((source) => (
            <li key={source.url} className="hairline-top pt-2">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline-offset-2 hover:underline"
              >
                {source.label}
              </a>
              <span className="ml-2 text-xs uppercase tracking-wide text-muted-foreground">
                {source.kind}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p
        className="enter mb-4"
        style={{ '--enter-delay': '180ms' } as React.CSSProperties}
      >
        <Link
          href="/rivers"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All Rivers
        </Link>
      </p>
    </article>
  )
}
