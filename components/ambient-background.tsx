'use client'

import { usePathname } from 'next/navigation'

import { ArcRulers } from '~/components/arc-rulers'
import { unlocalizedPathname } from '~/lib/locale-route'

// Paper grain + drafting-guide rules per the design language: the page reads
// as a sheet of working paper, not a void. Both layers are inert and tuned
// to be noticed on the second visit, not the first. The Cleo chat surface
// stays borderless so the empty prompt can sit in open space.
export function AmbientBackground() {
  const hideDraftingGuides = unlocalizedPathname(usePathname()) === '/cleo'

  return (
    <>
      <div aria-hidden className="paper-grain" />
      {hideDraftingGuides ? null : (
        <>
          <div aria-hidden className="column-guides">
            <div className="column-guide-v" />
            <div className="column-guide-v" />
          </div>
          {/* rulers ride above the edge fades — the instrument stays crisp */}
          <div aria-hidden className="column-rulers">
            <ArcRulers />
          </div>
        </>
      )}
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-top" />
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-bottom" />
    </>
  )
}
