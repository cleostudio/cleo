"use client"

import type { CSSProperties } from "react"
import { PanelLeftClose, PanelLeftOpen, SquarePen, Trash2 } from "lucide-react"

import { Button } from "~/components/cleo/ui/button"
import { ScrollAreaY } from "~/components/ui/scroll-area"
import type { CleoThreadSummary } from "~/lib/cleo/threads"
import { cn } from "~/lib/utils"

// Keep backdrop-filter inline — LightningCSS strips it from stylesheets
// (same constraint as DockGlass / dialog glass).
const SIDEBAR_BACKDROP_STYLE = {
  backdropFilter: "blur(6px) saturate(1.1)",
  WebkitBackdropFilter: "blur(6px) saturate(1.1)",
} satisfies CSSProperties

type CleoSidebarProps = {
  activeThreadId: string | null
  mobileOpen: boolean
  onCollapseDesktop: () => void
  onCloseMobile: () => void
  onDeleteThread: (threadId: string) => void
  onNewChat: () => void
  onSelectThread: (threadId: string) => void
  threads: readonly CleoThreadSummary[]
}

export function CleoSidebar({
  activeThreadId,
  mobileOpen,
  onCollapseDesktop,
  onCloseMobile,
  onDeleteThread,
  onNewChat,
  onSelectThread,
  threads,
}: CleoSidebarProps) {
  return (
    <>
      <div
        aria-hidden={!mobileOpen}
        className="cleo-sidebar-backdrop"
        data-open={mobileOpen || undefined}
        onClick={onCloseMobile}
        style={mobileOpen ? SIDEBAR_BACKDROP_STYLE : undefined}
      />
      <aside
        aria-label="Chat history"
        aria-modal={mobileOpen || undefined}
        className="cleo-sidebar"
        data-open={mobileOpen || undefined}
        id="cleo-sidebar"
        role={mobileOpen ? "dialog" : undefined}
      >
        <div className="cleo-sidebar-header">
          <Button
            className="cleo-sidebar-new-chat"
            onClick={() => {
              onNewChat()
              onCloseMobile()
            }}
            type="button"
            variant="outline"
          >
            <SquarePen aria-hidden="true" data-icon="inline-start" />
            New chat
          </Button>
          <Button
            aria-label="Close sidebar"
            className="cleo-sidebar-collapse"
            onClick={() => {
              // Mobile dismisses the drawer; desktop collapses the rail.
              if (window.matchMedia("(min-width: 64rem)").matches) {
                onCollapseDesktop()
              } else {
                onCloseMobile()
              }
            }}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <PanelLeftClose aria-hidden="true" />
          </Button>
        </div>

        <ScrollAreaY className="cleo-sidebar-scroll">
          {threads.length === 0 ? (
            <p className="cleo-sidebar-empty">No chats yet</p>
          ) : (
            <ul className="cleo-sidebar-list">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId
                return (
                  <li key={thread.id}>
                    <div
                      className={cn(
                        "cleo-sidebar-thread",
                        isActive && "cleo-sidebar-thread-active",
                      )}
                    >
                      <button
                        aria-current={isActive ? "true" : undefined}
                        className="cleo-sidebar-thread-button"
                        onClick={() => {
                          onSelectThread(thread.id)
                          onCloseMobile()
                        }}
                        type="button"
                      >
                        <span className="cleo-sidebar-thread-title">
                          {thread.title}
                        </span>
                      </button>
                      <button
                        aria-label={`Delete "${thread.title}"`}
                        className="cleo-sidebar-thread-delete"
                        onClick={() => onDeleteThread(thread.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </ScrollAreaY>
      </aside>
    </>
  )
}

type CleoSidebarToggleProps = {
  /** True when the mobile drawer is open (hides this FAB). */
  mobileOpen: boolean
  onOpenDesktop: () => void
  onToggleMobile: () => void
}

export function CleoSidebarToggle({
  mobileOpen,
  onOpenDesktop,
  onToggleMobile,
}: CleoSidebarToggleProps) {
  return (
    <Button
      aria-controls="cleo-sidebar"
      aria-expanded={mobileOpen}
      aria-label={mobileOpen ? "Close chat history" : "Open chat history"}
      className="cleo-sidebar-toggle"
      onClick={() => {
        // Desktop collapsed: expand the rail. Mobile: toggle the drawer.
        if (window.matchMedia("(min-width: 64rem)").matches) {
          onOpenDesktop()
          return
        }
        onToggleMobile()
      }}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {mobileOpen ? (
        <PanelLeftClose aria-hidden="true" />
      ) : (
        <PanelLeftOpen aria-hidden="true" />
      )}
    </Button>
  )
}
