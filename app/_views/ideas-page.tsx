import { GhostSchematic } from '~/components/ghost-schematic'
import { IdeasPlanner } from '~/components/ideas-planner'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function IdeasPageView() {
  return (
    <div className="relative mx-auto w-full max-w-content px-6">
      <GhostSchematic className="top-4 right-6 hidden w-56 sm:block" />
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-content-narrow">
          <h1 className="page-eyebrow enter">
            <T zh="想法" en="Ideas" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            <T
              zh={publicPageMetadata.ideas.description}
              en={publicPageMetadata.ideas.description}
            />
          </p>
        </header>
        <PixelCluster variant={2} className="enter shrink-0" />
      </div>

      <IdeasPlanner />
    </div>
  )
}
