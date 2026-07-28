import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideOrientation } from '~/components/guide-orientation'
import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import { guideNeighbors } from '~/lib/guide-neighbors'
import { localeMetadata } from '~/lib/locale-metadata'
import {
  getSpaceSubject,
  spaceDescription,
  spaceSubjectSlugs,
  spaceSubjectsByCategory,
} from '~/lib/space'

export function spaceSubjectStaticParams() {
  return spaceSubjectSlugs().map((slug) => ({ slug }))
}

export function spaceSubjectMetadata(slug: string) {
  const subject = getSpaceSubject(slug)
  if (!subject) return {}

  return localeMetadata({
    path: `/space/${subject.slug}`,
    title: subject.name,
    description: spaceDescription(subject).slice(0, 160),
  })
}

function formatRadius(radiusKm: number | null): string {
  if (radiusKm == null) return '—'
  return `${radiusKm.toLocaleString('en-US')} km`
}

export function SpaceSubjectPageView({ slug }: { slug: string }) {
  const subject = getSpaceSubject(slug)
  if (!subject) notFound()

  const categorySubjects =
    spaceSubjectsByCategory().find(
      ([category]) => category === subject.category,
    )?.[1] ?? []
  const { previous, next } = guideNeighbors(categorySubjects, subject.slug)
  const askHref = `/cleo?q=${encodeURIComponent(`Tell me about ${subject.name}`)}`
  const galleryHref = `/gallery?q=${encodeURIComponent(subject.name)}&collection=space`
  const guideLinkClass =
    'text-sm text-muted-foreground outline-none transition-colors duration-150 ease-[var(--ease-swift)] hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background'

  return (
    <article className="field-guide mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">
            <Link href="/space" className="hover:text-foreground">
              Space
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

      <figure
        className="enter mt-8"
        style={{ '--enter-delay': '70ms' } as React.CSSProperties}
      >
        <ZoomImage
          src={
            (subject.photo.renditions.find((r) => r.width === 1280) ??
              subject.photo.renditions[0])!.src
          }
          alt={subject.photo.alt}
          width={subject.photo.width}
          height={subject.photo.height}
          className="photo-frame aspect-[3/2] w-full object-cover"
          sizes="(max-width: 40rem) 100vw, 42rem"
          renditions={subject.photo.renditions.map((r) => ({
            src: r.src,
            width: r.width,
          }))}
          expandedContent={
            <PhotoZoomDetails
              collection="space"
              title={subject.photo.featureName}
              subtitle={subject.name}
              photographer={subject.photo.photographer}
              license={subject.photo.license}
            />
          }
        />
        <figcaption className="guide-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
          <span>{subject.photo.caption}</span>
          <span>
            {subject.photo.photographer} ·{' '}
            <a
              href={subject.photo.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              NASA
            </a>
          </span>
        </figcaption>
      </figure>

      <section
        className="enter mt-10"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
        aria-labelledby="space-about"
      >
        <h2 id="space-about" className="guide-label">
          Orientation
        </h2>
        <GuideOrientation about={subject.about} />
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="space-features"
      >
        <h2 id="space-features" className="guide-label">
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
        aria-labelledby="space-facts"
      >
        <h2 id="space-facts" className="guide-label">
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
            <dt>System</dt>
            <dd>{subject.facts.system}</dd>
          </div>
          <div>
            <dt>Mean distance</dt>
            <dd>{subject.facts.meanDistance}</dd>
          </div>
          <div>
            <dt>Equatorial radius</dt>
            <dd>{formatRadius(subject.facts.radiusKm)}</dd>
          </div>
          <div>
            <dt>Orbital period</dt>
            <dd>{subject.facts.orbitalPeriod}</dd>
          </div>
          <div>
            <dt>Rotation</dt>
            <dd>{subject.facts.rotationPeriod}</dd>
          </div>
          <div>
            <dt>Companions</dt>
            <dd>{subject.facts.companions}</dd>
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
        aria-labelledby="space-sources"
      >
        <h2 id="space-sources" className="guide-label">
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

      <p className="enter mt-10" style={{ '--enter-delay': '180ms' } as React.CSSProperties}>
        <Link href={askHref} className={guideLinkClass}>
          Ask Cleo about {subject.name} →
        </Link>
      </p>
      <p className="enter mt-3" style={{ '--enter-delay': '185ms' } as React.CSSProperties}>
        <Link href={galleryHref} className={guideLinkClass}>
          Browse the gallery →
        </Link>
      </p>
      <nav
        className="enter mt-6 mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
        style={{ '--enter-delay': '190ms' } as React.CSSProperties}
        aria-label="Nearby space guides"
      >
        {previous ? (
          <Link href={`/space/${previous.slug}`} className={guideLinkClass}>
            ← {previous.name}
          </Link>
        ) : (
          <span aria-hidden />
        )}
        <Link href="/space" className={guideLinkClass}>
          All space guides
        </Link>
        {next ? (
          <Link href={`/space/${next.slug}`} className={guideLinkClass}>
            {next.name} →
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
