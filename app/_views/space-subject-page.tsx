import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleContents } from '~/components/article-contents'
import { ArticleInfobox } from '~/components/article-infobox'
import { ArticleLead } from '~/components/article-lead'
import { PhotoZoomDetails } from '~/components/photo-zoom-details'
import { PixelCluster } from '~/components/pixel-cluster'
import { ZoomImage } from '~/components/zoom-image'
import {
  getSpaceSubject,
  spaceDescription,
  spaceSubjectSlugs,
} from '~/lib/space'
import { localeMetadata } from '~/lib/locale-metadata'

const SPACE_ARTICLE_SECTIONS = [
  { id: 'space-overview', label: 'Overview' },
  { id: 'space-features', label: 'Notable features' },
  { id: 'space-sources', label: 'Sources' },
] as const

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
    <article className="topic-article mx-auto w-full max-w-content px-6">
      <div className="topic-article-header flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <nav className="article-breadcrumb enter" aria-label="Breadcrumb">
            <Link href="/space" className="hover:text-foreground">
              Space
            </Link>
            <span aria-hidden className="mx-2 text-muted-foreground/50">
              /
            </span>
            <span className="tabular-nums">{subject.code}</span>
          </nav>
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

      <div
        className="enter mt-8"
        style={{ '--enter-delay': '70ms' } as React.CSSProperties}
      >
        <ArticleContents items={SPACE_ARTICLE_SECTIONS} />
      </div>

      <div
        className="article-hero-grid enter mt-8"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
      >
        <figure>
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
          <figcaption className="article-credit mt-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
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
        <ArticleInfobox
          id="space-quick-facts"
          facts={[
            { label: 'Kind', value: subject.facts.kind, isPrimary: true },
            { label: 'System', value: subject.facts.system },
            { label: 'Mean distance', value: subject.facts.meanDistance },
            { label: 'Equatorial radius', value: formatRadius(subject.facts.radiusKm) },
            { label: 'Orbital period', value: subject.facts.orbitalPeriod },
            { label: 'Rotation', value: subject.facts.rotationPeriod },
            { label: 'Companions', value: subject.facts.companions },
            { label: 'Catalog', value: subject.code },
          ]}
        />
      </div>

      <section
        id="space-overview"
        className="topic-article-section enter mt-10"
        style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        aria-labelledby="space-overview-heading"
      >
        <h2 id="space-overview-heading" className="topic-article-heading">
          Overview
        </h2>
        <ArticleLead about={subject.about} />
      </section>

      <section
        id="space-features"
        className="topic-article-section enter mt-12"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
        aria-labelledby="space-features-heading"
      >
        <h2 id="space-features-heading" className="topic-article-heading">
          Notable features
        </h2>
        <ul className="article-highlights">
          {subject.features.map((feature) => (
            <li key={feature.name}>
              <div>
                <h3>{feature.name}</h3>
                <p className="mt-1 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="space-sources"
        className="topic-article-section enter mt-12"
        style={{ '--enter-delay': '160ms' } as React.CSSProperties}
        aria-labelledby="space-sources-heading"
      >
        <h2 id="space-sources-heading" className="topic-article-heading">
          Sources
        </h2>
        <ul className="article-sources">
          {subject.sources.map((source) => (
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

      <p
        className="enter mt-10 mb-4"
        style={{ '--enter-delay': '180ms' } as React.CSSProperties}
      >
        <Link href="/space" className="text-sm text-muted-foreground hover:text-foreground">
          Browse all space articles →
        </Link>
      </p>
    </article>
  )
}
