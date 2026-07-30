/** @vitest-environment jsdom */

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GuidePhotoCollection, type GuidePhoto } from './guide-photo-collection'

vi.mock('~/components/zoom-image', () => ({
  ZoomImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}))

const photos: GuidePhoto[] = [
  {
    title: 'First view',
    alt: 'First view photo',
    caption: 'First view',
    photographer: 'Photographer One',
    sourceUrl: 'https://example.com/one',
    license: 'CC BY 4.0',
    width: 2048,
    height: 1365,
    renditions: [{ src: '/one.jpg', width: 1280, bytes: 1 }],
  },
  {
    title: 'Second view',
    alt: 'Second view photo',
    caption: 'Second view',
    photographer: 'Photographer Two',
    sourceUrl: 'https://example.com/two',
    license: 'CC BY 4.0',
    width: 2048,
    height: 1365,
    renditions: [{ src: '/two.jpg', width: 1280, bytes: 1 }],
  },
  {
    title: 'Third view',
    alt: 'Third view photo',
    caption: 'Third view',
    photographer: 'Photographer Three',
    sourceUrl: 'https://example.com/three',
    license: 'CC BY 4.0',
    width: 2048,
    height: 1365,
    renditions: [{ src: '/three.jpg', width: 1280, bytes: 1 }],
  },
]

describe('GuidePhotoCollection', () => {
  it('shows adjacent previews and wraps through the full set', () => {
    render(
      <GuidePhotoCollection
        collection="places"
        subject="Example"
        sourceLabel="Source"
        photos={photos}
      />,
    )

    const next = screen.getByRole('button', {
      name: 'Show next photograph: Second view',
    })
    expect(screen.getByAltText('First view photo')).toBeTruthy()
    expect(screen.getByText('1 / 3')).toBeTruthy()

    fireEvent.click(next)
    expect(screen.getByAltText('Second view photo')).toBeTruthy()
    expect(screen.getByText('2 / 3')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Show next photograph: Third view',
      }),
    )
    expect(screen.getByAltText('Third view photo')).toBeTruthy()
    expect(screen.getByText('3 / 3')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Show next photograph: First view',
      }),
    )
    expect(screen.getByAltText('First view photo')).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Show previous photograph: Third view',
      }),
    )
    expect(screen.getByAltText('Third view photo')).toBeTruthy()
  })
})
