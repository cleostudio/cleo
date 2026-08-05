import { describe, expect, it } from 'vitest'

import {
  buildUserProfileInstructions,
  sanitizeUserDisplayName,
} from './user-profile'

describe('sanitizeUserDisplayName', () => {
  it('trims and collapses whitespace', () => {
    expect(sanitizeUserDisplayName('  Ada   Lovelace  ')).toBe('Ada Lovelace')
  })

  it('strips control characters and angle brackets', () => {
    expect(
      sanitizeUserDisplayName('Ada\u0000 <script>Lovelace</cleo_user_profile>'),
    ).toBe('Ada scriptLovelace/cleo_user_profile')
  })

  it('rejects empty or non-string values', () => {
    expect(sanitizeUserDisplayName('')).toBeNull()
    expect(sanitizeUserDisplayName('   ')).toBeNull()
    expect(sanitizeUserDisplayName(null)).toBeNull()
    expect(sanitizeUserDisplayName(42)).toBeNull()
  })

  it('caps display names at 80 characters', () => {
    const long = 'A'.repeat(100)
    expect(sanitizeUserDisplayName(long)).toHaveLength(80)
  })
})

describe('buildUserProfileInstructions', () => {
  it('builds a private instruction block for a usable name', () => {
    const instructions = buildUserProfileInstructions('Ada Lovelace')

    expect(instructions).toContain('<cleo_user_profile>')
    expect(instructions).toContain('Preferred name: Ada Lovelace')
    expect(instructions).toContain('Do not force the name into every reply')
    expect(instructions).toContain('<cleo_user_memory>')
  })

  it('returns undefined when the name is unusable', () => {
    expect(buildUserProfileInstructions('   ')).toBeUndefined()
    expect(buildUserProfileInstructions('<>')).toBeUndefined()
  })
})
