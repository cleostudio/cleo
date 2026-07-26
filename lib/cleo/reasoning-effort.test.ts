import { describe, expect, it } from 'vitest'

import { selectReasoningEffort } from './reasoning-effort'

describe('selectReasoningEffort', () => {
  it('uses low effort for short greetings', () => {
    expect(
      selectReasoningEffort([{ role: 'user', content: 'Hey Cleo' }]),
    ).toBe('low')
    expect(
      selectReasoningEffort([{ role: 'user', content: 'thanks!' }]),
    ).toBe('low')
  })

  it('uses high effort for research and comparison asks', () => {
    expect(
      selectReasoningEffort([
        {
          role: 'user',
          content: 'Compare Mars and Earth with sources for the key tradeoffs.',
        },
      ]),
    ).toBe('high')
  })

  it('defaults to medium for ordinary portal questions', () => {
    expect(
      selectReasoningEffort([
        { role: 'user', content: 'Orient me to Japan in a few sentences.' },
      ]),
    ).toBe('medium')
  })
})
