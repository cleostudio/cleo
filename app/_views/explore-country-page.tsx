import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PixelCluster } from '~/components/pixel-cluster'
import { countrySlugs, getCountry } from '~/lib/countries'
import {
  countryDescription,
  getCountryGuide,
} from '~/lib/country-guides'
import { localeMetadata } from '~/lib/locale-metadata'

export function exploreCountryStaticParams() {
  return countrySlugs().map((slug) => ({ slug }))
}

export function exploreCountryMetadata(slug: string) {
  const country = getCountry(slug)
  if (!country) return {}
  const guide = getCountryGuide(slug)

  return localeMetadata({
    path: `/explore/${country.slug}`,
    title: country.name,
    description: guide ? countryDescription(guide) : countryDescription(country),
  })
}

export function ExploreCountryPageView({ slug }: { slug: string }) {
  const country = getCountry(slug)
  if (!country) notFound()
  const guide = getCountryGuide(slug)
  if (!guide) notFound()

  return (
    <article className="mx-auto w-full max-w-[37.5rem] px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[34rem]">
          <p className="page-eyebrow enter">
            <Link href="/explore" className="hover:text-foreground">
              Explore
            </Link>
            <span aria-hidden className="mx-2 text-muted-foreground/50">
              /
            </span>
            <span className="tabular-nums">{country.code}</span>
          </p>
          <h1
            className="enter mt-4 text-2xl font-semibold tracking-tight text-foreground text-balance"
            style={{ '--enter-delay': '40ms' } as React.CSSProperties}
          >
            {country.name}
          </h1>
        </header>
        <PixelCluster variant={5} className="enter shrink-0" />
      </div>

      <figure
        className="enter mt-8 overflow-hidden rounded-[2px]"
        style={{ '--enter-delay': '70ms' } as React.CSSProperties}
      >
        <Image
          src={guide.place.image}
          alt={guide.place.alt}
          width={1200}
          height={800}
          className="photo-frame aspect-[3/2] w-full object-cover"
          sizes="(max-width: 40rem) 100vw, 37.5rem"
          priority
        />
        <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-foreground">
          <span>{guide.place.name}</span>
          <span className="text-xs">{guide.place.credit}</span>
        </figcaption>
      </figure>

      <div
        className="enter mt-8 space-y-4 text-sm leading-relaxed text-foreground/90"
        style={{ '--enter-delay': '100ms' } as React.CSSProperties}
      >
        <h2 className="text-sm font-medium text-muted-foreground">About</h2>
        <p className="text-balance">{guide.about}</p>
      </div>

      <dl
        className="enter mt-10 grid gap-4 text-sm"
        style={{ '--enter-delay': '130ms' } as React.CSSProperties}
      >
        <div className="hairline-top flex justify-between gap-6 pt-3">
          <dt className="text-muted-foreground">Region</dt>
          <dd className="text-right">{country.region}</dd>
        </div>
        <div className="hairline-top flex justify-between gap-6 pt-3">
          <dt className="text-muted-foreground">Subregion</dt>
          <dd className="text-right">{country.subregion}</dd>
        </div>
        <div className="hairline-top flex justify-between gap-6 pt-3">
          <dt className="text-muted-foreground">ISO 3166-1</dt>
          <dd className="text-right font-mono tabular-nums">{country.code}</dd>
        </div>
      </dl>

      <p className="enter mt-8" style={{ '--enter-delay': '160ms' } as React.CSSProperties}>
        <Link href="/photos" className="text-sm text-muted-foreground hover:text-foreground">
          See all country places →
        </Link>
      </p>

      <p className="enter mt-4" style={{ '--enter-delay': '180ms' } as React.CSSProperties}>
        <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          ← All countries
        </Link>
      </p>
    </article>
  )
}
