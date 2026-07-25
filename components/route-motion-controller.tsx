'use client'

import { useEffect, useSyncExternalStore, ViewTransition } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'

const POST_LINK_SELECTOR = '[data-post-transition-link]'
const POST_LOADING_SHELL_SELECTOR = '[data-post-loading-shell]'
const ROUTE_MOTION_ATTRIBUTE = 'data-route-motion'
const VISITED_ATTRIBUTE = 'data-visited'

const routeMotionListeners = new Set<() => void>()

function isRouteMotionNone() {
  return document.documentElement.getAttribute(ROUTE_MOTION_ATTRIBUTE) === 'none'
}

function emitRouteMotionChange() {
  for (const listener of routeMotionListeners) listener()
}

function markInstantNavigation() {
  const root = document.documentElement
  const alreadyNone = root.getAttribute(ROUTE_MOTION_ATTRIBUTE) === 'none'
  root.setAttribute(ROUTE_MOTION_ATTRIBUTE, 'none')
  // Frequent dock / ordinary navigations skip entrance choreography on the
  // destination (design-language frequency principle).
  root.setAttribute(VISITED_ATTRIBUTE, '')
  if (!alreadyNone) {
    flushSync(() => {
      emitRouteMotionChange()
    })
  }
}

/**
 * Arm the shared post cover/title morph. Must commit ViewTransition props
 * before Next.js starts the route transition in the same click turn.
 */
export function armPostRouteMotion() {
  document.documentElement.removeAttribute(ROUTE_MOTION_ATTRIBUTE)
  flushSync(() => {
    emitRouteMotionChange()
  })
}

export function RouteMotionController() {
  useEffect(() => {
    function disableRouteMotion() {
      markInstantNavigation()
    }

    function preparePointerRoute(event: PointerEvent) {
      const target = event.target
      const opensPost =
        event.isPrimary &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        target instanceof Element &&
        target.closest(POST_LINK_SELECTOR) !== null

      if (!opensPost) {
        disableRouteMotion()
      }
    }

    document.addEventListener('pointerdown', preparePointerRoute, true)
    document.addEventListener('keydown', disableRouteMotion, true)
    window.addEventListener('popstate', disableRouteMotion)

    return () => {
      document.removeEventListener('pointerdown', preparePointerRoute, true)
      document.removeEventListener('keydown', disableRouteMotion, true)
      window.removeEventListener('popstate', disableRouteMotion)
    }
  }, [])

  return null
}

export function RouteViewTransition({ children }: { children: ReactNode }) {
  // Instant dock/ordinary nav must use default="none" so React skips
  // startViewTransition snapshots — zero-duration CSS still captured the
  // old/new trees and made heavy routes (Gallery) feel shaky.
  const instant = useSyncExternalStore(
    (onStoreChange) => {
      routeMotionListeners.add(onStoreChange)
      return () => {
        routeMotionListeners.delete(onStoreChange)
      }
    },
    isRouteMotionNone,
    () => true,
  )

  function handleUpdate() {
    return () => {
      if (document.querySelector(POST_LOADING_SHELL_SELECTOR) === null) {
        const root = document.documentElement
        root.setAttribute(ROUTE_MOTION_ATTRIBUTE, 'none')
        root.setAttribute(VISITED_ATTRIBUTE, '')
        emitRouteMotionChange()
      }
    }
  }

  return (
    <ViewTransition
      default={instant ? 'none' : 'route-content'}
      onUpdate={handleUpdate}
    >
      {children}
    </ViewTransition>
  )
}
