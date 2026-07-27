/** @vitest-environment jsdom */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AskCleoGuideLink, AskCleoSurfaceLink } from '~/components/ask-cleo-link'

describe('AskCleoGuideLink', () => {
  it('links into /cleo with an auto-submit orientation prompt', () => {
    render(<AskCleoGuideLink collection="explore" name="Japan" />)

    const link = screen.getByRole('link', { name: /Ask Cleo about Japan/i })
    const href = link.getAttribute('href') ?? ''
    expect(href.startsWith('/cleo?')).toBe(true)
    expect(href).toContain('q=')
    expect(href).toContain('auto=1')
    expect(decodeURIComponent(href)).toContain('Japan')
  })
})

describe('AskCleoSurfaceLink', () => {
  it('links Topics into a Cleo tour prompt', () => {
    render(<AskCleoSurfaceLink surface="topics" />)

    const link = screen.getByRole('link', { name: /Ask Cleo for a Topics tour/i })
    expect(link.getAttribute('href')).toContain('/cleo?')
  })
})
