/** @vitest-environment jsdom */

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const useSession = vi.fn()

vi.mock('~/lib/auth-client', () => ({
  authClient: {
    useSession: () => useSession(),
    signOut: vi.fn(),
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), replace: vi.fn() }),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode
    href: string
    prefetch?: boolean
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('~/lib/sound', () => ({
  playPreferenceSound: vi.fn(),
  setSoundEnabled: vi.fn(),
  soundEnabled: () => false,
}))

import { AccountPreferenceRows } from '~/components/preferences'

describe('AccountPreferenceRows', () => {
  afterEach(() => {
    cleanup()
    useSession.mockReset()
  })

  it('shows Sign in while the session is still pending', () => {
    useSession.mockReturnValue({
      data: null,
      isPending: true,
    })

    render(<AccountPreferenceRows locale="en" />)

    expect(screen.getByText('Sign in')).toBeTruthy()
    expect(screen.queryByText('Account')).toBeNull()
  })

  it('shows Sign in for a resolved anonymous session', () => {
    useSession.mockReturnValue({
      data: null,
      isPending: false,
    })

    render(<AccountPreferenceRows locale="en" />)

    expect(screen.getByText('Sign in')).toBeTruthy()
    expect(screen.queryByText('Account')).toBeNull()
  })

  it('shows Account and Sign out when signed in', () => {
    useSession.mockReturnValue({
      data: { user: { name: 'Cleo', email: 'cleo@example.com' } },
      isPending: false,
    })

    render(<AccountPreferenceRows locale="en" />)

    expect(screen.getByText('Account')).toBeTruthy()
    expect(screen.getByText('Sign out')).toBeTruthy()
    expect(screen.queryByText('Sign in')).toBeNull()
  })
})
