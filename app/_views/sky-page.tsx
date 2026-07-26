import Link from 'next/link'

import { PixelCluster } from '~/components/pixel-cluster'
import { SkyAtlasPlate } from '~/components/sky-atlas-plate'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function skyPageMetadata() {
  const copy = publicPageMetadata.sky
  return localeMetadata({
    path: '/sky',
    title: copy.title,
    description: copy.description,
  })
}

export function SkyPageView() {
  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="星空" en="Sky" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            {publicPageMetadata.sky.description}
          </p>
          <p
            className="enter mt-3 text-sm text-muted-foreground"
            style={{ '--enter-delay': '90ms' } as React.CSSProperties}
          >
            A companion to{' '}
            <Link href="/space" className="text-foreground underline-offset-2 hover:underline">
              Space
            </Link>{' '}
            field guides — pick a target on the plate to open its primer.
          </p>
        </header>
        <PixelCluster variant={10} className="enter shrink-0" />
      </div>

      <SkyAtlasPlate />
    </div>
  )
}
