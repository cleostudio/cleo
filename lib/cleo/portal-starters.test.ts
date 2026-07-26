import { describe, expect, it } from 'vitest'

import {
  CLEO_PORTAL_STARTER_POOL,
  portalStarterDayKey,
  selectPortalStarters,
} from './portal-starters'

describe('selectPortalStarters', () => {
  it('ships a diverse pool beyond the original three prompts', () => {
    const topics = new Set(CLEO_PORTAL_STARTER_POOL.map((starter) => starter.topic))
    expect(topics.has('gallery')).toBe(true)
    expect(topics.has('topics')).toBe(true)
    expect(topics.has('compare')).toBe(true)
    expect(topics.has('next-read')).toBe(true)
    expect(topics.has('photo')).toBe(true)
    expect(CLEO_PORTAL_STARTER_POOL.length).toBeGreaterThanOrEqual(12)
  })

  it('returns three starters from distinct topics for a day', () => {
    const starters = selectPortalStarters(portalStarterDayKey(new Date('2026-07-26T12:00:00Z')))
    expect(starters).toHaveLength(3)
    expect(new Set(starters.map((starter) => starter.topic)).size).toBe(3)
    expect(starters.every((starter) => starter.prompt.length > 20)).toBe(true)
  })

  it('rotates the topic set across days', () => {
    const a = selectPortalStarters(10).map((starter) => starter.topic).join(',')
    const b = selectPortalStarters(11).map((starter) => starter.topic).join(',')
    expect(a).not.toBe(b)
  })
})
