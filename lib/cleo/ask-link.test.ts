/** @vitest-environment jsdom */

import { afterEach, describe, expect, it } from 'vitest'

import {
  cleoAskHref,
  clearCleoPromptFromLocation,
  MAX_CLEO_PROMPT_PARAM_LENGTH,
  parseCleoPromptParam,
  readCleoPromptFromLocation,
} from './ask-link'

describe('cleoAskHref', () => {
  it('encodes the question into the Cleo route', () => {
    expect(cleoAskHref('Why is Europa interesting?')).toBe(
      '/cleo?q=Why%20is%20Europa%20interesting%3F',
    )
  })

  it('falls back to a plain Cleo link for an empty question', () => {
    expect(cleoAskHref('   ')).toBe('/cleo')
  })

  it('keeps the link within the shareable prompt limit', () => {
    const href = cleoAskHref('a'.repeat(MAX_CLEO_PROMPT_PARAM_LENGTH + 50))
    expect(parseCleoPromptParam(new URL(href, 'https://cleo.test').search)).toBe(
      'a'.repeat(MAX_CLEO_PROMPT_PARAM_LENGTH),
    )
  })

  it('round-trips a question through the query string', () => {
    const question = 'Compare Mars and Earth — 50% of the way there?'
    const search = new URL(cleoAskHref(question), 'https://cleo.test').search
    expect(parseCleoPromptParam(search)).toBe(question)
  })
})

describe('parseCleoPromptParam', () => {
  it('reads and trims the prompt parameter', () => {
    expect(parseCleoPromptParam('?q=%20Orient%20me%20to%20Japan%20')).toBe(
      'Orient me to Japan',
    )
    expect(parseCleoPromptParam('q=Mars')).toBe('Mars')
  })

  it('ignores a missing, blank, or oversized prompt', () => {
    expect(parseCleoPromptParam('')).toBeNull()
    expect(parseCleoPromptParam('?other=Mars')).toBeNull()
    expect(parseCleoPromptParam('?q=')).toBeNull()
    expect(parseCleoPromptParam('?q=%20%20')).toBeNull()
    expect(
      parseCleoPromptParam(`?q=${'a'.repeat(MAX_CLEO_PROMPT_PARAM_LENGTH + 1)}`),
    ).toBeNull()
  })

  it('takes the first value when the parameter repeats', () => {
    expect(parseCleoPromptParam('?q=Mars&q=Earth')).toBe('Mars')
  })
})

describe('readCleoPromptFromLocation', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('reads the handoff prompt without consuming it', () => {
    window.history.replaceState(null, '', cleoAskHref('Orient me to Japan'))

    expect(readCleoPromptFromLocation()).toBe('Orient me to Japan')
    // The URL stays the carrier until a turn claims the question, so a chat
    // shell that re-runs its arrival pass still finds it.
    expect(readCleoPromptFromLocation()).toBe('Orient me to Japan')
    expect(window.location.search).toBe('?q=Orient%20me%20to%20Japan')
  })

  it('leaves an ordinary visit alone', () => {
    window.history.replaceState(null, '', '/cleo')
    expect(readCleoPromptFromLocation()).toBeNull()
    expect(window.location.pathname).toBe('/cleo')
  })
})

describe('clearCleoPromptFromLocation', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('drops the parameter so a reload does not re-run the turn', () => {
    window.history.replaceState(null, '', cleoAskHref('Orient me to Japan'))

    clearCleoPromptFromLocation()

    expect(window.location.pathname).toBe('/cleo')
    expect(window.location.search).toBe('')
    expect(readCleoPromptFromLocation()).toBeNull()
  })

  it('keeps the rest of the URL intact', () => {
    window.history.replaceState(null, '', '/cleo?q=Mars&ref=home#answer')

    clearCleoPromptFromLocation()

    expect(`${window.location.search}${window.location.hash}`).toBe(
      '?ref=home#answer',
    )
  })

  it('leaves a URL without a handoff untouched', () => {
    window.history.replaceState(null, '', '/cleo#answer')

    clearCleoPromptFromLocation()

    expect(`${window.location.pathname}${window.location.hash}`).toBe(
      '/cleo#answer',
    )
  })
})
