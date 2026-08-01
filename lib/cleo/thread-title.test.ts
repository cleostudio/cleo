import { describe, expect, it } from 'vitest'

import { titleFromFirstUserMessage } from './thread-title'

describe('titleFromFirstUserMessage', () => {
  it('returns a default for empty input', () => {
    expect(titleFromFirstUserMessage('')).toBe('New conversation')
    expect(titleFromFirstUserMessage('   ')).toBe('New conversation')
  })

  it('keeps short titles intact and truncates on a word boundary', () => {
    expect(titleFromFirstUserMessage('What is Mars?')).toBe('What is Mars?')
    const long =
      'Tell me about the history of cartography across several continents and eras in detail please'
    const title = titleFromFirstUserMessage(long)
    expect(title.endsWith('…')).toBe(true)
    expect(title.length).toBeLessThanOrEqual(65)
    expect(title.includes('  ')).toBe(false)
  })
})
