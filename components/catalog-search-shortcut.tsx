'use client'

import { useEffect } from 'react'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

/** Press `/` to focus the page’s catalog search (home, indexes, gallery). */
export function CatalogSearchShortcut() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/') return
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
      if (event.repeat) return
      if (isTypingTarget(event.target)) return

      const input = document.querySelector<HTMLInputElement>(
        '[data-catalog-search]',
      )
      if (!input || input.disabled) return

      event.preventDefault()
      input.focus()
      input.select()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return null
}
