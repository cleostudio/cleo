"use client"

import {
  type ChangeEvent,
  type FormEvent,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { CornerRightUp, Plus, Square, X } from "lucide-react"
import { ThinkingOrb } from "thinking-orbs"

import { ActivityPanel } from "~/components/cleo/activity-panel"
import { LiquidGlass } from "~/components/cleo/liquid-glass"
import { Markdown } from "~/components/cleo/markdown"
import { CleoSidebar, CleoSidebarToggle } from "~/components/cleo/sidebar"
import { Button } from "~/components/cleo/ui/button"
import { Input } from "~/components/cleo/ui/input"
import { ZoomableMessageImage } from "~/components/cleo/zoomable-message-image"
import { takeCleoPromptFromLocation } from "~/lib/cleo/ask-link"
import {
  filesToMessageImages,
  IMAGE_ACCEPT,
  MAX_IMAGES_PER_MESSAGE,
} from "~/lib/cleo/client-images"
import { requestUserLocation } from "~/lib/cleo/client-location"
import { readCachedUserLocation } from "~/lib/cleo/location-cache"
import type { UserLocation } from "~/lib/cleo/location"
import {
  isLocationSyncEnabled,
  subscribeToLocationSync,
} from "~/lib/cleo/location-preference"
import {
  CONTINUE_PROMPT,
  makeIncomplete,
  messageHasVisibleContent,
  type MessageIncomplete,
  toConversationPayload,
} from "~/lib/cleo/conversation-helpers"
import { CLEO_PORTAL_STARTERS } from "~/lib/cleo/portal-links"
import type { EncryptedReasoningItem } from "~/lib/cleo/reasoning-items"
import { isDocumentNearBottom } from "~/lib/cleo/stick-to-bottom"
import {
  type ActivityItem,
  type MessageImage,
  parseStreamLine,
} from "~/lib/cleo/stream"
import {
  isSidebarCollapsed,
  setSidebarCollapsed as persistSidebarCollapsed,
} from "~/lib/cleo/sidebar-preference"
import {
  createThreadId,
  deleteThread,
  getThread,
  listThreadSummaries,
  readThreadsStore,
  setActiveThreadId as persistActiveThreadId,
  subscribeToThreads,
  type CleoThreadSummary,
  upsertThread,
} from "~/lib/cleo/threads"

const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
}

type Message = {
  activities?: ActivityItem[]
  content: string
  /** Hide from the transcript UI (still sent to the API). */
  hidden?: boolean
  id: number
  images?: MessageImage[]
  incomplete?: MessageIncomplete
  reasoningItems?: EncryptedReasoningItem[]
  role: "assistant" | "user"
}

type TurnRequest = {
  /** Clear incomplete markers on prior assistant turns after success. */
  clearPriorIncomplete?: boolean
  hideUserMessage?: boolean
  history: Message[]
  question: string
  userImages: MessageImage[]
}

type PendingThreadScrollRestore = {
  scrollY: number
  threadId: string
}

type ThreadScrollDebugData = {
  activeThread: number | null
  actualY: number
  hasSavedPosition?: boolean
  reachedExpected?: boolean
  savedY: number | null
  scrollTick?: number
  targetThread: number | null
}

function documentScrollMetrics() {
  const scrollHeight = document.documentElement.scrollHeight
  const innerHeight = window.innerHeight
  return {
    innerHeight,
    maxY: Math.max(0, scrollHeight - innerHeight),
    scrollHeight,
  }
}

function postThreadScrollDebug(
  message:
    | "save-outgoing-position"
    | "prepare-thread-position"
    | "restore-skipped-active-mismatch"
    | "restore-before-scroll"
    | "restore-after-scroll"
    | "restore-post-paint"
    | "auto-follow-scroll",
  hypothesisId: "A" | "B" | "C" | "D",
  data: ThreadScrollDebugData & {
    innerHeight: number
    maxY: number
    scrollHeight: number
    sequence: number
  },
) {
  if (process.env.NODE_ENV !== "development") return

  void fetch("/api/agent-debug/thread-scroll", {
    body: JSON.stringify({ data, hypothesisId, message, timestamp: Date.now() }),
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST",
  }).catch(() => undefined)
}

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  )
}

function upsertActivity(
  activities: ActivityItem[] | undefined,
  activity: ActivityItem
) {
  const current = activities ?? []
  const index = current.findIndex((item) => item.id === activity.id)

  if (index === -1) {
    return [...current, activity]
  }

  const previous = current[index]
  const next = [...current]
  next[index] = {
    ...previous,
    ...activity,
    action: activity.action ?? previous.action,
    summary: activity.summary ?? previous.summary,
  }
  return next
}

function upsertMessageImage(
  images: MessageImage[] | undefined,
  image: MessageImage
) {
  const current = images ?? []
  const index = current.findIndex((item) => item.id === image.id)

  if (index === -1) {
    return [...current, image]
  }

  const next = [...current]
  next[index] = image
  return next
}

function lastUserMessageIndex(
  messages: readonly Message[],
  options?: { includeHidden?: boolean }
) {
  const includeHidden = options?.includeHidden ?? false
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message?.role !== "user") continue
    if (!includeHidden && message.hidden) continue
    return index
  }
  return -1
}

type UserMessageProps = {
  message: Message
}

const UserMessage = memo(function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="user-turn">
      {message.images && message.images.length > 0 ? (
        <div className="user-message-images">
          {message.images.map((image, index) => (
            <ZoomableMessageImage
              alt={
                message.content
                  ? `Attachment ${index + 1}`
                  : `Uploaded image ${index + 1}`
              }
              className="message-image"
              key={image.id ?? `${message.id}-${index}`}
              src={image.url}
            />
          ))}
        </div>
      ) : null}
      {message.content ? (
        <div className="glass-surface user-message">
          <LiquidGlass />
          <span className="user-message-text">{message.content}</span>
        </div>
      ) : null}
    </div>
  )
})

type AssistantMessageProps = {
  canContinueIncomplete: boolean
  canRetryLastTurn: boolean
  isLive: boolean
  message: Message
  onContinue: () => void
  onDismissIncomplete: () => void
  onRetry: () => void
  showIncompleteActions: boolean
}

const AssistantMessage = memo(function AssistantMessage({
  canContinueIncomplete,
  canRetryLastTurn,
  isLive,
  message,
  onContinue,
  onDismissIncomplete,
  onRetry,
  showIncompleteActions,
}: AssistantMessageProps) {
  const incompleteNoteId = message.incomplete
    ? `cleo-incomplete-${message.id}`
    : undefined

  return (
    <section aria-label="AI response" aria-live="polite" className="min-w-0">
      {message.activities && message.activities.length > 0 ? (
        <ActivityPanel activities={message.activities} isLive={isLive} />
      ) : null}

      {message.images && message.images.length > 0 ? (
        <div className="assistant-message-images mb-3">
          {message.images.map((image, index) => (
            <ZoomableMessageImage
              alt={`Generated image ${index + 1}`}
              className="message-image message-image-assistant"
              key={image.id ?? `${message.id}-${index}`}
              src={image.url}
            />
          ))}
        </div>
      ) : null}

      {message.content ? (
        <Markdown isAnimating={isLive}>{message.content}</Markdown>
      ) : isLive &&
        !(message.activities && message.activities.length > 0) &&
        !(message.images && message.images.length > 0) ? (
        <ThinkingOrb
          aria-label="Listening"
          className="block"
          size={20}
          state="listening"
        />
      ) : null}

      {!isLive && message.incomplete ? (
        <div className="cleo-answer-actions">
          <p
            className="cleo-incomplete-note"
            id={incompleteNoteId}
            role="status"
          >
            {message.incomplete.message}
          </p>
          {showIncompleteActions ? (
            <div className="cleo-answer-action-row">
              <button
                aria-describedby={incompleteNoteId}
                aria-label="Continue this answer"
                className="cleo-answer-action"
                disabled={!canContinueIncomplete}
                onClick={onContinue}
                type="button"
              >
                Continue
              </button>
              <button
                aria-label="Dismiss the incomplete notice"
                className="cleo-answer-action"
                onClick={onDismissIncomplete}
                type="button"
              >
                Dismiss
              </button>
              <button
                aria-label="Retry the last question"
                className="cleo-answer-action"
                disabled={!canRetryLastTurn}
                onClick={onRetry}
                type="button"
              >
                Retry
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
})

export function AskForm({ initialPrompt }: { initialPrompt?: string }) {
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [location, setLocation] = useState<UserLocation | null>(() =>
    isLocationSyncEnabled() ? readCachedUserLocation() : null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [scrollTick, setScrollTick] = useState(0)
  const [threadSummaries, setThreadSummaries] = useState<CleoThreadSummary[]>(
    [],
  )
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarPreferenceReady, setSidebarPreferenceReady] = useState(false)
  const [isDesktopSidebar, setIsDesktopSidebar] = useState(() => {
    if (typeof window === "undefined") return false
    if (typeof window.matchMedia !== "function") return false
    return window.matchMedia("(min-width: 64rem)").matches
  })
  const [threadsHydrated, setThreadsHydrated] = useState(false)
  const [threadScrollRestoreTick, setThreadScrollRestoreTick] = useState(0)
  const sidebarLandmarkActive = isDesktopSidebar
    ? !sidebarCollapsed
    : sidebarMobileOpen
  const sidebarClosedControlsActive = isDesktopSidebar
    ? sidebarCollapsed
    : !sidebarMobileOpen
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<Message[]>([])
  const activeThreadIdRef = useRef<string | null>(null)
  const threadScrollPositionsRef = useRef(new Map<string, number>())
  const pendingThreadScrollRestoreRef =
    useRef<PendingThreadScrollRestore | null>(null)
  const isSubmittingRef = useRef(false)
  const mountedRef = useRef(true)
  const stickToBottomRef = useRef(true)
  const lastScrollYRef = useRef(0)
  const threadScrollDebugLabelsRef = useRef(new Map<string, number>())
  const threadScrollDebugNextLabelRef = useRef(1)
  const threadScrollDebugSequenceRef = useRef(0)

  const hasMessages = messages.some((message) => !message.hidden)
  const lastVisibleMessage = [...messages]
    .reverse()
    .find((message) => !message.hidden && message.role === "assistant")
  const lastUserIndex = lastUserMessageIndex(messages)
  const canRetryLastTurn = !isSubmitting && lastUserIndex >= 0
  const canContinueIncomplete =
    !isSubmitting && Boolean(lastVisibleMessage?.incomplete)
  const canSubmit =
    !isSubmitting && (Boolean(input.trim()) || pendingImages.length > 0)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId
  }, [activeThreadId])

  const replaceMessages = useCallback((nextMessages: Message[]) => {
    // Keep the persistence snapshot synchronized with the requested thread,
    // even when another sidebar click arrives before React commits this render.
    messagesRef.current = nextMessages
    setMessages(nextMessages)
  }, [])

  const threadScrollDebugLabel = useCallback((threadId: string | null) => {
    if (!threadId) return null

    const existing = threadScrollDebugLabelsRef.current.get(threadId)
    if (existing !== undefined) return existing

    const next = threadScrollDebugNextLabelRef.current++
    threadScrollDebugLabelsRef.current.set(threadId, next)
    return next
  }, [])

  const logThreadScroll = useCallback(
    (
      message: Parameters<typeof postThreadScrollDebug>[0],
      hypothesisId: Parameters<typeof postThreadScrollDebug>[1],
      data: ThreadScrollDebugData,
    ) => {
      postThreadScrollDebug(message, hypothesisId, {
        ...documentScrollMetrics(),
        ...data,
        sequence: threadScrollDebugSequenceRef.current++,
      })
    },
    [],
  )

  const saveActiveThreadScrollPosition = useCallback(() => {
    const threadId = activeThreadIdRef.current
    if (!threadId) return

    const savedY = Math.max(0, window.scrollY)
    threadScrollPositionsRef.current.set(threadId, savedY)
    // #region agent log
    logThreadScroll("save-outgoing-position", "A", {
      activeThread: threadScrollDebugLabel(threadId),
      actualY: window.scrollY,
      savedY,
      targetThread: null,
    })
    // #endregion
  }, [logThreadScroll, threadScrollDebugLabel])

  /**
   * A previously viewed thread returns exactly where its reader left off.
   * First visits preserve the prior behavior: follow the latest reply.
   */
  const prepareThreadScrollPosition = useCallback((threadId: string) => {
    const savedScrollY = threadScrollPositionsRef.current.get(threadId)
    // #region agent log
    logThreadScroll("prepare-thread-position", "A", {
      activeThread: threadScrollDebugLabel(activeThreadIdRef.current),
      actualY: window.scrollY,
      hasSavedPosition: savedScrollY !== undefined,
      savedY: savedScrollY ?? null,
      targetThread: threadScrollDebugLabel(threadId),
    })
    // #endregion

    if (savedScrollY === undefined) {
      stickToBottomRef.current = true
      setScrollTick((tick) => tick + 1)
      return
    }

    pendingThreadScrollRestoreRef.current = {
      scrollY: savedScrollY,
      threadId,
    }
    // Do not let the streaming-follow effect overwrite the saved position.
    stickToBottomRef.current = false
    setThreadScrollRestoreTick((tick) => tick + 1)
  }, [logThreadScroll, threadScrollDebugLabel])

  useLayoutEffect(() => {
    const pending = pendingThreadScrollRestoreRef.current
    if (!pending) return
    if (pending.threadId !== activeThreadId) {
      // #region agent log
      logThreadScroll("restore-skipped-active-mismatch", "D", {
        activeThread: threadScrollDebugLabel(activeThreadId),
        actualY: window.scrollY,
        savedY: pending.scrollY,
        targetThread: threadScrollDebugLabel(pending.threadId),
      })
      // #endregion
      return
    }

    // Layout phase guarantees the selected thread's DOM is present before the
    // document scroll is restored, avoiding a visible visit to its top/end.
    // #region agent log
    logThreadScroll("restore-before-scroll", "B", {
      activeThread: threadScrollDebugLabel(activeThreadId),
      actualY: window.scrollY,
      savedY: pending.scrollY,
      targetThread: threadScrollDebugLabel(pending.threadId),
    })
    // #endregion
    window.scrollTo(0, pending.scrollY)
    // #region agent log
    logThreadScroll("restore-after-scroll", "B", {
      activeThread: threadScrollDebugLabel(activeThreadId),
      actualY: window.scrollY,
      reachedExpected: window.scrollY === pending.scrollY,
      savedY: pending.scrollY,
      targetThread: threadScrollDebugLabel(pending.threadId),
    })
    // #endregion
    lastScrollYRef.current = window.scrollY
    stickToBottomRef.current = false
    pendingThreadScrollRestoreRef.current = null

    let postPaintFrame: number | null = null
    const frame = window.requestAnimationFrame(() => {
      postPaintFrame = window.requestAnimationFrame(() => {
        // #region agent log
        logThreadScroll("restore-post-paint", "C", {
          activeThread: threadScrollDebugLabel(activeThreadIdRef.current),
          actualY: window.scrollY,
          reachedExpected: window.scrollY === pending.scrollY,
          savedY: pending.scrollY,
          targetThread: threadScrollDebugLabel(pending.threadId),
        })
        // #endregion
      })
    })

    return () => {
      window.cancelAnimationFrame(frame)
      if (postPaintFrame !== null) {
        window.cancelAnimationFrame(postPaintFrame)
      }
    }
  }, [
    activeThreadId,
    logThreadScroll,
    threadScrollDebugLabel,
    threadScrollRestoreTick,
  ])

  // Restore browser-only thread history once. A `/cleo?q=…` handoff starts a
  // fresh thread so the arrival ask does not append onto a restored chat.
  useEffect(() => {
    const store = readThreadsStore()
    setThreadSummaries(listThreadSummaries(store))

    const arrivalPending = Boolean(
      (initialPrompt ?? new URLSearchParams(window.location.search).get("q"))
        ?.trim(),
    )

    if (arrivalPending) {
      const id = createThreadId()
      activeThreadIdRef.current = id
      setActiveThreadId(id)
      setThreadsHydrated(true)
      return
    }

    if (store.activeThreadId) {
      const thread = getThread(store.activeThreadId, store)
      if (thread) {
        activeThreadIdRef.current = thread.id
        setActiveThreadId(thread.id)
        replaceMessages(thread.messages as Message[])
        messageIdRef.current = thread.nextMessageId
        setThreadsHydrated(true)
        return
      }
    }

    const id = createThreadId()
    activeThreadIdRef.current = id
    setActiveThreadId(id)
    setThreadsHydrated(true)
  }, [initialPrompt, replaceMessages])

  useEffect(() => {
    return subscribeToThreads(() => {
      setThreadSummaries(listThreadSummaries())
    })
  }, [])

  // Desktop rail collapsed preference — restore before paint so the column
  // offset does not flash open then shut. Wait to persist until after hydrate
  // so the initial `false` state cannot wipe a stored collapse.
  useLayoutEffect(() => {
    const collapsed = isSidebarCollapsed()
    setSidebarCollapsed(collapsed)
    const root = document.documentElement
    if (collapsed) {
      root.setAttribute("data-cleo-sidebar-collapsed", "")
    } else {
      root.removeAttribute("data-cleo-sidebar-collapsed")
    }
    setSidebarPreferenceReady(true)
  }, [])

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const media = window.matchMedia("(min-width: 64rem)")
    const sync = () => setIsDesktopSidebar(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!sidebarPreferenceReady) return
    const root = document.documentElement
    if (sidebarCollapsed) {
      root.setAttribute("data-cleo-sidebar-collapsed", "")
    } else {
      root.removeAttribute("data-cleo-sidebar-collapsed")
    }
    persistSidebarCollapsed(sidebarCollapsed)
  }, [sidebarCollapsed, sidebarPreferenceReady])

  // Mobile drawer: mirror open state onto <html> for overlay CSS / scroll lock,
  // dismiss on Escape, and close the drawer when the viewport grows into the rail.
  useEffect(() => {
    const root = document.documentElement
    if (sidebarMobileOpen) {
      root.setAttribute("data-cleo-sidebar-open", "")
    } else {
      root.removeAttribute("data-cleo-sidebar-open")
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarMobileOpen(false)
      }
    }
    const onResize = () => {
      if (window.matchMedia("(min-width: 64rem)").matches) {
        setSidebarMobileOpen(false)
      }
    }

    if (sidebarMobileOpen) {
      window.addEventListener("keydown", onKeyDown)
    }
    window.addEventListener("resize", onResize)
    return () => {
      root.removeAttribute("data-cleo-sidebar-open")
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("resize", onResize)
    }
  }, [sidebarMobileOpen])

  // Persist the active thread (debounced while streaming so localStorage is
  // not rewritten on every token).
  useEffect(() => {
    if (!threadsHydrated) return
    const threadId = activeThreadIdRef.current
    if (!threadId) return

    const delay = isSubmitting ? 400 : 0
    const timer = window.setTimeout(() => {
      const store = upsertThread({
        id: threadId,
        messages: messagesRef.current,
        nextMessageId: messageIdRef.current,
      })
      setThreadSummaries(listThreadSummaries(store))
    }, delay)

    return () => window.clearTimeout(timer)
  }, [messages, isSubmitting, threadsHydrated, activeThreadId])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const syncStickToBottom = () => {
      const scrollY = window.scrollY
      const nearBottom = isDocumentNearBottom(
        scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
      )

      // Auto-follow only scrolls downward. Any upward move is the user
      // reading back — unstick even on short pages where "near bottom" is
      // otherwise always true.
      if (scrollY + 8 < lastScrollYRef.current) {
        stickToBottomRef.current = false
      } else if (nearBottom) {
        stickToBottomRef.current = true
      }

      lastScrollYRef.current = scrollY
    }

    window.addEventListener("scroll", syncStickToBottom, { passive: true })
    window.addEventListener("resize", syncStickToBottom)
    return () => {
      window.removeEventListener("scroll", syncStickToBottom)
      window.removeEventListener("resize", syncStickToBottom)
    }
  }, [])

  useEffect(() => {
    if (!hasMessages || !stickToBottomRef.current) return
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "instant",
    })
    // #region agent log
    logThreadScroll("auto-follow-scroll", "C", {
      activeThread: threadScrollDebugLabel(activeThreadIdRef.current),
      actualY: window.scrollY,
      savedY: null,
      scrollTick,
      targetThread: null,
    })
    // #endregion
    // Keep the baseline in sync so the follow-scroll itself is not read as
    // a user gesture on the next event.
    lastScrollYRef.current = window.scrollY
  }, [hasMessages, logThreadScroll, scrollTick, threadScrollDebugLabel])

  useEffect(() => {
    if (!isSubmitting && hasMessages) {
      inputRef.current?.focus()
    }
  }, [hasMessages, isSubmitting])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    let isCurrent = true
    let locationRequestId = 0

    const syncLocation = (enabled: boolean, allowPrompt: boolean) => {
      locationRequestId += 1
      const requestId = locationRequestId

      if (!enabled) {
        setLocation(null)
        return
      }

      // Page restore must not re-open the browser permission dialog. Only an
      // explicit Preferences toggle may prompt; refresh restores quietly when
      // the browser already granted geolocation, or from the last cached fix.
      void requestUserLocation({ allowPrompt })
        .then((nextLocation) => {
          if (isCurrent && locationRequestId === requestId) {
            setLocation(nextLocation)
          }
        })
        .catch(() => {
          if (isCurrent && locationRequestId === requestId) {
            setLocation(readCachedUserLocation())
          }
        })
    }

    syncLocation(isLocationSyncEnabled(), false)
    const unsubscribe = subscribeToLocationSync(({ allowPrompt, enabled }) => {
      syncLocation(enabled, allowPrompt)
    })

    return () => {
      isCurrent = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (hasMessages) {
      root.removeAttribute("data-cleo-empty")
    } else {
      root.setAttribute("data-cleo-empty", "")
    }
    return () => {
      root.removeAttribute("data-cleo-empty")
    }
  }, [hasMessages])

  const sendTurnRef = useRef<(request: TurnRequest) => Promise<void>>(
    async () => undefined
  )
  // undefined: not read yet · string: waiting to be asked · null: done or none.
  const arrivalQuestionRef = useRef<string | null | undefined>(undefined)

  // A handoff from elsewhere on the site — the homepage search bar, or a shared
  // `/cleo?q=…` link — asks its question once, on arrival.
  //
  // The question is read from the URL on the first pass and held here, because
  // reading it also strips the parameter. Sending waits a tick and cancels on
  // cleanup, so a remount cancels the attempt outright instead of aborting a
  // request that is already in flight.
  useEffect(() => {
    if (arrivalQuestionRef.current === undefined) {
      arrivalQuestionRef.current =
        (initialPrompt ?? takeCleoPromptFromLocation())?.trim() || null
    }

    const question = arrivalQuestionRef.current
    if (!question) return

    const timer = window.setTimeout(() => {
      arrivalQuestionRef.current = null
      void sendTurnRef.current({ history: [], question, userImages: [] })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [initialPrompt])

  function handleStop() {
    abortControllerRef.current?.abort()
  }

  const resetComposer = useCallback(() => {
    setInput("")
    setPendingImages([])
    setError(null)
  }, [])

  const handleNewChat = useCallback(() => {
    const alreadyEmpty =
      !isSubmittingRef.current &&
      !messagesRef.current.some((message) => !message.hidden)

    if (alreadyEmpty) {
      resetComposer()
      return
    }

    if (isSubmittingRef.current) {
      abortControllerRef.current?.abort()
    }

    const currentId = activeThreadIdRef.current
    if (currentId) {
      saveActiveThreadScrollPosition()
      upsertThread({
        id: currentId,
        messages: messagesRef.current,
        nextMessageId: messageIdRef.current,
        active: false,
      })
    }

    const id = createThreadId()
    activeThreadIdRef.current = id
    setActiveThreadId(id)
    persistActiveThreadId(null)
    replaceMessages([])
    messageIdRef.current = 0
    resetComposer()
    stickToBottomRef.current = true
    setThreadSummaries(listThreadSummaries())
  }, [replaceMessages, resetComposer, saveActiveThreadScrollPosition])

  const handleSelectThread = useCallback(
    (threadId: string) => {
      if (threadId === activeThreadIdRef.current) return

      if (isSubmittingRef.current) {
        abortControllerRef.current?.abort()
      }

      const currentId = activeThreadIdRef.current
      if (currentId) {
        saveActiveThreadScrollPosition()
        upsertThread({
          id: currentId,
          messages: messagesRef.current,
          nextMessageId: messageIdRef.current,
          active: false,
        })
      }

      const thread = getThread(threadId)
      if (!thread) {
        setThreadSummaries(listThreadSummaries())
        return
      }

      activeThreadIdRef.current = thread.id
      setActiveThreadId(thread.id)
      persistActiveThreadId(thread.id)
      replaceMessages(thread.messages as Message[])
      messageIdRef.current = thread.nextMessageId
      resetComposer()
      prepareThreadScrollPosition(thread.id)
      setThreadSummaries(listThreadSummaries())
    },
    [
      prepareThreadScrollPosition,
      replaceMessages,
      resetComposer,
      saveActiveThreadScrollPosition,
    ],
  )

  const handleDeleteThread = useCallback(
    (threadId: string) => {
      const wasActive = threadId === activeThreadIdRef.current
      if (wasActive && isSubmittingRef.current) {
        abortControllerRef.current?.abort()
      }

      const store = deleteThread(threadId)
      setThreadSummaries(listThreadSummaries(store))

      if (!wasActive) return

      if (store.activeThreadId) {
        const thread = getThread(store.activeThreadId, store)
        if (thread) {
          activeThreadIdRef.current = thread.id
          setActiveThreadId(thread.id)
          replaceMessages(thread.messages as Message[])
          messageIdRef.current = thread.nextMessageId
          resetComposer()
          prepareThreadScrollPosition(thread.id)
          return
        }
      }

      const id = createThreadId()
      activeThreadIdRef.current = id
      setActiveThreadId(id)
      replaceMessages([])
      messageIdRef.current = 0
      resetComposer()
    },
    [prepareThreadScrollPosition, replaceMessages, resetComposer],
  )

  // Stable callbacks so memoized AssistantMessage rows do not churn on parent
  // re-renders while sendTurn itself is recreated each render.
  const handleRetry = useCallback(() => {
    if (isSubmittingRef.current) return
    const current = messagesRef.current
    const userIndex = lastUserMessageIndex(current)
    if (userIndex < 0) return
    const lastUser = current[userIndex]!
    void sendTurnRef.current({
      history: current.slice(0, userIndex),
      question: lastUser.content,
      userImages: lastUser.images ?? [],
    })
  }, [])

  const handleContinue = useCallback(() => {
    if (isSubmittingRef.current) return
    void sendTurnRef.current({
      history: messagesRef.current,
      question: CONTINUE_PROMPT,
      userImages: [],
      hideUserMessage: true,
      clearPriorIncomplete: true,
    })
  }, [])

  const handleDismissIncomplete = useCallback(() => {
    if (isSubmittingRef.current) return
    const target = [...messagesRef.current]
      .reverse()
      .find((message) => !message.hidden && message.role === "assistant")
    if (!target?.incomplete) return
    setMessages((current) =>
      current.map((message) =>
        message.id === target.id
          ? { ...message, incomplete: undefined }
          : message
      )
    )
  }, [])

  function removePendingImage(index: number) {
    setPendingImages((current) => current.filter((_, i) => i !== index))
  }

  async function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    // FileList is live — copy files before clearing the input so the same
    // file can be re-selected and the selection is not wiped mid-handler.
    const selectedFiles = Array.from(event.target.files ?? [])
    event.target.value = ""

    if (selectedFiles.length === 0) {
      return
    }

    const remaining = MAX_IMAGES_PER_MESSAGE - pendingImages.length

    if (remaining <= 0) {
      setError(`Attach up to ${MAX_IMAGES_PER_MESSAGE} images per message.`)
      return
    }

    try {
      const selected = selectedFiles.slice(0, remaining)
      const urls = await filesToMessageImages(selected)
      setPendingImages((current) =>
        [...current, ...urls].slice(0, MAX_IMAGES_PER_MESSAGE)
      )
      setError(null)
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : "Could not attach that image."
      )
    }
  }

  async function sendTurn({
    history,
    question,
    userImages,
    hideUserMessage = false,
    clearPriorIncomplete = false,
  }: TurnRequest) {
    if (isSubmittingRef.current) return

    const userMessage: Message = {
      content: question,
      id: messageIdRef.current++,
      role: "user",
      ...(hideUserMessage ? { hidden: true } : {}),
      ...(userImages.length > 0 ? { images: userImages } : {}),
    }
    const assistantMessage: Message = {
      activities: [],
      content: "",
      id: messageIdRef.current++,
      images: [],
      role: "assistant",
    }

    const conversation = [
      ...toConversationPayload(history),
      {
        role: "user" as const,
        content: question,
        ...(userImages.length > 0 ? { images: userImages } : {}),
      },
    ]

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    isSubmittingRef.current = true
    stickToBottomRef.current = true
    setMessages([...history, userMessage, assistantMessage])
    setInput("")
    setPendingImages([])
    setError(null)
    setIsSubmitting(true)
    setScrollTick((tick) => tick + 1)

    let output = ""
    let receivedImages = false
    let receivedActivities = false
    let sawIncomplete = false

    // rAF-batched stream UI updates — one setMessages per frame.
    let pendingText = ""
    let pendingActivities: ActivityItem[] = []
    let pendingImagesById = new Map<string, MessageImage>()
    let pendingReasoningItems: EncryptedReasoningItem[] | null = null
    let pendingIncomplete: MessageIncomplete | null = null
    let rafHandle: number | null = null

    const flushPending = () => {
      rafHandle = null
      if (!mountedRef.current) return

      const textChunk = pendingText
      const activitiesChunk = pendingActivities
      const imagesChunk = [...pendingImagesById.values()]
      const reasoningChunk = pendingReasoningItems
      const incompleteChunk = pendingIncomplete

      pendingText = ""
      pendingActivities = []
      pendingImagesById = new Map()
      pendingReasoningItems = null
      pendingIncomplete = null

      if (
        !textChunk &&
        activitiesChunk.length === 0 &&
        imagesChunk.length === 0 &&
        !reasoningChunk &&
        !incompleteChunk
      ) {
        return
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id !== assistantMessage.id) return message

          let next = message
          if (textChunk) {
            next = { ...next, content: next.content + textChunk }
          }
          for (const activity of activitiesChunk) {
            next = {
              ...next,
              activities: upsertActivity(next.activities, activity),
            }
          }
          for (const image of imagesChunk) {
            next = {
              ...next,
              images: upsertMessageImage(next.images, image),
            }
          }
          if (reasoningChunk) {
            next = { ...next, reasoningItems: reasoningChunk }
          }
          if (incompleteChunk) {
            next = { ...next, incomplete: incompleteChunk }
          }
          return next
        })
      )

      if (stickToBottomRef.current) {
        setScrollTick((tick) => tick + 1)
      }
    }

    const scheduleFlush = () => {
      if (rafHandle !== null) return
      rafHandle = window.requestAnimationFrame(flushPending)
    }

    const flushNow = () => {
      if (rafHandle !== null) {
        window.cancelAnimationFrame(rafHandle)
        rafHandle = null
      }
      flushPending()
    }

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation,
          ...(location ? { location } : {}),
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const payload = (await response
          .json()
          .catch(() => ({}))) as ResponsePayload

        throw new Error(payload.error ?? "The request could not be completed.")
      }

      if (!response.body) {
        throw new Error("The AI service returned an unreadable response.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let streamError: string | null = null

      const applyStreamEvent = (
        event: NonNullable<ReturnType<typeof parseStreamLine>>
      ) => {
        if (event.type === "text") {
          output += event.delta
          pendingText += event.delta
          scheduleFlush()
          return
        }
        if (event.type === "activity") {
          receivedActivities = true
          pendingActivities.push(event.activity)
          scheduleFlush()
          return
        }
        if (event.type === "image") {
          receivedImages = true
          pendingImagesById.set(event.id, {
            id: event.id,
            url: event.imageUrl,
          })
          scheduleFlush()
          return
        }
        if (event.type === "reasoning_items") {
          pendingReasoningItems = event.items
          scheduleFlush()
          return
        }
        if (event.type === "status" && event.status === "incomplete") {
          sawIncomplete = true
          pendingIncomplete = {
            message: event.message,
            ...(event.reason ? { reason: event.reason } : {}),
          }
          scheduleFlush()
          return
        }
        if (event.type === "error") {
          streamError = event.error
        }
      }

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          const event = parseStreamLine(line)
          if (event) applyStreamEvent(event)
        }
      }

      const finalChunk = decoder.decode()

      if (finalChunk) {
        buffer += finalChunk
      }

      if (buffer.trim()) {
        const event = parseStreamLine(buffer)
        if (event) applyStreamEvent(event)
      }

      flushNow()

      if (streamError && !abortController.signal.aborted) {
        throw new Error(streamError)
      }

      const hadUsefulOutput =
        Boolean(output.trim()) ||
        receivedImages ||
        receivedActivities ||
        sawIncomplete

      if (!hadUsefulOutput && !abortController.signal.aborted) {
        throw new Error(
          "The AI service stopped before returning an answer. Try again."
        )
      }

      if (clearPriorIncomplete && mountedRef.current) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id !== assistantMessage.id && message.incomplete
              ? { ...message, incomplete: undefined }
              : message
          )
        )
      }
    } catch (requestError) {
      flushNow()

      const aborted =
        isAbortError(requestError) || abortController.signal.aborted

      // Ignore late aborts from an unmounted tree so a remounted empty shell
      // is not the only surviving signal of a failed turn.
      if (!mountedRef.current) {
        return
      }

      const hadVisibleDraft =
        Boolean(output.trim()) || receivedImages || receivedActivities

      if (aborted && !hadVisibleDraft) {
        // Keep the user prompt so Retry can recover; drop the empty assistant.
        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) => message.id !== assistantMessage.id
          )
        )
      } else if (aborted && hadVisibleDraft) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  incomplete: makeIncomplete("stopped"),
                }
              : message
          )
        )
      } else {
        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) =>
              message.id !== assistantMessage.id ||
              messageHasVisibleContent(message)
          )
        )
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The request could not be completed."
        )
      }
    } finally {
      if (rafHandle !== null) {
        window.cancelAnimationFrame(rafHandle)
        rafHandle = null
      }
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null
      }
      isSubmittingRef.current = false
      if (mountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  sendTurnRef.current = sendTurn

  async function handleSubmit(
    event?: FormEvent<HTMLFormElement>,
    promptOverride?: string
  ) {
    event?.preventDefault()
    event?.stopPropagation()

    const question = (promptOverride ?? input).trim()
    const attachedImages = pendingImages

    if ((!question && attachedImages.length === 0) || isSubmitting) {
      return
    }

    const userImages: MessageImage[] = attachedImages.map((url) => ({ url }))

    await sendTurn({
      history: messagesRef.current,
      question,
      userImages,
    })
  }

  return (
    <div className="cleo-layout">
      <CleoSidebar
        activeThreadId={activeThreadId}
        landmarkActive={sidebarLandmarkActive}
        mobileOpen={sidebarMobileOpen}
        onCollapseDesktop={() => setSidebarCollapsed(true)}
        onCloseMobile={() => setSidebarMobileOpen(false)}
        onDeleteThread={handleDeleteThread}
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        threads={threadSummaries}
      />
      <CleoSidebarToggle
        active={sidebarClosedControlsActive}
        mobileOpen={sidebarMobileOpen}
        onNewChat={handleNewChat}
        onOpenDesktop={() => setSidebarCollapsed(false)}
        onToggleMobile={() => setSidebarMobileOpen((open) => !open)}
      />

      <div className="cleo-main">
        <div className="app-column min-w-0">
          {hasMessages ? (
            <div className="cleo-messages pt-8 sm:pt-10">
              {/* A message id is only unique within its thread. Remount this
                  stateful renderer boundary when the selected transcript changes,
                  so Streamdown cannot retain blocks from the prior thread. */}
              <div
                className="flex flex-col gap-7"
                key={activeThreadId ?? "new-thread"}
              >
                {messages.map((message) => {
                  if (message.hidden) {
                    return null
                  }

                  if (message.role === "user") {
                    return <UserMessage key={message.id} message={message} />
                  }

                  return (
                    <AssistantMessage
                      canContinueIncomplete={canContinueIncomplete}
                      canRetryLastTurn={canRetryLastTurn}
                      isLive={isSubmitting && message.id === messages.at(-1)?.id}
                      key={message.id}
                      message={message}
                      onContinue={handleContinue}
                      onDismissIncomplete={handleDismissIncomplete}
                      onRetry={handleRetry}
                      showIncompleteActions={
                        message.id === lastVisibleMessage?.id
                      }
                    />
                  )
                })}
              </div>
              <div
                aria-hidden="true"
                className="cleo-messages-end"
                ref={messagesEndRef}
              />
            </div>
          ) : null}

          <div
            className="prompt-dock-shell"
            data-docked={hasMessages || undefined}
          >
            {error ? (
              <div
                className="cleo-error-banner mb-3 px-4 text-center text-sm text-destructive"
                role="alert"
              >
                <p>{error}</p>
                {canRetryLastTurn ? (
                  <button
                    className="cleo-answer-action cleo-error-retry"
                    onClick={handleRetry}
                    type="button"
                  >
                    Retry
                  </button>
                ) : null}
              </div>
            ) : null}

            <form
              aria-busy={isSubmitting}
              className="glass-surface prompt-dock"
              onSubmit={handleSubmit}
            >
              <LiquidGlass />
              {pendingImages.length > 0 ? (
                <div className="prompt-dock-attachments">
                  {pendingImages.map((url, index) => (
                    <div
                      className="prompt-dock-attachment"
                      key={`${url.slice(0, 48)}-${index}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- local preview data URLs */}
                      <img
                        alt={`Selected image ${index + 1}`}
                        className="prompt-dock-attachment-image"
                        src={url}
                      />
                      <button
                        aria-label={`Remove image ${index + 1}`}
                        className="prompt-dock-attachment-remove"
                        disabled={isSubmitting}
                        onClick={() => removePendingImage(index)}
                        type="button"
                      >
                        <X aria-hidden="true" className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="prompt-dock-row">
                <input
                  accept={IMAGE_ACCEPT}
                  className="sr-only"
                  disabled={isSubmitting}
                  multiple
                  onChange={handleImageSelection}
                  ref={fileInputRef}
                  type="file"
                />
                <Button
                  aria-label="Attach images"
                  className="prompt-dock-attach size-11 shrink-0 rounded-full active:!translate-y-0"
                  disabled={
                    isSubmitting ||
                    pendingImages.length >= MAX_IMAGES_PER_MESSAGE
                  }
                  onClick={() => fileInputRef.current?.click()}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Plus
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={2.25}
                  />
                </Button>
                <Input
                  aria-label="Message"
                  autoComplete="off"
                  className="prompt-dock-input md:text-base"
                  disabled={isSubmitting}
                  maxLength={MAX_INPUT_LENGTH}
                  name="message"
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask anything"
                  ref={inputRef}
                  required={!isSubmitting && pendingImages.length === 0}
                  value={input}
                />
                <Button
                  aria-label={isSubmitting ? "Stop generating" : "Send"}
                  className="prompt-dock-send size-11 shrink-0 rounded-full active:!translate-y-0"
                  disabled={!isSubmitting && !canSubmit}
                  onClick={
                    isSubmitting
                      ? handleStop
                      : () => {
                          void handleSubmit()
                        }
                  }
                  size="icon"
                  type="button"
                >
                  {isSubmitting ? (
                    <Square
                      aria-hidden="true"
                      className="size-3.5 fill-current"
                    />
                  ) : (
                    <CornerRightUp
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={2.25}
                    />
                  )}
                </Button>
              </div>
            </form>

            {!hasMessages ? (
              <div
                className="cleo-starters"
                role="group"
                aria-label="Suggestions"
              >
                {CLEO_PORTAL_STARTERS.map((starter) => (
                  <button
                    className="cleo-starter"
                    disabled={isSubmitting}
                    key={starter.label}
                    onClick={() => {
                      void handleSubmit(undefined, starter.prompt)
                    }}
                    type="button"
                  >
                    {starter.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
