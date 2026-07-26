import { describe, expect, it } from 'vitest'

import {
  applyModeReasoningEffort,
  buildModeInstructions,
  modeAllowsCodeInterpreter,
  parseCleoMode,
} from './mode'

describe('cleo mode', () => {
  it('parses known modes and defaults to auto', () => {
    expect(parseCleoMode('research')).toBe('research')
    expect(parseCleoMode('nope')).toBe('auto')
  })

  it('floors research to high and caps quick away from high', () => {
    expect(applyModeReasoningEffort('research', 'low')).toBe('high')
    expect(applyModeReasoningEffort('quick', 'high')).toBe('medium')
    expect(applyModeReasoningEffort('auto', 'medium')).toBe('medium')
  })

  it('disables code interpreter in quick mode', () => {
    expect(modeAllowsCodeInterpreter('quick')).toBe(false)
    expect(modeAllowsCodeInterpreter('auto')).toBe(true)
    expect(buildModeInstructions('research')).toContain('Mode: research')
  })
})
