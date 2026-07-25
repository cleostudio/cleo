// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { AmbientBackground } from './ambient-background'

afterEach(cleanup)

describe('AmbientBackground', () => {
  it('keeps edge fades outside Tailwind scroll utilities', () => {
    const { container } = render(<AmbientBackground />)

    expect(container.querySelectorAll('.viewport-edge-fade')).toHaveLength(2)
    expect(container.querySelector('[class*="scroll-fade"]')).toBeNull()
  })

  it('still renders drafting guides for non-Cleo routes to hide via CSS', () => {
    const { container } = render(<AmbientBackground />)

    expect(container.querySelector('.column-guides')).not.toBeNull()
    expect(container.querySelector('.column-rulers')).not.toBeNull()
    expect(container.querySelector('.paper-grain')).not.toBeNull()
  })
})
