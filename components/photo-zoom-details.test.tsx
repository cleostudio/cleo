/** @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { PhotoZoomDetails } from '~/components/photo-zoom-details'

afterEach(() => {
  cleanup()
})

describe('PhotoZoomDetails', () => {
  it('shows place capture cells for Explore photographs', () => {
    render(
      <PhotoZoomDetails
        collection="places"
        title="Band-e Amir"
        subtitle="Afghanistan"
        photographer="Afghanistan Matters"
        license="CC BY 2.0"
      />,
    )

    expect(screen.getByText('Place')).toBeTruthy()
    expect(screen.getByText('Band-e Amir')).toBeTruthy()
    expect(screen.getByText('Country')).toBeTruthy()
    expect(screen.getByText('Afghanistan')).toBeTruthy()
    expect(screen.getByText('Photograph')).toBeTruthy()
    expect(screen.getByText('Afghanistan Matters')).toBeTruthy()
    expect(screen.getByText('License')).toBeTruthy()
    expect(screen.getByText('CC BY 2.0')).toBeTruthy()
    expect(screen.queryByText('Feature')).toBeNull()
    expect(screen.queryByText('Subject')).toBeNull()
  })

  it('shows feature capture cells for Space photographs', () => {
    render(
      <PhotoZoomDetails
        collection="space"
        title="Great Red Spot"
        subtitle="Jupiter"
        photographer="NASA / JPL"
        license="Public Domain"
      />,
    )

    expect(screen.getByText('Feature')).toBeTruthy()
    expect(screen.getByText('Great Red Spot')).toBeTruthy()
    expect(screen.getByText('Subject')).toBeTruthy()
    expect(screen.getByText('Jupiter')).toBeTruthy()
    expect(screen.queryByText('Place')).toBeNull()
    expect(screen.queryByText('Country')).toBeNull()
  })

  it('shows site capture cells for Civilizations photographs', () => {
    render(
      <PhotoZoomDetails
        collection="civilizations"
        title="Colosseum"
        subtitle="Roman Empire"
        photographer="FeaturedPics"
        license="CC BY-SA 4.0"
      />,
    )

    expect(screen.getByText('Site')).toBeTruthy()
    expect(screen.getByText('Colosseum')).toBeTruthy()
    expect(screen.getByText('Civilization')).toBeTruthy()
    expect(screen.getByText('Roman Empire')).toBeTruthy()
    expect(screen.queryByText('Place')).toBeNull()
    expect(screen.queryByText('Feature')).toBeNull()
  })

  it('shows site capture cells for Cities photographs', () => {
    render(
      <PhotoZoomDetails
        collection="cities"
        title="Hagia Sophia"
        subtitle="Istanbul"
        photographer="Arild Vågen"
        license="CC BY-SA 4.0"
      />,
    )

    expect(screen.getByText('Site')).toBeTruthy()
    expect(screen.getByText('Hagia Sophia')).toBeTruthy()
    expect(screen.getByText('City')).toBeTruthy()
    expect(screen.getByText('Istanbul')).toBeTruthy()
    expect(screen.queryByText('Place')).toBeNull()
    expect(screen.queryByText('Feature')).toBeNull()
    expect(screen.queryByText('Civilization')).toBeNull()
  })
})
