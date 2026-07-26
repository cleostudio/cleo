import { EarthGlobeLazy } from '~/components/world/earth-globe-lazy'
import { T } from '~/lib/i18n'
import { localeMetadata } from '~/lib/locale-metadata'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export function worldPageMetadata() {
  const copy = publicPageMetadata.world
  return localeMetadata({
    path: '/world',
    title: copy.title,
    description: copy.description,
  })
}

export function WorldPageView() {
  return (
    <div className="world-page">
      <header className="world-header">
        <h1 className="page-eyebrow enter">
          <T zh="世界" en="World" />
        </h1>
        <p
          className="world-lead enter"
          style={{ '--enter-delay': '70ms' } as React.CSSProperties}
        >
          {publicPageMetadata.world.description}
        </p>
        <p
          className="world-hint enter"
          style={{ '--enter-delay': '120ms' } as React.CSSProperties}
        >
          Drag to orbit · Scroll to zoom · Click a point for its field guide
        </p>
      </header>
      <EarthGlobeLazy />
    </div>
  )
}
