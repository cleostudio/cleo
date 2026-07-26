import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import { countrySlugs, getCountry } from '~/lib/countries'
import { atlasDescription, getAtlasEntry } from '~/lib/atlas'
import { localeMetadata } from '~/lib/locale-metadata'

export function exploreCountryStaticParams() {
  return countrySlugs().map((slug) => ({ slug }))
}

export function exploreCountryMetadata(slug: string) {
  const country = getCountry(slug)
  const entry = getAtlasEntry(slug)
  if (!country || !entry) return {}

  return localeMetadata({
    path: `/explore/${country.slug}`,
    title: country.name,
    description: atlasDescription(entry).slice(0, 160),
  })
}

export function ExploreCountryPageView({ slug }: { slug: string }) {
  const country = getCountry(slug)
  if (!country) notFound()
  const entry = getAtlasEntry(slug)
  if (!entry) notFound()

  const hero = entry.photo.renditions.find((r) => r.width === 1024) ?? entry.photo.renditions[0]!
  const renditions = entry.photo.renditions.map((r) => ({ src: r.src, width: r.width }))

  return (
    <article className="field-guide mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">
            <Link href="/explore" className="hover:text-foreground">
              Explore
            </Link>
            <span aria-hidden className="mx-2 text-muted-foreground/50">
              /
            </span>
            <span className="tabular-nums">{entry.code}</span>
          </p>
          <h1
            className="enter mt-4 text-2xl font-semibold tracking-tight text-foreground text-balance"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            {entry.name}
          </h1>
          <p
            className="enter mt-2 text-sm text-muted-foreground"
            style={{ '--enter-delay': '55ms' } as React.CSSProperties}
          >
            {entry.subregion} · {entry.region}
          </p>
        </header>
        <PixelCluster variant={5} className="enter shrink-0" />
      </div>

      <figure
        className="enter mt-8"
        style={{ '--enter-delay': '70ms' } as React.CSSProperties}
      >
        <ZoomImage
          src={hero.src}
          alt={entry.photo.alt}
          width={entry.photo.width}
          height={entry.photo.height}
          className="photo-frame aspect-[3/2] w-full object-cover"
          sizes="(max-width: 40rem) 100vw, 42rem"
          renditions={renditions}
          expandedContent={
            <div className="spec-plate mx-auto max-w-content px-6 text-sm text-[var(--paper)]">
              <p className="font-medium">{entry.photo.caption}</p>
              <p className="mt-1 opacity-80">
                Photo by {entry.photo.photographer} · {entry.photo.license}
              </p>
            </div>
          }
        />
        <figcaption className="guide-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
          <span>{entry.photo.caption}</span>
          <span>
            {entry.photo.photographer} ·{' '}
            <a
              href={entry.photo.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              Source
            </a>
          </span>
        </figcaption>
      </figure>

      <section
        className="enter mt-10"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
        aria-labelledby="guide-about"
      >
        <h2 id="guide-about" className="guide-label">
          Orientation
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90 text-pretty">
          {entry.about}
        </p>
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="guide-places"
      >
        <h2 id="guide-places" className="guide-label">
          Places
        </h2>
        <ol className="mt-3 flex flex-col">
          {entry.places.map((place, index) => (
            <li key={place.name} className="hairline-top grid grid-cols-[2rem_1fr] gap-3 py-3 text-sm">
              <span className="tabular-nums text-muted-foreground" aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-medium text-foreground">{place.name}</p>
                <p className="mt-1 text-muted-foreground leading-relaxed">{place.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
        aria-labelledby="guide-facts"
      >
        <h2 id="guide-facts" className="guide-label">
          Fact plate
        </h2>
        <dl className="mt-3 grid gap-0 text-sm">
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Capital</dt>
            <dd className="text-right">{entry.facts.capital}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Languages</dt>
            <dd className="text-right">{entry.facts.languages.join(', ')}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Currency</dt>
            <dd className="text-right">{entry.facts.currency}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Area</dt>
            <dd className="text-right tabular-nums">
              {entry.facts.areaKm2.toLocaleString('en-US')} km²
            </dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Region</dt>
            <dd className="text-right">{entry.facts.region}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">ISO 3166-1</dt>
            <dd className="text-right font-mono tabular-nums">{entry.code}</dd>
          </div>
        </dl>
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        aria-labelledby="guide-sources"
      >
        <h2 id="guide-sources" className="guide-label">
          Sources
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {entry.sources.map((source) => (
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

      <p className="enter mt-10" style={{ '--enter-delay': '180ms' } as React.CSSProperties}>
        <Link href="/gallery" className="text-sm text-muted-foreground hover:text-foreground">
          Browse the gallery →
        </Link>
      </p>
      <p className="enter mt-3 mb-4" style={{ '--enter-delay': '190ms' } as React.CSSProperties}>
        <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          ← All countries
        </Link>
      </p>
    </article>
  )
}
