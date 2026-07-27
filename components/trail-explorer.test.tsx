// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const searchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParams,
}))

import { TrailExplorer } from './trail-explorer'
import { TRAIL_PROGRESS_STORAGE_KEY } from '~/lib/trails'

afterEach(() => {
  cleanup()
  window.sessionStorage.clear()
  ;[...searchParams.keys()].forEach((key) => searchParams.delete(key))
})

beforeEach(() => {
  window.sessionStorage.clear()
  ;[...searchParams.keys()].forEach((key) => searchParams.delete(key))
})

describe('TrailExplorer', () => {
  it('walks a trail with interactive checklist controls', () => {
    searchParams.set('trail', 'pacific-ring')
    render(<TrailExplorer />)

    expect(
      screen.getByRole('heading', { name: 'Pacific Ring', level: 2 }),
    ).toBeTruthy()
    expect(screen.getByRole('group', { name: /Progress: 0 of 4 stops/ })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Mark & continue' }))

    expect(screen.getByRole('group', { name: /Progress: 1 of 4 stops/ })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Indonesia', level: 3 })).toBeTruthy()

    const guide = screen.getByRole('link', { name: 'Open guide' })
    expect(guide.getAttribute('href')).toBe('/explore/indonesia')

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByRole('heading', { name: 'Japan', level: 3 })).toBeTruthy()

    const stored = window.sessionStorage.getItem(TRAIL_PROGRESS_STORAGE_KEY)
    expect(stored).toContain('/explore/japan')
  })

  it('filters trails by collection tabs', () => {
    render(<TrailExplorer />)

    fireEvent.click(screen.getByRole('tab', { name: 'Space' }))

    const trailList = screen.getByRole('radiogroup', { name: 'Trails' })
    expect(within(trailList).getByRole('radio', { name: 'Inner Planets' })).toBeTruthy()
    expect(within(trailList).queryByRole('radio', { name: 'Pacific Ring' })).toBeNull()
  })

  it('hides completed checklist rows when the switch is on', () => {
    searchParams.set('trail', 'nebulae-tour')
    render(<TrailExplorer />)

    fireEvent.click(
      screen.getByRole('checkbox', { name: /Orion Nebula/ }),
    )
    fireEvent.click(screen.getByRole('switch', { name: 'Hide completed' }))

    expect(screen.queryByRole('checkbox', { name: /Orion Nebula/ })).toBeNull()
    expect(screen.getByRole('checkbox', { name: /Carina Nebula/ })).toBeTruthy()
  })
})
