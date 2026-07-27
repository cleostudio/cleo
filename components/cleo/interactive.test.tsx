/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { InteractiveBlock } from './interactive'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

afterEach(() => {
  cleanup()
})

describe('InteractiveBlock', () => {
  it('renders follow-ups as chip buttons that submit prompts', () => {
    const onPrompt = vi.fn()
    const { container } = render(
      <InteractiveBlock
        block={{
          type: 'follow_ups',
          items: [{ label: 'Food culture', prompt: 'Tell me about Japanese food.' }],
        }}
        onPrompt={onPrompt}
      />,
    )

    expect(container.querySelector('.cleo-interactive-chip')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Food culture' }))
    expect(onPrompt).toHaveBeenCalledWith('Tell me about Japanese food.')
  })

  it('renders choices as full-width option cards', () => {
    const onPrompt = vi.fn()
    const { container } = render(
      <InteractiveBlock
        block={{
          type: 'choices',
          prompt: 'Which angle?',
          items: [
            { label: 'History', prompt: 'History of Europa.' },
            { label: 'Geology', prompt: 'Geology of Europa.' },
          ],
        }}
        onPrompt={onPrompt}
      />,
    )

    expect(screen.getByText('Which angle?')).toBeTruthy()
    expect(container.querySelectorAll('.cleo-interactive-choice')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Geology' }))
    expect(onPrompt).toHaveBeenCalledWith('Geology of Europa.')
  })

  it('renders portal actions as navigable cards', () => {
    const { container } = render(
      <InteractiveBlock
        block={{
          type: 'portal_actions',
          items: [{ label: 'Open Japan guide', href: '/explore/japan' }],
        }}
      />,
    )

    expect(container.querySelector('.cleo-interactive-portal')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Open Japan guide' }).getAttribute('href'),
    ).toBe('/explore/japan')
  })

  it('renders compare data inside a bordered plate', () => {
    const { container } = render(
      <InteractiveBlock
        block={{
          type: 'compare',
          title: 'Mars vs Earth',
          columns: ['Mars', 'Earth'],
          rows: [{ label: 'Moons', values: ['2', '1'] }],
        }}
      />,
    )

    expect(container.querySelector('.cleo-interactive-compare-plate')).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: 'Mars' })).toBeTruthy()
  })
})
