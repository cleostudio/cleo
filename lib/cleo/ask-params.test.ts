import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  clearCleoAskParamsFromLocation,
  stripCleoAskParams,
  urlHasCleoAskParams,
} from '~/lib/cleo/ask-params'

describe('cleo ask params', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects q, auto, and topic', () => {
    expect(urlHasCleoAskParams(new URL('https://cleo.example/cleo'))).toBe(
      false,
    )
    expect(
      urlHasCleoAskParams(new URL('https://cleo.example/cleo?topic=explore/japan')),
    ).toBe(true)
    expect(
      urlHasCleoAskParams(new URL('https://cleo.example/cleo?q=hi&auto=1')),
    ).toBe(true)
  })

  it('strips every Ask param key', () => {
    const url = new URL(
      'https://cleo.example/cleo?topic=space/mars&q=hi&auto=1&keep=1',
    )
    expect(stripCleoAskParams(url)).toBe(true)
    expect(url.searchParams.get('topic')).toBeNull()
    expect(url.searchParams.get('q')).toBeNull()
    expect(url.searchParams.get('auto')).toBeNull()
    expect(url.searchParams.get('keep')).toBe('1')
    expect(stripCleoAskParams(url)).toBe(false)
  })

  it('clears Ask params from window.location via replaceState', () => {
    const replaceState = vi.fn()
    vi.stubGlobal('window', {
      location: {
        href: 'https://cleo.example/cleo?topic=explore/japan&auto=1',
      },
      history: { state: { from: 'test' }, replaceState },
    })

    expect(clearCleoAskParamsFromLocation()).toBe(true)
    expect(replaceState).toHaveBeenCalledWith(
      { from: 'test' },
      '',
      '/cleo',
    )
  })
})
