// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FooterCoordinates } from './footer-coordinates'

let originalGeolocation: PropertyDescriptor | undefined

function mockGeolocation(
  implementation: (
    success: PositionCallback,
    error: PositionErrorCallback,
    options?: PositionOptions,
  ) => void,
) {
  originalGeolocation ??= Object.getOwnPropertyDescriptor(navigator, 'geolocation')
  const getCurrentPosition = vi.fn(implementation)

  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: { getCurrentPosition },
  })

  return getCurrentPosition
}

afterEach(() => {
  cleanup()
  if (originalGeolocation) {
    Object.defineProperty(navigator, 'geolocation', originalGeolocation)
  } else {
    Reflect.deleteProperty(navigator, 'geolocation')
  }
  originalGeolocation = undefined
  vi.restoreAllMocks()
})

describe('FooterCoordinates', () => {
  it('uses a fresh high-accuracy browser position', () => {
    let resolvePosition: PositionCallback | undefined
    const getCurrentPosition = mockGeolocation((success) => {
      resolvePosition = success
    })

    const { container } = render(<FooterCoordinates />)

    expect(getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10_000,
      },
    )
    expect(screen.getByText('Locating…')).not.toBeNull()

    act(() => {
      resolvePosition?.({
        coords: {
          accuracy: 8,
          latitude: -33.86882,
          longitude: 151.2093,
        } as GeolocationCoordinates,
      } as GeolocationPosition)
    })

    expect(screen.getByText('33.86882° S')).not.toBeNull()
    expect(screen.getByText('151.20930° E')).not.toBeNull()
    expect(container.querySelector('.footer-geo')?.getAttribute('aria-label')).toContain(
      'Accuracy reported within about 8 meters.',
    )
    expect(container.textContent).not.toContain('22.4820° N')
  })

  it('does not display stale coordinates when location access fails', () => {
    let rejectPosition: PositionErrorCallback | undefined
    mockGeolocation((_success, error) => {
      rejectPosition = error
    })

    render(<FooterCoordinates />)

    act(() => {
      rejectPosition?.({} as GeolocationPositionError)
    })

    expect(screen.getByText('Location unavailable')).not.toBeNull()
    expect(screen.queryByText('22.4820° N')).toBeNull()
    expect(screen.queryByText('113.9247° E')).toBeNull()
  })
})
