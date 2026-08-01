import { describe, expect, it } from 'vitest'

import { isThreadId, newThreadId } from './thread-id'

describe('thread ids', () => {
  it('generates client UUIDs suitable for Stage 2 primary keys', () => {
    const id = newThreadId()
    expect(isThreadId(id)).toBe(true)
    expect(newThreadId()).not.toBe(id)
  })

  it('rejects non-uuid strings', () => {
    expect(isThreadId('cleo')).toBe(false)
    expect(isThreadId('')).toBe(false)
  })
})
