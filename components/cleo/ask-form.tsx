"use client"

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CornerRightUp, Plus, Square, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ThinkingOrb } from 'thinking-orbs'

import { ActivityPanel } from '~/components/cleo/activity-panel'
import { LiquidGlass } from '~/components/cleo/liquid-glass'
import { Markdown } from '~/components/cleo/markdown'
import { Button } from '~/components/cleo/ui/button'
import { Input } from '~/components/cleo/ui/input'
import {
  formatGuideFocus,
  type PortalGuideFocus,
  parseGuideFocusList,
} from "~/lib/cleo/ask-links"
import {
  filesToMessageImages,
  IMAGE_ACCEPT,
  MAX_IMAGES_PER_MESSAGE,
} from "~/lib/cleo/client-images"
import {
  portalStarterDayKey,
  selectPortalStarters,
} from "~/lib/cleo/portal-starters"
import {
  clearCleoSession,
  loadCleoSession,
  type PersistedCleoMessage,
  saveCleoSession,
} from "~/lib/cleo/session"
import {
  type ActivityItem,
  type MessageImage,
  parseStreamLine,
} from "~/lib/cleo/stream"
const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
}

type Message = PersistedCleoMessage

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [focusGuides, setFocusGuides] = useState<PortalGuideFocus[]>([])
  const [sessionReady, setSessionReady] = useState(false)
  const [starters] = useState(() =>
    selectPortalStarters(portalStarterDayKey(), 3)
  )
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(true)
  const sessionEpochRef = useRef(0)

  const hasMessages = messages.length > 0
  const canSubmit =
    !isSubmitting && (Boolean(input.trim()) || pendingImages.length > 0)

  useEffect(() => {
    const snapshot = loadCleoSession()
    if (snapshot) {
      setMessages(snapshot.messages)
      messageIdRef.current = snapshot.nextMessageId
    }
    setSessionReady(true)
  }, [])

  useEffect(() => {
    if (!sessionReady) return

    const prompt = searchParams.get('q')?.trim() ?? ''
    const guides = parseGuideFocusList(searchParams.getAll('g'))
    if (!prompt && guides.length === 0) return

    // Ask-from-guide deep links start a fresh thread with pinned grounding.
    sessionEpochRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    clearCleoSession()
    setMessages([])
    setPendingImages([])
    setIsSubmitting(false)
    messageIdRef.current = 0
    setInput(prompt ? prompt.slice(0, MAX_INPUT_LENGTH) : '')
    setFocusGuides(guides)
    setError(null)
    // Drop consume-once params so refresh / New chat do not re-prefill.
    router.replace(pathname, { scroll: false })
  }, [pathname, router, searchParams, sessionReady])

  useEffect(() => {
    if (!sessionReady) return
    saveCleoSession(messages, messageIdRef.current)
  }, [messages, sessionReady])

  useEffect(() => {
    if (!sessionReady || !hasMessages) return
    // Scroll the document so the clearance spacer sits against the viewport
    // bottom — leaving the latest text above the fixed prompt.
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'instant' })
  }, [hasMessages, messages, sessionReady])

  useEffect(() => {
    if (!sessionReady || isSubmitting) return
    if (hasMessages || input) {
      inputRef.current?.focus()
    }
  }, [hasMessages, input, isSubmitting, sessionReady])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (!sessionReady) return

    const root = document.documentElement
    if (hasMessages) {
      root.removeAttribute('data-cleo-empty')
    } else {
      root.setAttribute('data-cleo-empty', '')
    }
    return () => {
      root.removeAttribute('data-cleo-empty')
    }
  }, [hasMessages, sessionReady])

  function handleStop() {
    abortControllerRef.current?.abort()
  }

  function handleNewChat() {
    sessionEpochRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setMessages([])
    setInput("")
    setPendingImages([])
    setFocusGuides([])
    setError(null)
    setIsSubmitting(false)
    messageIdRef.current = 0
    clearCleoSession()
    inputRef.current?.focus()
  }

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

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    event?.stopPropagation()

    const question = input.trim()
    const attachedImages = pendingImages

    if ((!question && attachedImages.length === 0) || isSubmitting) {
      return
    }

    const epoch = sessionEpochRef.current
    const isCurrentSession = () =>
      mountedRef.current && sessionEpochRef.current === epoch

    const userImages: MessageImage[] = attachedImages.map((url) => ({ url }))
    const userMessage: Message = {
      content: question,
      id: messageIdRef.current++,
      role: "user",
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
      ...messages
        .filter(
          (message) =>
            Boolean(message.content.trim()) || Boolean(message.images?.length)
        )
        .map(({ role, content, images }) => ({
          role,
          content,
          ...(images && images.length > 0 ? { images } : {}),
        })),
      {
        role: "user" as const,
        content: question,
        ...(userImages.length > 0 ? { images: userImages } : {}),
      },
    ]

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ])
    setInput("")
    setPendingImages([])
    setError(null)
    setIsSubmitting(true)

    let output = ""
    let receivedImages = false

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation,
          ...(focusGuides.length > 0
            ? {
                focusGuides: focusGuides.map((guide) =>
                  formatGuideFocus(guide)
                ),
              }
            : {}),
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

      const applyTextDelta = (delta: string) => {
        if (!isCurrentSession()) return
        output += delta
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + delta }
              : message
          )
        )
      }

      const applyTextReplace = (content: string) => {
        if (!isCurrentSession()) return
        output = content
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content }
              : message
          )
        )
      }

      const applyActivity = (activity: ActivityItem) => {
        if (!isCurrentSession()) return
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
        if (!isCurrentSession()) return
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

          if (!event) {
            continue
          }

          if (event.type === "text") {
            applyTextDelta(event.delta)
            continue
          }

          if (event.type === "text_replace") {
            applyTextReplace(event.content)
            continue
          }

          if (event.type === "activity") {
            applyActivity(event.activity)
            continue
          }

          if (event.type === "image") {
            applyImage(event.id, event.imageUrl)
            continue
          }

          if (event.type === "error") {
            streamError = event.error
          }
        }
      }

      const finalChunk = decoder.decode()

      if (finalChunk) {
        buffer += finalChunk
      }

      if (buffer.trim()) {
        const event = parseStreamLine(buffer)

        if (event?.type === "text") {
          applyTextDelta(event.delta)
        } else if (event?.type === "text_replace") {
          applyTextReplace(event.content)
        } else if (event?.type === "activity") {
          applyActivity(event.activity)
        } else if (event?.type === "image") {
          applyImage(event.id, event.imageUrl)
        } else if (event?.type === "error") {
          streamError = event.error
        }
      }

      if (streamError && !abortController.signal.aborted) {
        throw new Error(streamError)
      }

      if (
        !output.trim() &&
        !receivedImages &&
        !abortController.signal.aborted
      ) {
        throw new Error(
          "The AI service stopped before returning an answer. Try again."
        )
      }
    } catch (requestError) {
      const aborted =
        isAbortError(requestError) || abortController.signal.aborted

      // Ignore late aborts from an unmounted tree or a superseded chat so a
      // remounted empty shell / New chat is not overwritten by the old turn.
      if (!isCurrentSession()) {
        return
      }

      setMessages((currentMessages) => {
        // Stop before any answer text or image: abandon the whole turn so the
        // unanswered prompt does not leak into the next request.
        if (aborted && !output.trim() && !receivedImages) {
          return currentMessages.filter(
            (message) =>
              message.id !== assistantMessage.id &&
              message.id !== userMessage.id
          )
        }

        return currentMessages.filter(
          (message) =>
            message.id !== assistantMessage.id ||
            messageHasVisibleContent(message)
        )
      })

      if (!aborted) {
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
      if (isCurrentSession()) {
        setIsSubmitting(false)
      }
    }
  }

  if (!sessionReady) {
    return <div className="app-column min-w-0" aria-busy="true" />
  }

  return (
    <div className="app-column min-w-0">
      {hasMessages ? (
        <div className="cleo-messages pt-8 sm:pt-10">
          <div className="flex flex-col gap-7">
            {messages.map((message) =>
              message.role === 'user' ? (
                <div className="user-turn" key={message.id}>
                  {message.images && message.images.length > 0 ? (
                    <div className="user-message-images">
                      {message.images.map((image, index) => (
                        // eslint-disable-next-line @next/next/no-img-element -- data URLs from the local conversation
                        <img
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
              ) : (
                <section
                  aria-label="AI response"
                  aria-live="polite"
                  className="min-w-0"
                  key={message.id}
                >
                  {message.activities && message.activities.length > 0 ? (
                    <ActivityPanel
                      activities={message.activities}
                      isLive={
                        isSubmitting && message.id === messages.at(-1)?.id
                      }
                    />
                  ) : null}

                  {message.images && message.images.length > 0 ? (
                    <div className="assistant-message-images mb-3">
                      {message.images.map((image, index) => (
                        // eslint-disable-next-line @next/next/no-img-element -- streamed data URLs from image generation
                        <img
                          alt={`Generated image ${index + 1}`}
                          className="message-image message-image-assistant"
                          key={image.id ?? `${message.id}-${index}`}
                          src={image.url}
                        />
                      ))}
                    </div>
                  ) : null}

                  {message.content ? (
                    <Markdown
                      isAnimating={
                        isSubmitting && message.id === messages.at(-1)?.id
                      }
                    >
                      {message.content}
                    </Markdown>
                  ) : isSubmitting &&
                    message.id === messages.at(-1)?.id &&
                    !(message.activities && message.activities.length > 0) &&
                    !(message.images && message.images.length > 0) ? (
                    <ThinkingOrb
                      aria-label="Listening"
                      className="block"
                      size={20}
                      state="listening"
                    />
                  ) : null}
                </section>
              )
            )}
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
        {!hasMessages ? (
          <div className="cleo-starters" role="group" aria-label="Suggestions">
            {starters.map((starter) => (
              <button
                className="cleo-starter"
                disabled={isSubmitting}
                key={`${starter.topic}:${starter.label}`}
                onClick={() => {
                  setInput(starter.prompt)
                  setError(null)
                  inputRef.current?.focus()
                }}
                type="button"
              >
                {starter.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="cleo-session-actions">
            <button
              className="cleo-new-chat"
              onClick={handleNewChat}
              type="button"
            >
              New chat
            </button>
          </div>
        )}

        {error ? (
          <p
            className="mb-3 px-4 text-center text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
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
      </div>
    </div>
  )
}
