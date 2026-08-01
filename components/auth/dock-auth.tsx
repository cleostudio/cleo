'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useSession, signOut } from '~/lib/auth-client'
import {
  clearSessionHintCookie,
  hasSessionHintCookie,
  syncSessionHintFromSession,
} from '~/lib/auth-session-hint'
import { isSyntheticEmail } from '~/lib/auth-synthetic-email'
import { T } from '~/lib/i18n'
import { localize, useLocale } from '~/lib/locale-client'
import { playPreferenceSound } from '~/lib/sound'

type HintState = 'absent' | 'present'

/**
 * Auth-aware Preferences chrome. Gated by the session hint cookie so
 * signed-out visitors never mount `useSession()` (which fetches on mount).
 */
function readHintPresent(): boolean {
  if (typeof document === 'undefined') return false
  return (
    document.documentElement.dataset.sessionHint === '1' ||
    hasSessionHintCookie()
  )
}

export function DockAuthPreferencesRows() {
  // Mounted only after Preferences' client effect, so `document` is available
  // and the prepaint `data-session-hint` attribute is already set.
  const [hint, setHint] = useState<HintState>(() =>
    readHintPresent() ? 'present' : 'absent',
  )

  if (hint === 'absent') {
    return <DockAuthSignedOutRows />
  }

  return <DockAuthSessionRows onHintCleared={() => setHint('absent')} />
}

function DockAuthSignedOutRows() {
  const locale = useLocale()

  return (
    <div className="prefs-admin">
      <Link
        href="/sign-in"
        className="prefs-row prefs-admin"
        aria-label={localize(locale, '登录', 'Sign in')}
      >
        <span className="prefs-row-label">
          <T zh="登录" en="Sign in" />
        </span>
      </Link>
    </div>
  )
}

function DockAuthSessionRows({
  onHintCleared,
}: {
  onHintCleared: () => void
}) {
  const locale = useLocale()
  const { data, isPending } = useSession()

  useEffect(() => {
    if (isPending) return
    syncSessionHintFromSession(data?.session ?? null)
    if (!data?.session) {
      onHintCleared()
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset.sessionHint
      }
    } else if (typeof document !== 'undefined') {
      document.documentElement.dataset.sessionHint = '1'
    }
  }, [data?.session, isPending, onHintCleared])

  if (isPending) {
    return (
      <div className="prefs-admin">
        <div className="prefs-row">
          <span className="prefs-row-label">
            <T zh="账户加载中…" en="Account…" />
          </span>
        </div>
      </div>
    )
  }

  if (!data?.user) {
    return <DockAuthSignedOutRows />
  }

  const displayName = data.user.name?.trim() || 'Signed in'
  // Never surface the synthetic passkey email in the UI.
  const subtitle =
    data.user.email && !isSyntheticEmail(data.user.email)
      ? data.user.email
      : null

  return (
    <div className="prefs-admin">
      <div className="prefs-row">
        <span className="prefs-row-label">
          <span className="block truncate text-foreground">{displayName}</span>
          {subtitle ? (
            <span className="block truncate text-[11px] text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </span>
      </div>
      <button
        type="button"
        className="prefs-row prefs-admin prefs-signout"
        aria-label={localize(locale, '退出登录', 'Sign out')}
        onClick={async () => {
          playPreferenceSound()
          await signOut()
          clearSessionHintCookie()
          if (typeof document !== 'undefined') {
            delete document.documentElement.dataset.sessionHint
          }
          onHintCleared()
        }}
      >
        <span className="prefs-row-label">
          <T zh="退出登录" en="Sign out" />
        </span>
      </button>
    </div>
  )
}
