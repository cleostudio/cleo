import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideOrientation } from '~/components/guide-orientation'
import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import { getCountry } from '~/lib/countries'
import { localeMetadata } from '~/lib/locale-metadata'
import {
  getPlaceGuide,
  placeDescription,
  placeHref,
  placeStaticParams,
} from '~/lib/places'

export function explorePlaceStaticParams() {
  return placeStaticParams()
}

export function explorePlaceMetadata(countrySlug: string, placeSlug: string) {
  const place = getPlaceGuide(placeSlug)
  if (!place || place.countrySlug !== countrySlug) return {}

  return localeMetadata({
    path: placeHref(place),
    title: place.name,
    description: placeDescription(place).slice(0, 160),
  })
}

export function ExplorePlacePageView({
  countrySlug,
  placeSlug,
}: {
  countrySlug: string
  placeSlug: string
}) {
  const country = getCountry(countrySlug)
  const place = getPlaceGuide(placeSlug)
  if (!country || !place || place.countrySlug !== countrySlug) notFound()

  const hero =
    place.photo.renditions.find((r) => r.width === 1280) ?? place.photo.renditions[0]!

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
            <Link
              href={`/explore/${country.slug}`}
              className="hover:text-foreground"
            >
              {country.name}
            </Link>
            <span aria-hidden className="mx-2 text-muted-foreground/50">
              /
            </span>
            <span className="tabular-nums">{place.code}</span>
          </p>
          <h1
            className="enter mt-4 text-2xl font-semibold tracking-tight text-foreground text-balance"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            {place.name}
          </h1>
          <p
            className="enter mt-2 text-sm text-muted-foreground"
            style={{ '--enter-delay': '55ms' } as React.CSSProperties}
          >
            {place.subtitle}
          </p>
        </header>
        <PixelCluster variant={6} className="enter shrink-0" />
      </div>

      <figure
        className="enter mt-8"
        style={{ '--enter-delay': '70ms' } as React.CSSProperties}
      >
        <ZoomImage
          src={hero.src}
          alt={place.photo.alt}
          width={place.photo.width}
          height={place.photo.height}
          className="photo-frame aspect-[3/2] w-full object-cover"
          sizes="(max-width: 40rem) 100vw, 42rem"
          renditions={place.photo.renditions.map((r) => ({
            src: r.src,
            width: r.width,
          }))}
          expandedContent={
            <PhotoZoomDetails
              collection="places"
              title={place.photo.featureName}
              subtitle={place.name}
              photographer={place.photo.photographer}
              license={place.photo.license}
            />
          }
        />
        <figcaption className="guide-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
          <span>{place.photo.caption}</span>
          <span>
            {place.photo.photographer} ·{' '}
            <a
              href={place.photo.sourceUrl}
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
        aria-labelledby="place-about"
      >
        <h2 id="place-about" className="guide-label">
          Orientation
        </h2>
        <GuideOrientation about={place.about} />
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="place-features"
      >
        <h2 id="place-features" className="guide-label">
          Highlights
        </h2>
        <ol className="mt-3 flex flex-col">
          {place.features.map((feature, index) => (
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
        aria-labelledby="place-facts"
      >
        <h2 id="place-facts" className="guide-label">
          Fact plate
        </h2>
        <dl className="spec-plate spec-plate-guide mt-3">
          <div>
            <dt>Kind</dt>
            <dd>
              <span className="spec-signal" aria-hidden />
              {place.facts.kind}
            </dd>
          </div>
          <div>
            <dt>Country</dt>
            <dd>
              <Link
                href={`/explore/${place.countrySlug}`}
                className="underline-offset-2 hover:underline"
              >
                {place.facts.country}
              </Link>
            </dd>
          </div>
          <div>
            <dt>Setting</dt>
            <dd>{place.facts.setting}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{place.facts.role}</dd>
          </div>
          <div>
            <dt>Known for</dt>
            <dd>{place.facts.knownFor}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>{place.facts.region}</dd>
          </div>
        </dl>
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        aria-labelledby="place-sources"
      >
        <h2 id="place-sources" className="guide-label">
          Sources
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {place.sources.map((source) => (
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
        <Link
          href={`/explore/${country.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {country.name}
        </Link>
      </p>
      <p className="enter mt-3 mb-4" style={{ '--enter-delay': '190ms' } as React.CSSProperties}>
        <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          All countries
        </Link>
      </p>
    </article>
  )
}
