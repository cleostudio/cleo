/**
 * Desktop Cleo history-rail collapsed preference (localStorage).
 * Mobile uses an ephemeral drawer and ignores this flag.
 */

const SIDEBAR_COLLAPSED_STORAGE_KEY = "cleo-sidebar-collapsed"
const SIDEBAR_COLLAPSED_VALUE = "1"

function canUseStorage() {
  return typeof window !== "undefined"
}

export function isSidebarCollapsed() {
  if (!canUseStorage()) return false

  try {
    return (
      window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) ===
      SIDEBAR_COLLAPSED_VALUE
    )
  } catch {
    return false
  }
}

export function setSidebarCollapsed(collapsed: boolean) {
  if (!canUseStorage()) return

  try {
    if (collapsed) {
      window.localStorage.setItem(
        SIDEBAR_COLLAPSED_STORAGE_KEY,
        SIDEBAR_COLLAPSED_VALUE,
      )
    } else {
      window.localStorage.removeItem(SIDEBAR_COLLAPSED_STORAGE_KEY)
    }
  } catch {
    return
  }
}
