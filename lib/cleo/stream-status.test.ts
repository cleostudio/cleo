import { describe, expect, it } from 'vitest'

import {
  incompleteReasonFromApi,
  incompleteStatusMessage,
  parseStreamLine,
} from './stream'

describe('incomplete status helpers', () => {
  it('maps API and stopped reasons', () => {
    expect(incompleteReasonFromApi('max_output_tokens')).toBe(
      'max_output_tokens',
    )
    expect(incompleteReasonFromApi('stopped')).toBe('stopped')
    expect(incompleteReasonFromApi('tool_budget')).toBe('tool_budget')
    expect(incompleteReasonFromApi('mystery')).toBe('other')
    expect(incompleteStatusMessage('stopped')).toBe(
      'Stopped before finishing.',
    )
    expect(incompleteStatusMessage('tool_budget')).toContain('tool limit')
  })

  it('parses status incomplete events including stopped', () => {
    expect(
      parseStreamLine(
        JSON.stringify({
          type: 'status',
          status: 'incomplete',
          reason: 'stopped',
          message: 'Stopped before finishing.',
        }),
      ),
    ).toEqual({
      type: 'status',
      status: 'incomplete',
      reason: 'stopped',
      message: 'Stopped before finishing.',
    })
  })
})
