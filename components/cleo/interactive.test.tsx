/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { InteractiveBlock } from './interactive'

afterEach(() => {
  cleanup()
})

describe('InteractiveBlock generative widgets', () => {
  it('switches tab panels in place', () => {
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
  })

  it('checks quiz answers and reveals explanation', () => {
    render(
      <InteractiveBlock
        block={{
          type: 'quiz',
          question: 'Which moon has an ocean?',
          options: [
            { id: 'a', label: 'Io' },
            { id: 'b', label: 'Europa' },
          ],
          answer: 'b',
          explanation: 'Europa hides a global ocean under ice.',
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Europa' }))
    expect(screen.getByText('Correct.')).toBeTruthy()
    expect(
      screen.getByText('Europa hides a global ocean under ice.'),
    ).toBeTruthy()
  })

  it('expands timeline and fact details on tap', () => {
    const { rerender } = render(
      <InteractiveBlock
        block={{
          type: 'timeline',
          title: 'Apollo',
          events: [
            { when: '1961', title: 'Goal set', detail: 'Kennedy speech.' },
            { when: '1969', title: 'Landing' },
          ],
        }}
      />,
    )

    expect(screen.getByText('Kennedy speech.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Goal set/i }))
    expect(screen.queryByText('Kennedy speech.')).toBeNull()

    rerender(
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

  it('focuses compare columns when a header is pressed', () => {
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
    fireEvent.click(mars)
    expect(mars.getAttribute('aria-pressed')).toBe('true')
  })
})
