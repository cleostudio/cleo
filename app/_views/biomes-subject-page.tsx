import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideOrientation } from '~/components/guide-orientation'
import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import {
  getBiomeSubject,
  biomeDescription,
  biomeSubjectSlugs,
} from '~/lib/biomes'
import { localeMetadata } from '~/lib/locale-metadata'

export function biomeSubjectStaticParams() {
  return biomeSubjectSlugs().map((slug) => ({ slug }))
}

export function biomeSubjectMetadata(slug: string) {
  const subject = getBiomeSubject(slug)
  if (!subject) return {}

  return localeMetadata({
    path: `/biomes/${subject.slug}`,
    title: subject.name,
    description: biomeDescription(subject).slice(0, 160),
  })
}

export function BiomesSubjectPageView({ slug }: { slug: string }) {
  const subject = getBiomeSubject(slug)
  if (!subject) notFound()

  return (
    <article className="field-guide mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <p className="page-eyebrow enter">
            <Link href="/biomes" className="hover:text-foreground">
              Biomes
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
        <PixelCluster variant={1} className="enter shrink-0" />
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
              collection="biomes"
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
        aria-labelledby="biomes-about"
      >
        <h2 id="biomes-about" className="guide-label">
          Orientation
        </h2>
        <GuideOrientation about={subject.about} />
      </section>

      <section
        className="enter mt-12"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="biomes-features"
      >
        <h2 id="biomes-features" className="guide-label">
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
        aria-labelledby="biomes-facts"
      >
        <h2 id="biomes-facts" className="guide-label">
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
            <dt>Climate</dt>
            <dd>{subject.facts.climate}</dd>
          </div>
          <div>
            <dt>Range</dt>
            <dd>{subject.facts.range}</dd>
          </div>
          <div>
            <dt>Cover</dt>
            <dd>{subject.facts.cover}</dd>
          </div>
          <div>
            <dt>Exemplars</dt>
            <dd>{subject.facts.exemplars}</dd>
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
        aria-labelledby="biomes-sources"
      >
        <h2 id="biomes-sources" className="guide-label">
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
        <Link href="/biomes" className="text-sm text-muted-foreground hover:text-foreground">
          ← All biome guides
        </Link>
      </p>
    </article>
  )
}
