"use client"

import {
  type ChangeEvent,
  type FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { CornerRightUp, Plus, Square, X } from "lucide-react"
import { ThinkingOrb } from "thinking-orbs"

import { ActivityPanel } from "~/components/cleo/activity-panel"
import { LiquidGlass } from "~/components/cleo/liquid-glass"
import { Markdown } from "~/components/cleo/markdown"
import { Button } from "~/components/cleo/ui/button"
import { Input } from "~/components/cleo/ui/input"
import { ZoomableMessageImage } from "~/components/cleo/zoomable-message-image"
import {
  filesToMessageImages,
  IMAGE_ACCEPT,
  MAX_IMAGES_PER_MESSAGE,
} from "~/lib/cleo/client-images"
import {
  CONTINUE_PROMPT,
  makeIncomplete,
  messageHasVisibleContent,
  type MessageIncomplete,
  toConversationPayload,
} from "~/lib/cleo/conversation-helpers"
import { CLEO_PORTAL_STARTERS } from "~/lib/cleo/portal-links"
import type { EncryptedReasoningItem } from "~/lib/cleo/reasoning-items"
import {
  type ActivityItem,
  type MessageImage,
  parseStreamLine,
} from "~/lib/cleo/stream"

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

export function AskForm() {
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [scrollTick, setScrollTick] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<Message[]>([])
  const isSubmittingRef = useRef(false)
  const mountedRef = useRef(true)
  const stickToBottomRef = useRef(true)

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
    const onScroll = () => {
      const end = messagesEndRef.current
      if (!end) return
      const rect = end.getBoundingClientRect()
      // Stick while the clearance spacer is near the viewport bottom.
      stickToBottomRef.current = rect.top < window.innerHeight + 120
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!hasMessages || !stickToBottomRef.current) return
    messagesEndRef.current?.scrollIntoView({
      block: "end",
      behavior: "instant",
    })
  }, [hasMessages, scrollTick])

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

  function handleStop() {
    abortControllerRef.current?.abort()
  }

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
        body: JSON.stringify({ messages: conversation }),
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
    <div className="app-column min-w-0">
      {hasMessages ? (
        <div className="cleo-messages pt-8 sm:pt-10">
          <div className="flex flex-col gap-7">
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
                  showIncompleteActions={message.id === lastVisibleMessage?.id}
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
                isSubmitting || pendingImages.length >= MAX_IMAGES_PER_MESSAGE
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
