'use client'

import { useEffect } from 'react'

export const GALLERY_TARGET_ATTRIBUTE = 'data-gallery-target'

/** Element id a `/gallery#photo-…` link points at, or null. */
export function galleryTargetId(hash: string): string | null {
  const id = hash.replace(/^#/, '')
  return id.startsWith('photo-') ? id : null
}

/**
 * Marks the tile a `/gallery#photo-…` link points at, so a photograph result
 * from the homepage search lands on something legible rather than somewhere in
 * the middle of the masonry.
 *
 * `:target` would be the CSS-only way, but browsers do not recompute it for the
 * History API pushes the App Router navigates with — the ring would then show
 * on a cold load and never on a click from the search bar.
 */
export function PlaceGalleryTarget() {
  useEffect(() => {
    function markTargetTile() {
      for (const marked of document.querySelectorAll(
        `[${GALLERY_TARGET_ATTRIBUTE}]`,
      )) {
        marked.removeAttribute(GALLERY_TARGET_ATTRIBUTE)
      }

      const id = galleryTargetId(window.location.hash)
      if (!id) return

      const tile = document.getElementById(id)
      if (tile?.hasAttribute('data-gallery-item')) {
        tile.setAttribute(GALLERY_TARGET_ATTRIBUTE, '')
      }
    }

    markTargetTile()
    window.addEventListener('hashchange', markTargetTile)
    return () => window.removeEventListener('hashchange', markTargetTile)
  }, [])

  return null
}
