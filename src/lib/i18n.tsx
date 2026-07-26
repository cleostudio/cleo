'use client'

import type { ReactNode } from 'react'

import { formatDateEn } from '~/lib/date'

/** English-only text. The `zh` prop is accepted for call-site compatibility
 *  during cleanup and ignored. */
export function T({
  en,
  children,
}: {
  zh?: ReactNode
  en: ReactNode
  children?: ReactNode
}) {
  return <>{children ?? en}</>
}

export function LocalDate({
  date,
  dateTime,
  className,
}: {
  date: Date | string | number
  /** Ignored; English formatting is always used. */
  zhClassName?: string
  enClassName?: string
  dateTime?: string
  className?: string
}) {
  const value = date instanceof Date ? date : new Date(date)
  return (
    <time className={className} dateTime={dateTime ?? value.toISOString()}>
      {formatDateEn(value)}
    </time>
  )
}
