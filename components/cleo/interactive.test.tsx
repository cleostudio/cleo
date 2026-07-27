/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { InteractiveBlock } from './interactive'

afterEach(() => {
  cleanup()
})

describe('InteractiveBlock generative widgets', () => {
  it('switches tab panels in place with keyboard support', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'tabs',
          title: 'Japan at a glance',
          tabs: [
            { label: 'Geography', body: 'Four main islands.' },
            { label: 'Culture', body: 'Continuity and reinvention.' },
          ],
        }}
      />,
    )

    expect(screen.getByText('Four main islands.')).toBeTruthy()
    fireEvent.click(screen.getByRole('tab', { name: 'Culture' }))
    expect(screen.getByText('Continuity and reinvention.')).toBeTruthy()
    expect(screen.queryByText('Four main islands.')).toBeNull()

    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' })
    expect(screen.getByText('Four main islands.')).toBeTruthy()
  })

  it('expands multiple timeline events independently', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'timeline',
          title: 'Apollo',
          events: [
            { when: '1961', title: 'Goal set', detail: 'Kennedy speech.' },
            { when: '1969', title: 'Landing', detail: 'Moon walk.' },
          ],
        }}
      />,
    )

    expect(screen.queryByText('Kennedy speech.')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Goal set/i }))
    expect(screen.getByText('Kennedy speech.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Landing/i }))
    expect(screen.getByText('Moon walk.')).toBeTruthy()
    expect(screen.getByText('Kennedy speech.')).toBeTruthy()
  })

  it('expands fact details on tap', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'facts',
          title: 'Europa',
          items: [
            { label: 'Primary', value: 'Jupiter' },
            {
              label: 'Ocean',
              value: 'Under ice',
              detail: 'Kept liquid by tidal flexing.',
            },
          ],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Ocean/i }))
    expect(screen.getByText('Kept liquid by tidal flexing.')).toBeTruthy()
  })

  it('focuses compare subjects from the subject row', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'compare',
          title: 'Mars vs Earth',
          columns: ['Mars', 'Earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }}
      />,
    )

    const mars = screen.getByRole('button', { name: 'Mars' })
    expect(mars.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Earth' }))
    expect(
      screen.getByRole('button', { name: 'Earth' }).getAttribute('aria-pressed'),
    ).toBe('true')
    expect(mars.getAttribute('aria-pressed')).toBe('false')
  })
})
