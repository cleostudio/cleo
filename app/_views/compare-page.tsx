import Link from 'next/link'

import { CompareCopyLink } from '~/components/compare-copy-link'
import { ComparePicker } from '~/components/compare-picker'
import { PixelCluster } from '~/components/pixel-cluster'
import {
  COMPARE_STARTERS,
  comparableSpaceSubjects,
  resolveComparePair,
  sideCode,
  sideHref,
  sideName,
} from '~/lib/compare'
import { countries } from '~/lib/countries'
import { firstSearchParam, type SearchParamValue } from '~/lib/search-params'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function comparePageMetadata() {
  const copy = publicPageMetadata.compare
  return localeMetadata({
    path: '/compare',
    title: copy.title,
    description: copy.description,
  })
}

export function ComparePageView({
  searchParams,
}: {
  searchParams: Record<string, SearchParamValue>
}) {
  const rawA = firstSearchParam(searchParams.a)
  const rawB = firstSearchParam(searchParams.b)
  const result = resolveComparePair(rawA, rawB)

  const countryOptions = countries.map((country) => ({
    collection: 'explore' as const,
    slug: country.slug,
    name: country.name,
    code: country.code,
  }))
  const planetOptions = comparableSpaceSubjects().map((subject) => ({
    collection: 'space' as const,
    slug: subject.slug,
    name: subject.name,
    code: subject.code,
  }))

  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">Compare</h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.compare.description}
          </p>
        </header>
        <PixelCluster variant={3} className="enter shrink-0" />
      </div>

      {result.status === 'ready' ? (
        <ComparePlate pair={result.pair} />
      ) : (
        <div
          className="enter mt-10 max-w-content-narrow"
          style={{ '--enter-delay': '100ms' } as React.CSSProperties}
        >
          {result.status === 'mixed' ? (
            <p className="text-sm text-muted-foreground">
              Compare needs two subjects of the same kind — two countries or two
              planets.
            </p>
          ) : null}
          {result.status === 'unknown' ? (
            <p className="text-sm text-muted-foreground">
              Unknown subject{' '}
              <span className="tabular-nums text-foreground">
                {result.ref.collection}:{result.ref.slug}
              </span>
              .
            </p>
          ) : null}
          {result.status === 'unsupported' ? (
            <p className="text-sm text-muted-foreground">{result.reason}</p>
          ) : null}
          {result.status === 'incomplete' ? (
            <p className="text-sm text-muted-foreground">
              Pick a second subject to finish the pair.
            </p>
          ) : null}

          <ComparePicker
            countries={countryOptions}
            planets={planetOptions}
            initialA={rawA}
            initialB={rawB}
          />

          <section className="mt-10" aria-labelledby="compare-starters">
            <h2 id="compare-starters" className="guide-label">
              Starters
            </h2>
            <ul className="mt-2 flex flex-col">
              {COMPARE_STARTERS.map((starter) => (
                <li key={starter.label} className="hairline-top">
                  <Link
                    href={`/compare?a=${encodeURIComponent(starter.a)}&b=${encodeURIComponent(starter.b)}`}
                    className="country-row group"
                  >
                    <span className="country-name font-medium">{starter.label}</span>
                    <span className="country-subregion text-muted-foreground tabular-nums">
                      {starter.a.split(':')[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}

function ComparePlate({
  pair,
}: {
  pair: Extract<
    ReturnType<typeof resolveComparePair>,
    { status: 'ready' }
  >['pair']
}) {
  return (
    <article
      className="enter mt-10"
      style={{ '--enter-delay': '100ms' } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-foreground text-balance">
          <Link
            href={sideHref(pair.a)}
            className="underline-offset-2 hover:underline"
          >
            {sideName(pair.a)}
          </Link>
          <span className="mx-2 text-muted-foreground/50" aria-hidden>
            ·
          </span>
          <Link
            href={sideHref(pair.b)}
            className="underline-offset-2 hover:underline"
          >
            {sideName(pair.b)}
          </Link>
        </h2>
        <CompareCopyLink href={pair.href} />
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        <span className="tabular-nums">{sideCode(pair.a)}</span>
        <span className="mx-2 text-muted-foreground/50" aria-hidden>
          /
        </span>
        <span className="tabular-nums">{sideCode(pair.b)}</span>
        <span className="mx-2 text-muted-foreground/50" aria-hidden>
          ·
        </span>
        {pair.kind === 'explore' ? 'Countries' : 'Planets'}
      </p>

      <section className="mt-8" aria-labelledby="compare-facts">
        <h3 id="compare-facts" className="guide-label">
          Fact plate
        </h3>
        <div className="compare-plate mt-3" role="table" aria-label="Comparison">
          <div className="compare-plate-head" role="row">
            <span className="compare-plate-label" role="columnheader">
              Field
            </span>
            <span role="columnheader">
              <Link href={sideHref(pair.a)} className="hover:underline underline-offset-2">
                {sideName(pair.a)}
              </Link>
            </span>
            <span role="columnheader">
              <Link href={sideHref(pair.b)} className="hover:underline underline-offset-2">
                {sideName(pair.b)}
              </Link>
            </span>
          </div>
          {pair.rows.map((row, index) => (
            <div
              key={row.label}
              className="compare-plate-row"
              role="row"
              style={
                {
                  '--enter-delay': `${120 + index * 30}ms`,
                } as React.CSSProperties
              }
            >
              <span className="compare-plate-label" role="rowheader">
                {row.label}
              </span>
              <span role="cell">{row.a}</span>
              <span role="cell">{row.b}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm">
        <Link href="/compare" className="text-muted-foreground hover:text-foreground">
          ← New comparison
        </Link>
      </p>
    </article>
  )
}
