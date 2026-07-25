/** @vitest-environment jsdom */

import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TimeAllocationChart } from './time-allocation-chart'

afterEach(cleanup)

describe('TimeAllocationChart', () => {
  it('keeps the English takeaway, values, and estimate caveat visible', () => {
    const { container } = render(<TimeAllocationChart locale="en" />)
    const chart = screen.getByRole('group', {
      name: 'Baby tracking app development time allocation',
    })

    expect(
      within(chart).getByText('95% of the time went into judgment and refinement'),
    ).toBeTruthy()
    expect(within(chart).getByText('Decisions, UX, and refinement')).toBeTruthy()
    expect(
      container
        .querySelector('[data-tone="context"]')
        ?.getAttribute('style'),
    ).toContain('--allocation: 5%')
    expect(
      container
        .querySelector('[data-tone="primary"]')
        ?.getAttribute('style'),
    ).toContain('--allocation: 50%')
    expect(
      container
        .querySelector('[data-tone="secondary"]')
        ?.getAttribute('style'),
    ).toContain('--allocation: 45%')
  })
})
