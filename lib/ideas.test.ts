import { describe, expect, it } from 'vitest'

import {
  addIdea,
  createIdea,
  parseIdeas,
  removeIdea,
  serializeIdeas,
  sortIdeas,
  toggleIdeaDone,
  updateIdea,
} from './ideas'

describe('ideas storage model', () => {
  it('creates trimmed ideas and rejects empty titles', () => {
    const idea = createIdea('  Plan a moon guide  ', '  notes  ', 100, 'a')
    expect(idea).toEqual({
      id: 'a',
      title: 'Plan a moon guide',
      note: 'notes',
      done: false,
      createdAt: 100,
      updatedAt: 100,
    })
    expect(createIdea('   ')).toBeNull()
  })

  it('round-trips through JSON and drops invalid rows', () => {
    const ideas = addIdea([], 'Nebula essay')
    const raw = serializeIdeas(ideas)
    expect(parseIdeas(raw)).toEqual(ideas)
    expect(parseIdeas('not-json')).toEqual([])
    expect(parseIdeas(JSON.stringify([{ title: 'x' }, ideas[0]]))).toEqual([
      ideas[0],
    ])
  })

  it('toggles, updates, removes, and sorts open ideas first', () => {
    let ideas = addIdea([], 'First')
    ideas = addIdea(ideas, 'Second')
    const firstId = ideas[1]!.id
    const secondId = ideas[0]!.id

    ideas = toggleIdeaDone(ideas, firstId, 200)
    ideas = updateIdea(ideas, secondId, { note: 'expand' }, 300)
    expect(ideas.find((idea) => idea.id === secondId)?.note).toBe('expand')

    const sorted = sortIdeas(ideas)
    expect(sorted.map((idea) => idea.id)).toEqual([secondId, firstId])
    expect(sorted[1]?.done).toBe(true)

    expect(removeIdea(ideas, secondId).map((idea) => idea.id)).toEqual([firstId])
  })
})
