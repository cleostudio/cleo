import Image from 'next/image'
import Link from 'next/link'

import { PixelCluster } from '~/components/pixel-cluster'
import { countryGuidesByRegion, allCountryGuides } from '~/lib/country-guides'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function photosPageMetadata() {
  const copy = publicPageMetadata.photos
  const count = allCountryGuides().length
  return localeMetadata({
    path: '/photos',
    title: copy.title,
    description: `${count} beautiful places — one for every country on Explore.`,
  })
}

export function PhotosPageView() {
  const regions = countryGuidesByRegion()
  const total = allCountryGuides().length

  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[34rem]">
          <h1 className="page-eyebrow enter">
            <T zh="照片" en="Photos" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            Beautiful places across {total} countries — each photograph opens
            the Explore page for that country.
          </p>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <div className="mt-10 flex flex-col gap-12">
        {regions.map(([region, guides]) => (
          <section key={region} aria-labelledby={`photos-${region}`}>
            <h2
              id={`photos-${region}`}
              className="enter text-sm font-medium text-muted-foreground"
            >
              {region}
              <span className="ml-2 tabular-nums text-muted-foreground/70">
                {guides.length}
              </span>
            </h2>
            <ul className="photo-masonry mt-4">
              {guides.map((guide, index) => (
                <li
                  key={guide.slug}
                  className="photo-item enter"
                  style={
                    {
                      '--enter-delay': `${80 + Math.min(index, 16) * 20}ms`,
                    } as React.CSSProperties
                  }
                >
                  <Link
                    href={`/explore/${guide.slug}`}
                    className="group block outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Image
                      src={guide.place.image}
                      alt={guide.place.alt}
                      width={800}
                      height={1000}
                      className="photo-frame w-full object-cover transition-[filter] duration-200 group-hover:brightness-[1.03]"
                      sizes="(max-width: 40rem) 50vw, 12.5rem"
                    />
                    <div className="mt-2 space-y-0.5 px-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {guide.place.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {guide.name}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
