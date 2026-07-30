// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FooterClock } from './footer-clock'

function utcOffset(date: Date) {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteOffset = Math.abs(offsetMinutes)
  const hours = Math.floor(absoluteOffset / 60)
  const minutes = absoluteOffset % 60

  return `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-07-28T10:05:07Z'))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('FooterClock', () => {
  it('uses the visitor’s local time and UTC offset', () => {
    const { container } = render(<FooterClock />)
    const now = new Date()
    const expectedTime = new Intl.DateTimeFormat('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
    }).format(now)
    const readout = container.querySelector('.footer-time-readout')
    const time = container.querySelector('time')

    expect(readout?.textContent).toContain(utcOffset(now))
    expect(time?.textContent).toBe(expectedTime)
    expect(time?.getAttribute('aria-label')).toContain('Current local time')
    expect(container.textContent).not.toContain('Taipei')
  })
})
