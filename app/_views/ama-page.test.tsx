// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AmaPageView } from './ama-page'
import { AMA_TOPICS } from '~/lib/ama/booking/topics'

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('AmaPageView', () => {
  it('presents the English AMA Session spec sheet', () => {
    const { container } = render(<AmaPageView locale="en" />)

    expect(screen.getByText('AMA')).toBeTruthy()
    expect(screen.getByText(/Answers are getting cheaper/)).toBeTruthy()
    expect(container.textContent).not.toContain('答案越来越便宜')
    expect(container.textContent).not.toContain('60 分钟')

    expect(screen.getByText('US$99')).toBeTruthy()
    expect(screen.getByText('60 minutes')).toBeTruthy()
    expect(container.textContent).toContain('24 hours')
    expect(container.textContent).toContain('Next 30 days')

    const introductionStage = container.querySelector(
      '[data-ama-introduction-stage]',
    )
    expect(introductionStage?.textContent).toContain('AI tools are the easy part')
    expect(introductionStage?.textContent).toContain('Judgment still decides')
    expect(introductionStage?.textContent).not.toContain('Those qualities show up')
    expect(introductionStage?.textContent).not.toContain('US$99')
    expect(introductionStage?.textContent).not.toContain('Who you are talking to')

    const nameplate = container.querySelector('.spec-nameplate')
    expect(nameplate?.textContent).toContain('US$99')
    expect(introductionStage?.contains(nameplate)).toBe(false)
  })

  it('lists all seven topics', () => {
    const en = render(<AmaPageView locale="en" />)

    expect(AMA_TOPICS.length).toBe(7)

    for (const enLabel of [
      'Web, iOS, and full-stack engineering',
      'Product strategy and design',
      'AI workflows and coding agents',
      'Career moves and cross-disciplinary work',
      'Startups, product building, and GTM',
      'Teams, collaboration, and leadership',
      'Anything else on your mind',
    ]) {
      expect(screen.getByText(enLabel)).toBeTruthy()
    }

    expect(en.container.textContent).toContain('self-hosted OpenClaw')
    expect(en.container.textContent).toContain('teams at Apple, Insta360')
    expect(en.container.textContent).toContain('game studios in Seattle')
    expect(en.container.textContent).toContain('Niantic, Microsoft, and Google')
    expect(en.container.textContent).toContain('Zolplay isn’t a one-person company')
    expect(en.container.textContent).not.toContain('one-person company (OPC)')
    expect(en.container.textContent).toContain('essential part of company culture')
    for (const tool of ['Linear', 'Codex', 'Claude Code', 'Slack', 'Cursor']) {
      expect(
        en.container.querySelectorAll(`[data-ama-product-name="${tool}"]`),
      ).toHaveLength(1)
    }
    expect(en.container.querySelectorAll('.ama-product-logo')).toHaveLength(5)
    expect(
      en.container.querySelectorAll(
        '[data-ama-product-name="Codex"] img[src="/images/codex.svg"]',
      ),
    ).toHaveLength(1)
  })

  it('states the 24 hour policy and carries the testimonials', () => {
    const en = render(<AmaPageView locale="en" />)

    expect(en.container.textContent).toContain('If we’re at least 24 hours out')
    expect(en.container.textContent).toContain('refunds are no longer automatic')
    expect(
      screen.getByText(/I have since received three offers and accepted one/),
    ).toBeTruthy()
    expect(
      screen.getByText(/skipping the three month probation/),
    ).toBeTruthy()
    expect(screen.getAllByText('An engineer, 2023').length).toBe(2)
    expect(screen.getByText('A university student, 2026')).toBeTruthy()
    expect(en.container.textContent).not.toContain('An AMA guest, 2026')
  })

  it('links the CTA to the booking flow and nothing legacy', () => {
    const en = render(<AmaPageView locale="en" />)

    const enCtas = screen.getAllByRole('link', { name: 'Book an hour' })
    expect(enCtas).toHaveLength(2)
    for (const link of enCtas) expect(link.getAttribute('href')).toBe('/ama/book')
    expect(en.container.textContent).not.toContain('约个时间')

    const html = en.container.innerHTML.toLowerCase()
    expect(html).not.toContain('alipay')
    expect(html).not.toContain('cal.com')
    expect(html).not.toContain('data-zh-block')
    expect(html).not.toContain('data-en-block')
  })
})
