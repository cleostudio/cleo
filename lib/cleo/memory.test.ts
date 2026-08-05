import { describe, expect, it } from 'vitest'

import {
  buildUserMemoryInstructions,
  CLEO_MEMORY_BLOCK_MAX,
  CLEO_MEMORY_NOTE_MAX,
  parseMemoryNoteBody,
  sanitizeMemoryNote,
  selectNotesForInjection,
} from '~/lib/cleo/memory'

describe('sanitizeMemoryNote', () => {
  it('trims, strips controls/brackets, and caps length', () => {
    expect(sanitizeMemoryNote('  Prefer metric units  ')).toBe(
      'Prefer metric units',
    )
    expect(
      sanitizeMemoryNote('Keep <cleo_user_memory> out\u0000 of notes'),
    ).toBe('Keep cleo_user_memory out of notes')
    expect(sanitizeMemoryNote('x'.repeat(CLEO_MEMORY_NOTE_MAX + 40))).toHaveLength(
      CLEO_MEMORY_NOTE_MAX,
    )
  })

  it('rejects empty values', () => {
    expect(sanitizeMemoryNote('')).toBeNull()
    expect(sanitizeMemoryNote('   ')).toBeNull()
    expect(sanitizeMemoryNote(null)).toBeNull()
  })
})

describe('parseMemoryNoteBody', () => {
  it('accepts a valid note and rejects invalid bodies', () => {
    expect(parseMemoryNoteBody({ note: 'I live in Kyoto' })).toEqual({
      ok: true,
      note: 'I live in Kyoto',
    })
    expect(parseMemoryNoteBody({ note: '' }).ok).toBe(false)
    expect(parseMemoryNoteBody(null).ok).toBe(false)
  })
})

describe('buildUserMemoryInstructions', () => {
  it('builds a bounded private memory block', () => {
    const block = buildUserMemoryInstructions([
      {
        id: '1',
        note: 'Prefer short answers',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        note: 'Interested in rivers',
        createdAt: '2026-01-02T00:00:00.000Z',
      },
    ])

    expect(block).toContain('<cleo_user_memory>')
    expect(block).toContain('Prefer short answers')
    expect(block).toContain('Interested in rivers')
    expect(block).toContain('Do not invent memories')
    expect(block!.length).toBeLessThanOrEqual(CLEO_MEMORY_BLOCK_MAX)
  })

  it('returns undefined when there are no notes', () => {
    expect(buildUserMemoryInstructions([])).toBeUndefined()
  })

  it('drops oldest notes first when the block budget is exceeded', () => {
    const notes = Array.from({ length: 30 }, (_, index) => ({
      id: String(index),
      note: `Preference note number ${index} with enough text to fill space`,
      createdAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
    }))

    const selected = selectNotesForInjection(notes, 400)
    expect(selected.length).toBeGreaterThan(0)
    expect(selected.length).toBeLessThan(notes.length)
    // Newest retained.
    expect(selected.at(-1)?.note).toContain('number 29')
  })
})
