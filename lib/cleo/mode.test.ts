import { describe, expect, it } from 'vitest'

import {
  applyModeReasoningEffort,
  buildModeInstructions,
  buildModeWebSearchTool,
  modeAllowsCodeInterpreter,
  modeMaxToolCalls,
  modeParallelToolCalls,
  modePromptCacheKey,
  modeReasoningContext,
  modeWebSearchContextSize,
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

  it('maps modes to OpenAI web_search context sizes', () => {
    expect(modeWebSearchContextSize('quick')).toBe('low')
    expect(modeWebSearchContextSize('auto')).toBe('medium')
    expect(modeWebSearchContextSize('research')).toBe('high')
    expect(buildModeWebSearchTool('research')).toEqual({
      type: 'web_search',
      search_context_size: 'high',
    })
  })

  it('scopes prompt cache keys and parallel tool calls by mode', () => {
    expect(modePromptCacheKey('auto')).toBe('cleo:agent:v1:auto')
    expect(modePromptCacheKey('research')).toBe('cleo:agent:v1:research')
    expect(modeParallelToolCalls('quick')).toBe(false)
    expect(modeParallelToolCalls('auto')).toBe(true)
  })

  it('maps modes to OpenAI reasoning.context', () => {
    expect(modeReasoningContext('quick')).toBe('current_turn')
    expect(modeReasoningContext('auto')).toBe('all_turns')
    expect(modeReasoningContext('research')).toBe('all_turns')
  })

  it('caps max_tool_calls by mode', () => {
    expect(modeMaxToolCalls('quick')).toBe(8)
    expect(modeMaxToolCalls('auto')).toBe(16)
    expect(modeMaxToolCalls('research')).toBe(24)
  })
})
