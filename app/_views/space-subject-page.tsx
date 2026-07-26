import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideOrientation } from '~/components/guide-orientation'
import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import {
  getSpaceSubject,
  spaceDescription,
  spaceSubjectSlugs,
} from '~/lib/space'
import { localeMetadata } from '~/lib/locale-metadata'

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
            (subject.photo.renditions.find((r) => r.width === 1024) ??
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
            <div className="spec-plate mx-auto max-w-content px-6 text-sm text-[var(--paper)]">
              <p className="font-medium">{subject.photo.caption}</p>
              <p className="mt-1 opacity-80">
                {subject.photo.photographer} · {subject.photo.license}
              </p>
            </div>
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
        <dl className="mt-3 grid gap-0 text-sm">
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Kind</dt>
            <dd className="text-right">{subject.facts.kind}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">System</dt>
            <dd className="text-right">{subject.facts.system}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Mean distance</dt>
            <dd className="text-right">{subject.facts.meanDistance}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Equatorial radius</dt>
            <dd className="text-right tabular-nums">
              {formatRadius(subject.facts.radiusKm)}
            </dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Orbital period</dt>
            <dd className="text-right">{subject.facts.orbitalPeriod}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Rotation</dt>
            <dd className="text-right">{subject.facts.rotationPeriod}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Companions</dt>
            <dd className="text-right">{subject.facts.companions}</dd>
          </div>
          <div className="hairline-top flex justify-between gap-6 py-3">
            <dt className="text-muted-foreground">Catalog</dt>
            <dd className="text-right font-mono tabular-nums">{subject.code}</dd>
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

      <p
        className="enter mt-10 mb-4"
        style={{ '--enter-delay': '180ms' } as React.CSSProperties}
      >
        <Link href="/space" className="text-sm text-muted-foreground hover:text-foreground">
          ← All space guides
        </Link>
      </p>
    </article>
  )
}
