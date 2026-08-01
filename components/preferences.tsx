'use client'

import { Popover } from '@base-ui/react/popover'
import { MapPin, MapPinOff, Monitor, Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { PreferencesIcon } from '~/components/dock-icons'
import { useTheme } from '~/components/theme-provider'
import { TabItem, Tabs, TabsList } from '~/components/ui/tabs'
import { authClient } from '~/lib/auth-client'
import { hydrateLocationSyncFromAccount } from '~/lib/cleo/location-preference-account'
import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
} from '~/lib/cleo/location-preference'
import { Elevated } from '~/lib/elevated'
import { T } from '~/lib/i18n'
import { localize, useLocale } from '~/lib/locale-client'
import { localePath } from '~/lib/locale-route'
import {
  playPreferenceSound,
  setSoundEnabled,
  soundEnabled,
} from '~/lib/sound'

function Row({ zh, en, children }: { zh: string; en: string; children: React.ReactNode }) {
  return (
    <div className="prefs-row">
      <span className="prefs-row-label">
        <T zh={zh} en={en} />
      </span>
      {children}
    </div>
  )
}

// Preferences panel: theme, UI sound, and location as full-width fluid tabs.
export function Preferences() {
  const activeLocale = useLocale()
  const { theme, setTheme } = useTheme()
  const [locationSync, setLocationSync] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sound, setSound] = useState(false)

  // Keep the Better Auth session atom subscribed for the dock's lifetime.
  // The Preferences portal unmounts when closed; without this warm
  // subscription every open remounts useSession into isPending and the
  // account row flashes the wrong label.
  const { data: session } = authClient.useSession()
  const signedInUserId = session?.user?.id
  const accountLocationSync = session?.user?.locationSyncEnabled

  useEffect(() => {
    setMounted(true)
    setLocationSync(isLocationSyncEnabled())
    setSound(soundEnabled())
  }, [])

  // Signed-in account is canonical: restore quietly (no geolocation prompt).
  useEffect(() => {
    if (!signedInUserId) return
    const enabled = hydrateLocationSyncFromAccount(accountLocationSync)
    if (enabled !== null) setLocationSync(enabled)
  }, [signedInUserId, accountLocationSync])

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <button
            type="button"
            className="dock-item"
            aria-label={localize(activeLocale, '偏好设置', 'Preferences')}
            disabled={!mounted}
          >
            <PreferencesIcon />
            <span className="dock-tip" aria-hidden>
              <T zh="偏好" en="Preferences" />
            </span>
          </button>
        }
      />
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={14}
          positionMethod="fixed"
          className="z-[var(--z-card)] outline-none"
        >
          <Popover.Popup
            aria-label={localize(activeLocale, '偏好设置', 'Preferences')}
            initialFocus
            finalFocus
            render={<Elevated offset={2} shadowLevel={3} />}
            className="prefs-panel w-max rounded-xl outline-none"
          >
            <Row zh="外观" en="Theme">
              <Tabs
                value={mounted && theme ? theme : 'system'}
                onValueChange={(v) => {
                  setTheme(v)
                  playPreferenceSound()
                }}
              >
                <TabsList aria-label={localize(activeLocale, '外观', 'Theme')}>
                  <TabItem value="light" icon={Sun} label="" aria-label={localize(activeLocale, '浅色', 'Light')} />
                  <TabItem value="system" icon={Monitor} label="" aria-label={localize(activeLocale, '系统', 'System')} />
                  <TabItem value="dark" icon={Moon} label="" aria-label={localize(activeLocale, '深色', 'Dark')} />
                </TabsList>
              </Tabs>
            </Row>
            <Row zh="音效" en="Sound">
              <Tabs
                value={mounted && sound ? 'on' : 'off'}
                onValueChange={(v) => {
                  const on = v === 'on'
                  if (!on) playPreferenceSound()
                  setSoundEnabled(on)
                  setSound(on)
                  if (on) playPreferenceSound()
                }}
              >
                <TabsList aria-label={localize(activeLocale, '音效', 'Sound')}>
                  <TabItem value="on" icon={Volume2} label="" aria-label={localize(activeLocale, '开', 'On')} />
                  <TabItem value="off" icon={VolumeX} label="" aria-label={localize(activeLocale, '关', 'Off')} />
                </TabsList>
              </Tabs>
            </Row>
            <Row zh="位置" en="Location">
              <Tabs
                value={mounted && locationSync ? 'on' : 'off'}
                onValueChange={(v) => {
                  const on = v === 'on'
                  if (!on) playPreferenceSound()
                  setLocationSyncEnabled(on)
                  setLocationSync(on)
                  if (signedInUserId) {
                    void authClient.updateUser({ locationSyncEnabled: on })
                  }
                  if (on) playPreferenceSound()
                }}
              >
                <TabsList
                  aria-label={localize(activeLocale, '与 Cleo 分享位置', 'Share location with Cleo')}
                >
                  <TabItem
                    value="on"
                    icon={MapPin}
                    label=""
                    aria-label={localize(activeLocale, '开', 'On')}
                  />
                  <TabItem
                    value="off"
                    icon={MapPinOff}
                    label=""
                    aria-label={localize(activeLocale, '关', 'Off')}
                  />
                </TabsList>
              </Tabs>
            </Row>
            <AccountPreferenceRows locale={activeLocale} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

/** Exported for unit tests; keeps the Preferences account row logic isolated. */
export function AccountPreferenceRows({
  locale,
}: {
  locale: ReturnType<typeof useLocale>
}) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [signingOut, setSigningOut] = useState(false)
  const signedIn = Boolean(session?.user)

  async function signOut() {
    setSigningOut(true)
    try {
      await authClient.signOut()
      playPreferenceSound()
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  // Anonymous is the default: while the session is unresolved, keep the
  // Sign in row so guests never see Account flash into Sign in.
  if (isPending || !signedIn) {
    return (
      <Link
        href={localePath(locale, '/sign-in')}
        className="prefs-row prefs-admin"
        aria-busy={isPending || undefined}
        onClick={() => playPreferenceSound()}
      >
        <span className="prefs-row-label">
          <T zh="登录" en="Sign in" />
        </span>
      </Link>
    )
  }

  return (
    <>
      <Link
        href={localePath(locale, '/account')}
        className="prefs-row prefs-admin"
        onClick={() => playPreferenceSound()}
      >
        <span className="prefs-row-label">
          <T zh="账户" en="Account" />
        </span>
      </Link>
      <button
        type="button"
        className="prefs-row prefs-admin prefs-signout"
        disabled={signingOut}
        onClick={() => void signOut()}
      >
        <span className="prefs-row-label">
          <T zh="退出登录" en={signingOut ? 'Signing out…' : 'Sign out'} />
        </span>
      </button>
    </>
  )
}
