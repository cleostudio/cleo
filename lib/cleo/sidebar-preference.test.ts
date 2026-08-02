// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'

import { isSidebarCollapsed, setSidebarCollapsed } from './sidebar-preference'

afterEach(() => {
  window.localStorage.clear()
})

describe('cleo sidebar collapsed preference', () => {
  it('defaults to expanded so the desktop rail is visible', () => {
    expect(isSidebarCollapsed()).toBe(false)
  })

  it('persists collapse and expand across reads', () => {
    setSidebarCollapsed(true)
    expect(isSidebarCollapsed()).toBe(true)

    setSidebarCollapsed(false)
    expect(isSidebarCollapsed()).toBe(false)
    expect(window.localStorage.getItem('cleo-sidebar-collapsed')).toBeNull()
  })
})
