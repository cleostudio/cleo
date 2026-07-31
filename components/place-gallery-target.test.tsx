/** @vitest-environment jsdom */

import { act, cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  galleryTargetId,
  GALLERY_TARGET_ATTRIBUTE,
  PlaceGalleryTarget,
} from './place-gallery-target'

function renderGallery() {
  return render(
    <div data-place-gallery>
      <PlaceGalleryTarget />
      <ul>
        <li data-gallery-item id="photo-places-japan">
          Mount Fuji
        </li>
        <li data-gallery-item id="photo-space-europa">
          Europa
        </li>
      </ul>
      <p id="photo-not-a-tile">Not a tile</p>
    </div>,
  )
}

function marked() {
  return document
    .querySelector(`[${GALLERY_TARGET_ATTRIBUTE}]`)
    ?.getAttribute('id')
}

function goToHash(hash: string) {
  act(() => {
    window.history.replaceState(null, '', `/gallery${hash}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
})

describe('galleryTargetId', () => {
  it('accepts photo tile ids only', () => {
    expect(galleryTargetId('#photo-places-japan')).toBe('photo-places-japan')
    expect(galleryTargetId('photo-space-europa')).toBe('photo-space-europa')
    expect(galleryTargetId('')).toBeNull()
    expect(galleryTargetId('#')).toBeNull()
    expect(galleryTargetId('#home-site-search')).toBeNull()
  })
})

describe('PlaceGalleryTarget', () => {
  it('marks the tile the arriving link points at', () => {
    window.history.replaceState(null, '', '/gallery#photo-places-japan')
    renderGallery()

    expect(marked()).toBe('photo-places-japan')
  })

  it('moves the mark when the hash changes', () => {
    window.history.replaceState(null, '', '/gallery#photo-places-japan')
    renderGallery()

    goToHash('#photo-space-europa')
    expect(marked()).toBe('photo-space-europa')

    goToHash('')
    expect(marked()).toBeUndefined()
  })

  it('marks nothing for a hash that is not a gallery tile', () => {
    window.history.replaceState(null, '', '/gallery#photo-not-a-tile')
    renderGallery()

    expect(marked()).toBeUndefined()
  })

  it('marks nothing on an ordinary visit', () => {
    window.history.replaceState(null, '', '/gallery')
    renderGallery()

    expect(marked()).toBeUndefined()
  })
})
