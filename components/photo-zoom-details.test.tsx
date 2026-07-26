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

  it('shows water capture cells for Oceans photographs', () => {
    render(
      <PhotoZoomDetails
        collection="oceans"
        title="Pacific Ocean chlorophyll mosaic"
        subtitle="Pacific Ocean"
        photographer="NASA/GSFC"
        license="Public Domain (NASA)"
      />,
    )

    expect(screen.getByText('Feature')).toBeTruthy()
    expect(screen.getByText('Pacific Ocean chlorophyll mosaic')).toBeTruthy()
    expect(screen.getByText('Water')).toBeTruthy()
    expect(screen.getByText('Pacific Ocean')).toBeTruthy()
    expect(screen.queryByText('Subject')).toBeNull()
    expect(screen.queryByText('Country')).toBeNull()
  })
})
