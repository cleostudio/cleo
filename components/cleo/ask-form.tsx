"use client"

import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Check, Copy, CornerRightUp, Plus, Square, X } from 'lucide-react'
import { ThinkingOrb } from 'thinking-orbs'

import { ActivityPanel } from '~/components/cleo/activity-panel'
import { LiquidGlass } from '~/components/cleo/liquid-glass'
import { Markdown } from '~/components/cleo/markdown'
import { Button } from '~/components/cleo/ui/button'
import { Input } from '~/components/cleo/ui/input'
import { ZoomableMessageImage } from '~/components/cleo/zoomable-message-image'
import {
  filesToMessageImages,
  IMAGE_ACCEPT,
  imageFilesFromDataTransfer,
  MAX_IMAGES_PER_MESSAGE,
} from "~/lib/cleo/client-images"
import { CLEO_PORTAL_STARTERS } from "~/lib/cleo/portal-links"
import {
  CLEO_MODE_OPTIONS,
  type CleoMode,
  parseCleoMode,
} from "~/lib/cleo/mode"
import { CONTINUE_PROMPT } from "~/lib/cleo/continue"
import {
  AUTOSCROLL_BOTTOM_THRESHOLD_PX,
  hydrateRestoredMessages,
  inFlightCheckpointDelayMs,
  lastUserMessageIndex,
  markAssistantInterrupted,
} from "~/lib/cleo/conversation-helpers"
import {
  clearCleoSession,
  loadCleoSession,
  saveCleoSession,
} from "~/lib/cleo/session"
import type { EncryptedReasoningItem } from "~/lib/cleo/reasoning-items"
import {
  type ActivityItem,
  type IncompleteReason,
  type MessageImage,
  parseStreamLine,
} from "~/lib/cleo/stream"

const CLEO_MODE_STORAGE_KEY = "cleo:mode:v1"

const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
}

type MessageIncomplete = {
  message: string
  reason?: IncompleteReason
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

function toApiMessages(messages: readonly Message[]) {
  return messages
    .filter(
      (message) =>
        Boolean(message.content.trim()) || Boolean(message.images?.length)
    )
    .map(({ role, content, images, reasoningItems }) => ({
      role,
      content,
      ...(images && images.length > 0 ? { images } : {}),
      ...(role === "assistant" &&
      reasoningItems &&
      reasoningItems.length > 0
        ? { reasoningItems }
        : {}),
    }))
}

function CopyAnswerButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handleCopy() {
    if (!text.trim()) return
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      try {
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        ok = document.execCommand("copy")
        document.body.removeChild(textarea)
      } catch {
        ok = false
      }
    }
    setStatus(ok ? "copied" : "error")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setStatus("idle"), 1600)
  }

  const label =
    status === "copied" ? "Copied" : status === "error" ? "Couldn't copy" : "Copy"

  return (
    <button
      aria-label={status === "idle" ? "Copy answer" : label}
      className="cleo-copy-answer"
      onClick={() => {
        void handleCopy()
      }}
      type="button"
    >
      {status === "copied" ? (
        <Check aria-hidden size={14} />
      ) : (
        <Copy aria-hidden size={14} />
      )}
      <span>{label}</span>
    </button>
  )
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

function messageHasVisibleContent(message: Message) {
  return (
    Boolean(message.content.trim()) ||
    Boolean(message.images?.length) ||
    Boolean(message.activities?.length)
  )
}

export function AskForm() {
  const [error, setError] = useState<string | null>(null)
  const [sessionNotice, setSessionNotice] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [mode, setMode] = useState<CleoMode>("auto")
  const [sessionReady, setSessionReady] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<Message[]>([])
  const isSubmittingRef = useRef(false)
  const mountedRef = useRef(true)
  const stickToBottomRef = useRef(true)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  /** Bumped on New chat / each send so late abort handlers cannot resurrect state. */
  const turnEpochRef = useRef(0)
  const lastInFlightSaveAtRef = useRef(0)

  const hasMessages = messages.length > 0
  const canSubmit =
    !isSubmitting && (Boolean(input.trim()) || pendingImages.length > 0)
  const lastUserIndex = lastUserMessageIndex(messages)
  const lastVisibleMessage = [...messages]
    .reverse()
    .find((message) => !message.hidden)
  const canRetryLastTurn = !isSubmitting && lastUserIndex >= 0
  const canContinueIncomplete =
    !isSubmitting &&
    lastVisibleMessage?.role === "assistant" &&
    Boolean(lastVisibleMessage.incomplete)
  const regenerateLabel =
    Boolean(error) || Boolean(lastVisibleMessage?.incomplete)
      ? "Retry"
      : "Regenerate"

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    isSubmittingRef.current = isSubmitting
  }, [isSubmitting])

  useEffect(() => {
    const restored = loadCleoSession()
    if (restored && restored.messages.length > 0) {
      setMessages(
        hydrateRestoredMessages(restored.messages, {
          inFlight: restored.inFlight,
        })
      )
      messageIdRef.current = restored.nextId
      stickToBottomRef.current = true
    }
    try {
      setMode(parseCleoMode(window.localStorage.getItem(CLEO_MODE_STORAGE_KEY)))
    } catch {
      setMode("auto")
    }
    setSessionReady(true)
  }, [])

  useEffect(() => {
    if (!sessionReady) return
    try {
      window.localStorage.setItem(CLEO_MODE_STORAGE_KEY, mode)
    } catch {
      // Privacy mode / quota — ignore.
    }
  }, [mode, sessionReady])

  function reportSessionSave(ok: boolean, messageCount: number) {
    if (!ok && messageCount > 0) {
      setSessionNotice(
        "Couldn't save this chat in the browser. Copy anything you need to keep."
      )
      return
    }
    if (ok) {
      setSessionNotice(null)
    }
  }

  useEffect(() => {
    if (!sessionReady) return
    // Idle saves write the settled thread. Mid-turn saves throttle so a busy
    // token stream still checkpoints instead of endlessly resetting a debounce.
    if (!isSubmitting) {
      lastInFlightSaveAtRef.current = 0
      reportSessionSave(
        saveCleoSession(messages, messageIdRef.current),
        messages.length
      )
      return
    }

    const delayMs = inFlightCheckpointDelayMs(
      lastInFlightSaveAtRef.current,
      Date.now()
    )
    if (delayMs === 0) {
      reportSessionSave(
        saveCleoSession(messages, messageIdRef.current, { inFlight: true }),
        messages.length
      )
      lastInFlightSaveAtRef.current = Date.now()
      return
    }

    const timer = window.setTimeout(() => {
      reportSessionSave(
        saveCleoSession(messages, messageIdRef.current, { inFlight: true }),
        messages.length
      )
      lastInFlightSaveAtRef.current = Date.now()
    }, delayMs)
    return () => window.clearTimeout(timer)
  }, [messages, sessionReady, isSubmitting])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      if (!isSubmittingRef.current) return
      if (event.defaultPrevented) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest('[role="dialog"], [data-radix-portal]')
      ) {
        return
      }
      event.preventDefault()
      abortControllerRef.current?.abort()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!hasMessages) return
    const target = messagesEndRef.current
    if (!target) return

    // Observe the end spacer: when it leaves the viewport the user has scrolled
    // up, so pause autoscroll and offer Latest. More reliable than scrollY math
    // across browsers / layout spacers.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stick = Boolean(entry?.isIntersecting)
        stickToBottomRef.current = stick
        // Offer Latest whenever the live edge is off-screen — during a stream
        // or after, so users can jump back without hunting the scrollbar.
        setShowJumpToLatest(!stick)
      },
      {
        root: null,
        // Keep stick=true while the end spacer is within ~threshold of the fold.
        rootMargin: `0px 0px ${AUTOSCROLL_BOTTOM_THRESHOLD_PX}px 0px`,
        threshold: 0,
      }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMessages])

  useEffect(() => {
    if (!hasMessages) {
      setShowJumpToLatest(false)
      return
    }
    if (!stickToBottomRef.current) {
      setShowJumpToLatest(true)
      return
    }
    // Scroll the document so the clearance spacer sits against the viewport
    // bottom — leaving the latest text above the fixed prompt.
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "instant" })
  }, [hasMessages, messages])

  useEffect(() => {
    if (!isSubmitting && hasMessages) {
      inputRef.current?.focus()
    }
  }, [hasMessages, isSubmitting])

  useEffect(() => {
    if (isSubmitting) return
    if (!lastVisibleMessage?.incomplete) return
    // Bring Continue/Retry above the fixed prompt dock after Stop/restore.
    const note = document.getElementById(
      `cleo-incomplete-${lastVisibleMessage.id}`
    )
    note?.closest(".cleo-answer-actions")?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    })
  }, [
    isSubmitting,
    lastVisibleMessage?.id,
    lastVisibleMessage?.incomplete,
  ])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (hasMessages) {
      root.removeAttribute('data-cleo-empty')
    } else {
      root.setAttribute('data-cleo-empty', '')
    }
    return () => {
      root.removeAttribute('data-cleo-empty')
    }
  }, [hasMessages])

  function handleStop() {
    abortControllerRef.current?.abort()
  }

  function handleNewChat() {
    // Invalidate any in-flight turn before clearing so abort handlers cannot
    // rewrite the empty transcript or restore the prompt.
    turnEpochRef.current += 1
    if (isSubmitting) {
      abortControllerRef.current?.abort()
    }
    isSubmittingRef.current = false
    setIsSubmitting(false)
    clearCleoSession()
    setMessages([])
    setInput("")
    setPendingImages([])
    setError(null)
    setSessionNotice(null)
    setIsDragOver(false)
    setShowJumpToLatest(false)
    messageIdRef.current = 0
    lastInFlightSaveAtRef.current = 0
    inputRef.current?.focus()
  }

  function handleRetry() {
    // Trust React state for the enabled button; heal a stale submitting ref
    // so a missed finally cannot permanently disable Retry/Continue.
    if (isSubmitting) return
    isSubmittingRef.current = false
    const current = messagesRef.current
    // Include hidden Continue prompts so Retry after Continue replays the
    // resume turn instead of jumping back to an older visible question.
    const userIndex = lastUserMessageIndex(current, { includeHidden: true })
    if (userIndex < 0) return
    const lastUser = current[userIndex]!
    void sendTurn({
      history: current.slice(0, userIndex),
      question: lastUser.content,
      userImages: lastUser.images ?? [],
      hideUserMessage: Boolean(lastUser.hidden),
      clearPriorIncomplete: Boolean(lastUser.hidden),
    })
  }

  function handleContinue() {
    if (isSubmitting) return
    isSubmittingRef.current = false
    void sendTurn({
      history: messagesRef.current,
      question: CONTINUE_PROMPT,
      userImages: [],
      hideUserMessage: true,
      clearPriorIncomplete: true,
    })
  }

  function handleDismissIncomplete() {
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
  }

  function removePendingImage(index: number) {
    setPendingImages((current) => current.filter((_, i) => i !== index))
  }

  async function attachImageFiles(files: File[]) {
    if (isSubmittingRef.current || files.length === 0) {
      return
    }

    const remaining = MAX_IMAGES_PER_MESSAGE - pendingImages.length

    if (remaining <= 0) {
      setError(`Attach up to ${MAX_IMAGES_PER_MESSAGE} images per message.`)
      return
    }

    const truncated = files.length > remaining
    const selected = files.slice(0, remaining)

    try {
      const urls = await filesToMessageImages(selected)
      setPendingImages((current) =>
        [...current, ...urls].slice(0, MAX_IMAGES_PER_MESSAGE)
      )
      setError(
        truncated
          ? `Only ${MAX_IMAGES_PER_MESSAGE} images per message — attached the first ${remaining}.`
          : null
      )
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : "Could not attach that image."
      )
    }
  }

  async function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    // FileList is live — copy files before clearing the input so the same
    // file can be re-selected and the selection is not wiped mid-handler.
    const selectedFiles = Array.from(event.target.files ?? [])
    event.target.value = ""
    await attachImageFiles(selectedFiles)
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>) {
    if (isSubmittingRef.current) return
    const files = imageFilesFromDataTransfer(event.clipboardData)
    if (files.length === 0) return
    // Keep default text paste; only consume the clipboard for image files.
    void attachImageFiles(files)
  }

  function dataTransferHasFiles(data: DataTransfer | null | undefined) {
    return Boolean(
      data && Array.from(data.types ?? []).includes("Files")
    )
  }

  function handleDragEnter(event: DragEvent<HTMLFormElement>) {
    if (isSubmittingRef.current) return
    if (!dataTransferHasFiles(event.dataTransfer)) return
    event.preventDefault()
    setIsDragOver(true)
  }

  function handleDragOver(event: DragEvent<HTMLFormElement>) {
    if (isSubmittingRef.current) return
    if (!dataTransferHasFiles(event.dataTransfer)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDragOver(true)
  }

  function handleDragLeave(event: DragEvent<HTMLFormElement>) {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next)) {
      return
    }
    setIsDragOver(false)
  }

  function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsDragOver(false)
    if (isSubmittingRef.current) return
    void attachImageFiles(imageFilesFromDataTransfer(event.dataTransfer))
  }

  async function sendTurn({
    history,
    question,
    userImages,
    hideUserMessage = false,
    clearPriorIncomplete = false,
  }: TurnRequest) {
    if ((!question && userImages.length === 0) || isSubmittingRef.current) {
      return
    }

    const turnEpoch = ++turnEpochRef.current
    const isCurrentTurn = () =>
      mountedRef.current && turnEpochRef.current === turnEpoch

    // Clear stale incomplete markers up front so Continue does not keep the
    // prior "Stopped" note visible while the new turn streams.
    const startingHistory = clearPriorIncomplete
      ? history.map((message) =>
          message.role === "assistant" && message.incomplete
            ? { ...message, incomplete: undefined }
            : message
        )
      : history

    const userMessage: Message = {
      content: question,
      id: messageIdRef.current++,
      role: "user",
      ...(userImages.length > 0 ? { images: userImages } : {}),
      ...(hideUserMessage ? { hidden: true } : {}),
    }
    const assistantMessage: Message = {
      activities: [],
      content: "",
      id: messageIdRef.current++,
      images: [],
      role: "assistant",
    }

    const conversation = [
      ...toApiMessages(startingHistory),
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
    setShowJumpToLatest(false)
    setMessages([...startingHistory, userMessage, assistantMessage])
    setInput("")
    setPendingImages([])
    setError(null)
    setIsSubmitting(true)
    // Immediate mid-turn checkpoint so a reload before the first throttle
    // window still restores Continue.
    const checkpoint = [...startingHistory, userMessage, assistantMessage]
    reportSessionSave(
      saveCleoSession(checkpoint, messageIdRef.current, { inFlight: true }),
      checkpoint.length
    )
    lastInFlightSaveAtRef.current = Date.now()

    let output = ""
    let receivedImages = false
    let receivedActivities = false

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation, mode }),
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

      const applyTextDelta = (delta: string) => {
        if (!isCurrentTurn()) return
        output += delta
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + delta }
              : message
          )
        )
      }

      const applyActivity = (activity: ActivityItem) => {
        if (!isCurrentTurn()) return
        receivedActivities = true
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  activities: upsertActivity(message.activities, activity),
                }
              : message
          )
        )
      }

      const applyImage = (id: string, imageUrl: string) => {
        if (!isCurrentTurn()) return
        receivedImages = true
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  images: upsertMessageImage(message.images, {
                    id,
                    url: imageUrl,
                  }),
                }
              : message
          )
        )
      }

      const applyReasoningItems = (items: EncryptedReasoningItem[]) => {
        if (!isCurrentTurn()) return
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, reasoningItems: items }
              : message
          )
        )
      }

      const applyIncomplete = (incomplete: MessageIncomplete) => {
        if (!isCurrentTurn()) return
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, incomplete }
              : message
          )
        )
      }

      const applyStreamEvent = (
        event: NonNullable<ReturnType<typeof parseStreamLine>>
      ) => {
        if (!isCurrentTurn()) return
        if (event.type === "text") {
          applyTextDelta(event.delta)
          return
        }
        if (event.type === "activity") {
          applyActivity(event.activity)
          return
        }
        if (event.type === "image") {
          applyImage(event.id, event.imageUrl)
          return
        }
        if (event.type === "reasoning_items") {
          applyReasoningItems(event.items)
          return
        }
        if (event.type === "status" && event.status === "incomplete") {
          applyIncomplete({
            message: event.message,
            ...(event.reason ? { reason: event.reason } : {}),
          })
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

      if (!isCurrentTurn()) {
        return
      }

      if (streamError && !abortController.signal.aborted) {
        throw new Error(streamError)
      }

      if (
        !output.trim() &&
        !receivedImages &&
        !receivedActivities &&
        !abortController.signal.aborted
      ) {
        throw new Error(
          "The AI service stopped before returning an answer. Try again."
        )
      }

      // Activity-only completion (tools ran, no visible answer): keep the turn
      // and offer Continue instead of treating it as success with a blank reply.
      if (
        !output.trim() &&
        !receivedImages &&
        receivedActivities &&
        !abortController.signal.aborted
      ) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? markAssistantInterrupted(message, "other")
              : message
          )
        )
      }
    } catch (requestError) {
      const aborted =
        isAbortError(requestError) || abortController.signal.aborted

      // Ignore late work from New chat / a newer send / unmount.
      if (!isCurrentTurn()) {
        return
      }

      const hadVisibleDraft =
        Boolean(output.trim()) || receivedImages || receivedActivities

      if (aborted && !hadVisibleDraft) {
        // Empty Stop: drop the unfinished turn and put the prompt back.
        setMessages((currentMessages) =>
          currentMessages.filter(
            (message) =>
              message.id !== assistantMessage.id &&
              message.id !== userMessage.id
          )
        )
        if (!hideUserMessage) {
          setInput(question)
          setPendingImages(userImages.map((image) => image.url))
        }
      } else if (aborted) {
        // Partial Stop (text, images, or activity): keep the draft, settle
        // live activities, and mark incomplete so Continue/Retry appear.
        setMessages((currentMessages) =>
          currentMessages
            .filter(
              (message) =>
                message.id !== assistantMessage.id ||
                messageHasVisibleContent(message)
            )
            .map((message) =>
              message.id === assistantMessage.id
                ? markAssistantInterrupted(message, "stopped")
                : message
            )
        )
      } else if (hadVisibleDraft) {
        // Hard failure with a partial draft: same Continue path as Stop.
        setMessages((currentMessages) =>
          currentMessages
            .filter(
              (message) =>
                message.id !== assistantMessage.id ||
                messageHasVisibleContent(message)
            )
            .map((message) =>
              message.id === assistantMessage.id
                ? markAssistantInterrupted(message, "other")
                : message
            )
        )
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The request could not be completed."
        )
      } else {
        // Empty hard failure: drop the blank assistant; also drop a hidden
        // Continue user turn so orphaned resume prompts do not accumulate.
        setMessages((currentMessages) =>
          currentMessages.filter((message) => {
            if (message.id === assistantMessage.id) {
              return messageHasVisibleContent(message)
            }
            if (hideUserMessage && message.id === userMessage.id) {
              return false
            }
            return true
          })
        )
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The request could not be completed."
        )
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null
      }
      if (turnEpochRef.current === turnEpoch) {
        isSubmittingRef.current = false
        if (mountedRef.current) {
          setIsSubmitting(false)
        }
      }
    }
  }

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

    await sendTurn({
      history: messages,
      question,
      userImages: attachedImages.map((url) => ({ url })),
    })
  }

  return (
    <div className="app-column min-w-0">
      {hasMessages ? (
        <div className="cleo-messages pt-8 sm:pt-10">
          <div className="mb-5 flex justify-end">
            <button
              className="cleo-new-chat"
              onClick={handleNewChat}
              type="button"
            >
              New chat
            </button>
          </div>
          <div className="flex flex-col gap-7">
            {messages.map((message) => {
              if (message.hidden) {
                return null
              }

              if (message.role === 'user') {
                return (
                  <div className="user-turn" key={message.id}>
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
                        <span className="user-message-text">
                          {message.content}
                        </span>
                      </div>
                    ) : null}
                  </div>
                )
              }

              const incompleteNoteId = message.incomplete
                ? `cleo-incomplete-${message.id}`
                : undefined

              const isLiveTurn =
                isSubmitting && message.id === messages.at(-1)?.id

              return (
                <section
                  aria-label="AI response"
                  aria-live={isLiveTurn ? "polite" : undefined}
                  className="min-w-0"
                  key={message.id}
                >
                  {message.activities && message.activities.length > 0 ? (
                    <ActivityPanel
                      activities={message.activities}
                      isLive={isLiveTurn}
                    />
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
                    <Markdown isAnimating={isLiveTurn}>
                      {message.content}
                    </Markdown>
                  ) : isLiveTurn &&
                    !(message.activities && message.activities.length > 0) &&
                    !(message.images && message.images.length > 0) ? (
                    <ThinkingOrb
                      aria-label="Listening"
                      className="block"
                      size={20}
                      state="listening"
                    />
                  ) : null}

                  {!isLiveTurn &&
                  (message.content || message.incomplete) ? (
                    <div className="cleo-answer-actions">
                      {message.incomplete ? (
                        <p
                          className="cleo-incomplete-note"
                          id={incompleteNoteId}
                          role="status"
                        >
                          {message.incomplete.message}
                        </p>
                      ) : null}
                      <div className="cleo-answer-action-row">
                        {message.content ? (
                          <CopyAnswerButton text={message.content} />
                        ) : null}
                        {message.incomplete &&
                        message.id === lastVisibleMessage?.id ? (
                          <button
                            aria-describedby={incompleteNoteId}
                            aria-label="Continue this answer"
                            className="cleo-answer-action"
                            disabled={!canContinueIncomplete}
                            onClick={handleContinue}
                            type="button"
                          >
                            Continue
                          </button>
                        ) : null}
                        {message.incomplete &&
                        message.id === lastVisibleMessage?.id ? (
                          <button
                            aria-label="Dismiss the incomplete notice"
                            className="cleo-answer-action"
                            onClick={handleDismissIncomplete}
                            type="button"
                          >
                            Dismiss
                          </button>
                        ) : null}
                        {message.id === lastVisibleMessage?.id ? (
                          <button
                            aria-label={
                              regenerateLabel === "Retry"
                                ? "Retry the last question"
                                : "Regenerate the last answer"
                            }
                            className="cleo-answer-action"
                            disabled={!canRetryLastTurn}
                            onClick={handleRetry}
                            type="button"
                          >
                            {regenerateLabel}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </section>
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
        {showJumpToLatest ? (
          <div className="cleo-jump-latest-row">
            <button
              aria-label="Jump to the latest message"
              className="cleo-jump-latest"
              onClick={() => {
                stickToBottomRef.current = true
                setShowJumpToLatest(false)
                messagesEndRef.current?.scrollIntoView({
                  block: "end",
                  behavior: "smooth",
                })
              }}
              type="button"
            >
              Latest
            </button>
          </div>
        ) : null}

        {error ? (
          <div
            className="cleo-error-banner mb-3 px-4 text-center text-sm text-destructive"
            role="alert"
          >
            <p>{error}</p>
            <div className="cleo-error-actions">
              {canContinueIncomplete ? (
                <button
                  aria-label="Continue this answer"
                  className="cleo-answer-action cleo-error-retry"
                  onClick={handleContinue}
                  type="button"
                >
                  Continue
                </button>
              ) : null}
              {canRetryLastTurn ? (
                <button
                  aria-label={
                    regenerateLabel === "Retry"
                      ? "Retry the last question"
                      : "Regenerate the last answer"
                  }
                  className="cleo-answer-action cleo-error-retry"
                  onClick={handleRetry}
                  type="button"
                >
                  Retry
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {sessionNotice ? (
          <p className="cleo-session-notice mb-3 px-4 text-center" role="status">
            {sessionNotice}
          </p>
        ) : null}

        <div
          aria-label="Response mode"
          className="cleo-mode-row"
          onKeyDown={(event) => {
            if (isSubmitting) return
            const currentIndex = CLEO_MODE_OPTIONS.findIndex(
              (option) => option.id === mode
            )
            if (currentIndex < 0) return

            let nextIndex = currentIndex
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              nextIndex = (currentIndex + 1) % CLEO_MODE_OPTIONS.length
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              nextIndex =
                (currentIndex - 1 + CLEO_MODE_OPTIONS.length) %
                CLEO_MODE_OPTIONS.length
            } else if (event.key === "Home") {
              nextIndex = 0
            } else if (event.key === "End") {
              nextIndex = CLEO_MODE_OPTIONS.length - 1
            } else {
              return
            }

            event.preventDefault()
            const next = CLEO_MODE_OPTIONS[nextIndex]!
            setMode(next.id)
            const radios = event.currentTarget.querySelectorAll<HTMLElement>(
              '[role="radio"]'
            )
            radios[nextIndex]?.focus()
          }}
          role="radiogroup"
        >
          {CLEO_MODE_OPTIONS.map((option) => (
            <button
              aria-checked={mode === option.id}
              className="cleo-mode"
              data-active={mode === option.id || undefined}
              disabled={isSubmitting}
              key={option.id}
              onClick={() => setMode(option.id)}
              role="radio"
              tabIndex={mode === option.id ? 0 : -1}
              title={option.description}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <form
          aria-busy={isSubmitting}
          className="glass-surface prompt-dock"
          data-drag-over={isDragOver || undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onPaste={handlePaste}
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
              aria-label="Attach images (or paste / drop)"
              className="prompt-dock-attach size-11 shrink-0 rounded-full active:!translate-y-0"
              disabled={
                isSubmitting || pendingImages.length >= MAX_IMAGES_PER_MESSAGE
              }
              onClick={() => fileInputRef.current?.click()}
              size="icon"
              title="Attach images — or paste / drop them here"
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
              aria-keyshortcuts={isSubmitting ? "Escape" : undefined}
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
              title={isSubmitting ? "Stop (Esc)" : "Send"}
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

        {sessionReady && !hasMessages ? (
          <div className="cleo-starters" role="group" aria-label="Suggestions">
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
  )
}
