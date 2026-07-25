import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PixelCluster } from '~/components/pixel-cluster'
import {
  countrySlugs,
  getCountry,
  type Country,
} from '~/lib/countries'
import { localeMetadata } from '~/lib/locale-metadata'

export function exploreCountryStaticParams() {
  return countrySlugs().map((slug) => ({ slug }))
}

export function exploreCountryMetadata(slug: string) {
  const country = getCountry(slug)
  if (!country) return {}

  return localeMetadata({
    path: `/explore/${country.slug}`,
    title: country.name,
    description: countryDescription(country),
  })
}

function countryDescription(country: Country) {
  return `${country.name} — ${country.subregion}, ${country.region}. An Explore page for ${country.name}.`
}

export function ExploreCountryPageView({ slug }: { slug: string }) {
  const country = getCountry(slug)
  if (!country) notFound()

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
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {countryDescription(country)}
          </p>
        </header>
        <PixelCluster variant={5} className="enter shrink-0" />
      </div>

      <dl className="enter mt-10 grid gap-4 text-sm" style={{ '--enter-delay': '110ms' } as React.CSSProperties}>
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

      <p
        className="enter mt-10 text-sm leading-relaxed text-muted-foreground"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
      >
        This country page is ready for a deeper guide — places, notes, and
        whatever belongs here next.
      </p>

      <p className="enter mt-8" style={{ '--enter-delay': '170ms' } as React.CSSProperties}>
        <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
          ← All countries
        </Link>
      </p>
    </article>
  )
}
