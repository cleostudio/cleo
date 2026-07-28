import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleContents } from '~/components/article-contents'
import { ArticleInfobox } from '~/components/article-infobox'
import { ArticleLead } from '~/components/article-lead'
import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import { countrySlugs, getCountry } from '~/lib/countries'
import { atlasDescription, getAtlasEntry } from '~/lib/atlas'
import { localeMetadata } from '~/lib/locale-metadata'

const COUNTRY_ARTICLE_SECTIONS = [
  { id: 'country-overview', label: 'Overview' },
  { id: 'country-places', label: 'Notable places' },
  { id: 'country-sources', label: 'Sources' },
] as const

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

  const hero = entry.photo.renditions.find((r) => r.width === 1280) ?? entry.photo.renditions[0]!
  const renditions = entry.photo.renditions.map((r) => ({ src: r.src, width: r.width }))

  return (
    <article className="topic-article mx-auto w-full max-w-content px-6">
      <div className="topic-article-header flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <nav className="article-breadcrumb enter" aria-label="Breadcrumb">
            <Link href="/explore" className="hover:text-foreground">
              Countries
            </Link>
            <span aria-hidden className="mx-2 text-muted-foreground/50">
              /
            </span>
            <span className="tabular-nums">{entry.code}</span>
          </nav>
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

      <div
        className="enter mt-8"
        style={{ '--enter-delay': '70ms' } as React.CSSProperties}
      >
        <ArticleContents items={COUNTRY_ARTICLE_SECTIONS} />
      </div>

      <div
        className="article-hero-grid enter mt-8"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
      >
        <figure>
          <ZoomImage
            src={hero.src}
            alt={entry.photo.alt}
            width={entry.photo.width}
            height={entry.photo.height}
            className="photo-frame aspect-[3/2] w-full object-cover"
            sizes="(max-width: 40rem) 100vw, 42rem"
            renditions={renditions}
            expandedContent={
              <PhotoZoomDetails
                collection="places"
                title={entry.photo.placeName}
                subtitle={entry.name}
                photographer={entry.photo.photographer}
                license={entry.photo.license}
              />
            }
          />
          <figcaption className="article-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
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
        <ArticleInfobox
          id="country-quick-facts"
          facts={[
            { label: 'Capital', value: entry.facts.capital, isPrimary: true },
            { label: 'Languages', value: entry.facts.languages.join(', ') },
            { label: 'Currency', value: entry.facts.currency },
            { label: 'Area', value: `${entry.facts.areaKm2.toLocaleString('en-US')} km²` },
            { label: 'Region', value: entry.facts.region },
            { label: 'ISO 3166-1', value: entry.code },
          ]}
        />
      </div>

      <section
        id="country-overview"
        className="topic-article-section enter mt-10"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="country-overview-heading"
      >
        <h2 id="country-overview-heading" className="topic-article-heading">
          Overview
        </h2>
        <ArticleLead about={entry.about} />
      </section>

      <section
        id="country-places"
        className="topic-article-section enter mt-12"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
        aria-labelledby="country-places-heading"
      >
        <h2 id="country-places-heading" className="topic-article-heading">
          Notable places
        </h2>
        <ul className="article-highlights">
          {entry.places.map((place) => (
            <li key={place.name}>
              <div>
                <h3>{place.name}</h3>
                <p className="mt-1 text-muted-foreground leading-relaxed">{place.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="country-sources"
        className="topic-article-section enter mt-12"
        style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        aria-labelledby="country-sources-heading"
      >
        <h2 id="country-sources-heading" className="topic-article-heading">
          Sources
        </h2>
        <ul className="article-sources">
          {entry.sources.map((source) => (
            <li key={source.url}>
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
          View related photographs →
        </Link>
      </p>
      <p className="enter mt-3 mb-4" style={{ '--enter-delay': '190ms' } as React.CSSProperties}>
        <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          Browse all countries →
        </Link>
      </p>
    </article>
  )
}
