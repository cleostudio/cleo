'use client'

import { Popover } from '@base-ui/react/popover'
import { Monitor, Moon, Sun, Volume2, VolumeX } from 'lucide-react'

import { PreferencesIcon } from '~/components/dock-icons'
import { useTheme } from '~/components/theme-provider'
import { useEffect, useState } from 'react'

import { Switch } from '~/components/ui/switch'
import { TabItem, Tabs, TabsList } from '~/components/ui/tabs'
import {
  isLocationSyncEnabled,
  setLocationSyncEnabled,
} from '~/lib/cleo/location-preference'
import { Elevated } from '~/lib/elevated'
import { T } from '~/lib/i18n'
import { localize, useLocale } from '~/lib/locale-client'
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

// Preferences panel: theme and UI sound as full-width fluid tabs.
export function Preferences() {
  const activeLocale = useLocale()
  const { theme, setTheme } = useTheme()
  const [locationSync, setLocationSync] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLocationSync(isLocationSyncEnabled())
    setSound(soundEnabled())
  }, [])

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
              <Switch
                aria-label={localize(activeLocale, '与 Cleo 分享位置', 'Share location with Cleo')}
                checked={locationSync}
                disabled={!mounted}
                onCheckedChange={(enabled) => {
                  setLocationSyncEnabled(enabled)
                  setLocationSync(enabled)
                  playPreferenceSound()
                }}
              />
            </Row>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
