// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { IdeasPlanner } from './ideas-planner'
import { IDEAS_STORAGE_KEY } from '~/lib/ideas'

vi.mock('~/components/hidden-list-stage', () => ({
  TopicsBlueprintStage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ideas-stage">{children}</div>
  ),
}))

afterEach(() => {
  cleanup()
  localStorage.clear()
})

beforeEach(() => {
  localStorage.clear()
})

describe('IdeasPlanner', () => {
  it('adds an idea and persists it in localStorage', async () => {
    render(<IdeasPlanner />)

    await waitFor(() => {
      expect(screen.getByText(/No ideas yet/i)).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText('Idea'), {
      target: { value: 'Deep-space photo essay' },
    })
    fireEvent.change(screen.getByLabelText(/Notes/), {
      target: { value: 'Pair with nebulae guides' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add idea' }))

    expect(screen.getByText('Deep-space photo essay')).toBeTruthy()
    expect(screen.getByText('Pair with nebulae guides')).toBeTruthy()

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(IDEAS_STORAGE_KEY) ?? '[]') as Array<{
        title: string
      }>
      expect(stored[0]?.title).toBe('Deep-space photo essay')
    })
  })

  it('marks ideas done and removes them', async () => {
    localStorage.setItem(
      IDEAS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'idea-1',
          title: 'Atlas contact sheet',
          note: '',
          done: false,
          createdAt: 1,
          updatedAt: 1,
        },
      ]),
    )

    render(<IdeasPlanner />)

    await waitFor(() => {
      expect(screen.getByText('Atlas contact sheet')).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.getByRole('button', { name: 'Reopen' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText('Atlas contact sheet')).toBeNull()
  })
})
