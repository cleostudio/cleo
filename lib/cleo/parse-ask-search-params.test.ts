import { describe, expect, it } from 'vitest'

import {
  CLEO_ASK_TOPIC_PARAM,
  topicAskHref,
} from '~/lib/cleo/ask-links'
import {
  parseCleoAskSearchParams,
  promptFromTopicPath,
} from '~/lib/cleo/parse-ask-search-params'

describe('parseCleoAskSearchParams', () => {
  it('reads Next.js searchParams objects', () => {
    expect(
      parseCleoAskSearchParams({
        q: 'Why is Europa interesting?',
        auto: '1',
      }),
    ).toEqual({
      prompt: 'Why is Europa interesting?',
      autoSubmit: true,
    })
  })

  it('reads URLSearchParams and ignores blank q', () => {
    expect(
      parseCleoAskSearchParams(new URLSearchParams('q=%20&auto=true')),
    ).toBeNull()
    expect(
      parseCleoAskSearchParams(new URLSearchParams('q=hello&auto=yes')),
    ).toEqual({ prompt: 'hello', autoSubmit: true })
  })

  it('defaults autoSubmit to false for explicit q', () => {
    expect(parseCleoAskSearchParams({ q: 'hi' })).toEqual({
      prompt: 'hi',
      autoSubmit: false,
    })
  })

  it('resolves topic=explore|space/slug shortcuts with default auto-submit', () => {
    const japan = parseCleoAskSearchParams({ topic: 'explore/japan' })
    expect(japan?.autoSubmit).toBe(true)
    expect(japan?.prompt).toMatch(/Japan/)

    const mars = parseCleoAskSearchParams(
      new URLSearchParams('topic=space/mars&auto=0'),
    )
    expect(mars?.autoSubmit).toBe(false)
    expect(mars?.prompt).toMatch(/Mars/)

    expect(parseCleoAskSearchParams({ topic: 'explore/not-real' })).toBeNull()
    expect(promptFromTopicPath('explore/japan')).toMatch(/Japan/)
    expect(promptFromTopicPath('/explore/japan')).toMatch(/Japan/)
    expect(promptFromTopicPath('/space/europa')).toMatch(/Europa/)
    expect(promptFromTopicPath(`explore/${'x'.repeat(120)}`)).toBeNull()
    expect(topicAskHref('explore', 'japan')).toContain(
      `${CLEO_ASK_TOPIC_PARAM}=explore%2Fjapan`,
    )
  })

  it('prefers q= over topic= when both are present', () => {
    expect(
      parseCleoAskSearchParams({
        q: 'Custom prompt',
        topic: 'explore/japan',
        auto: '1',
      }),
    ).toEqual({ prompt: 'Custom prompt', autoSubmit: true })
  })
})
