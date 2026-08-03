import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuidePhotoCollection } from '~/components/guide-photo-collection'
import { GuideAbout } from '~/components/guide-about'
import { PixelCluster } from '~/components/pixel-cluster'
import {
  civilizationDescription,
  civilizationSubjectSlugs,
  getCivilizationSubject,
} from '~/lib/civilizations'
import { getCountryByName } from '~/lib/countries'
import { localeMetadata } from '~/lib/locale-metadata'

export function civilizationSubjectStaticParams() {
  return civilizationSubjectSlugs().map((slug) => ({ slug }))
}

export function civilizationSubjectMetadata(slug: string) {
  const subject = getCivilizationSubject(slug)
  if (!subject) return {}

  return localeMetadata({
    path: `/civilizations/${subject.slug}`,
    title: subject.name,
    description: civilizationDescription(subject).slice(0, 160),
  })
}

export function CivilizationSubjectPageView({ slug }: { slug: string }) {
  const subject = getCivilizationSubject(slug)
  if (!subject) notFound()

  return (
    <article className="field-guide mx-auto w-full max-w-content">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">
            <Link href="/civilizations" className="hover:text-foreground">
              Civilizations
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
        <PixelCluster variant={7} className="enter shrink-0" />
      </div>

      <GuidePhotoCollection
        collection="civilizations"
        subject={subject.name}
        sourceLabel="Wikimedia Commons"
        photos={subject.photos.map((photo) => ({
          ...photo,
          title: photo.featureName,
        }))}
      />

      <section
        className="enter mt-10"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
        aria-labelledby="civilization-about"
      >
        <h2 id="civilization-about" className="guide-label">
          About
        </h2>
        <GuideAbout about={subject.about} />
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="civilization-features"
      >
        <h2 id="civilization-features" className="guide-label">
          Features
        </h2>
        <ol className="mt-3 flex flex-col">
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
        className="enter mt-12"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
        aria-labelledby="civilization-facts"
      >
        <h2 id="civilization-facts" className="guide-label">
          Fact plate
        </h2>
        <dl className="spec-plate spec-plate-guide mt-3">
          <div>
            <dt>Kind</dt>
            <dd>
              <span className="spec-signal" aria-hidden />
              {subject.facts.kind}
            </dd>
          </div>
          <div>
            <dt>Heartland</dt>
            <dd>{subject.facts.heartland}</dd>
          </div>
          <div>
            <dt>Era</dt>
            <dd>{subject.facts.era}</dd>
          </div>
          <div>
            <dt>Peak</dt>
            <dd>{subject.facts.peak}</dd>
          </div>
          <div>
            <dt>Writing</dt>
            <dd>{subject.facts.writing}</dd>
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
        className="enter mt-12"
        style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        aria-labelledby="civilization-sources"
      >
        <h2 id="civilization-sources" className="guide-label">
          Sources
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
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
        className="enter mt-10 mb-4"
        style={{ '--enter-delay': '180ms' } as React.CSSProperties}
      >
        <Link
          href="/civilizations"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All Civilizations
        </Link>
      </p>
    </article>
  )
}
