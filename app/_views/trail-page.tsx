import { Suspense } from 'react'

import { PixelCluster } from '~/components/pixel-cluster'
import { TrailExplorer } from '~/components/trail-explorer'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function trailPageMetadata() {
  const copy = publicPageMetadata.trail
  return localeMetadata({
    path: '/trail',
    title: copy.title,
    description: copy.description,
  })
}

function TrailExplorerFallback() {
  return (
    <p className="mt-10 text-sm text-muted-foreground" aria-busy="true">
      Loading trails…
    </p>
  )
}

export function TrailPageView() {
  return (
    <div className="mx-auto w-full max-w-content px-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="小径" en="Trail" />
          </h1>
          <p className="enter mt-3 text-sm leading-relaxed text-muted-foreground">
            <T
              zh="沿着精选停靠点走过国家与太空导览。勾选进度、切换集合，打开实地指南。"
              en="Walk curated stops through Explore and Space field guides. Mark progress, switch collections, and open each guide as you go."
            />
          </p>
        </header>
        <PixelCluster variant={2} className="enter shrink-0" />
      </div>

      <Suspense fallback={<TrailExplorerFallback />}>
        <TrailExplorer />
      </Suspense>
    </div>
  )
}
