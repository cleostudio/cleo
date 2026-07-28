"use client"

import {
  type ChangeEvent,
  type FormEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'
import { CornerRightUp, Plus, Square, X } from 'lucide-react'
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
  MAX_IMAGES_PER_MESSAGE,
} from "~/lib/cleo/client-images"
import { CLEO_PORTAL_STARTERS } from "~/lib/cleo/portal-links"
import { isDocumentNearBottom } from "~/lib/cleo/stick-to-bottom"
import {
  type ActivityItem,
  type MessageImage,
  parseStreamLine,
} from "~/lib/cleo/stream"
import { createStreamUiBuffer } from "~/lib/cleo/stream-ui-buffer"

const MAX_INPUT_LENGTH = 10_000

type ResponsePayload = {
  error?: string
}

type Message = {
  activities?: ActivityItem[]
  content: string
  id: number
  images?: MessageImage[]
  role: "assistant" | "user"
}

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  )
}

function messageHasVisibleContent(message: Message) {
  return (
    Boolean(message.content.trim()) ||
    Boolean(message.images?.length) ||
    Boolean(message.activities?.length)
  )
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
  isLive: boolean
  message: Message
}

const AssistantMessage = memo(function AssistantMessage({
  isLive,
  message,
}: AssistantMessageProps) {
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
    </section>
  )
})

export function AskForm() {
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mountedRef = useRef(true)
  const stickToBottomRef = useRef(true)
  const scrollFrameRef = useRef<number | null>(null)

  const hasMessages = messages.length > 0
  const canSubmit =
    !isSubmitting && (Boolean(input.trim()) || pendingImages.length > 0)

  const syncStickToBottom = () => {
    stickToBottomRef.current = isDocumentNearBottom(
      window.scrollY,
      window.innerHeight,
      document.documentElement.scrollHeight,
    )
  }

  const scrollToEndIfStuck = (force = false) => {
    if (!force && !stickToBottomRef.current) {
      return
    }

    if (scrollFrameRef.current !== null) {
      return
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null
      if (!force && !stickToBottomRef.current) {
        return
      }
      messagesEndRef.current?.scrollIntoView({
        block: "end",
        behavior: "instant",
      })
      stickToBottomRef.current = true
    })
  }

  useEffect(() => {
    const onScrollOrResize = () => {
      syncStickToBottom()
    }

    syncStickToBottom()
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!hasMessages) return
    scrollToEndIfStuck()
  }, [hasMessages, messages])

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
    const streamBuffer = createStreamUiBuffer({
      activities: [],
      content: "",
      images: [],
    })

    const applyBufferedSnapshot = () => {
      const snapshot = streamBuffer.consume()
      if (!snapshot) return

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessage.id
            ? {
                ...message,
                content: snapshot.content,
                activities: snapshot.activities,
                images: snapshot.images,
              }
            : message
        )
      )
      scrollToEndIfStuck()
    }

    const scheduleStreamFlush = () => {
      streamBuffer.schedule(applyBufferedSnapshot)
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ])
    setInput("")
    setPendingImages([])
    setError(null)
    setIsSubmitting(true)
    stickToBottomRef.current = true
    scrollToEndIfStuck(true)

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

      const handleEvent = (event: NonNullable<ReturnType<typeof parseStreamLine>>) => {
        if (event.type === "text") {
          streamBuffer.appendText(event.delta)
          scheduleStreamFlush()
          return
        }

        if (event.type === "activity") {
          streamBuffer.applyActivity(event.activity)
          scheduleStreamFlush()
          return
        }

        if (event.type === "image") {
          streamBuffer.applyImage({
            id: event.id,
            url: event.imageUrl,
          })
          scheduleStreamFlush()
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

          if (!event) {
            continue
          }

          handleEvent(event)
        }
      }

      const finalChunk = decoder.decode()

      if (finalChunk) {
        buffer += finalChunk
      }

      if (buffer.trim()) {
        const event = parseStreamLine(buffer)

        if (event) {
          handleEvent(event)
        }
      }

      streamBuffer.flushNow(applyBufferedSnapshot)

      if (streamError && !abortController.signal.aborted) {
        throw new Error(streamError)
      }

      if (
        !streamBuffer.content.trim() &&
        !streamBuffer.hasImages &&
        !abortController.signal.aborted
      ) {
        throw new Error(
          "The AI service stopped before returning an answer. Try again."
        )
      }
    } catch (requestError) {
      streamBuffer.flushNow(applyBufferedSnapshot)

      const aborted =
        isAbortError(requestError) || abortController.signal.aborted
      const output = streamBuffer.content
      const receivedImages = streamBuffer.hasImages

      // Ignore late aborts from an unmounted tree so a remounted empty shell
      // is not the only surviving signal of a failed turn.
      if (!mountedRef.current) {
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
      streamBuffer.cancel()
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null
      }
      if (mountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="app-column min-w-0">
      {hasMessages ? (
        <div className="cleo-messages pt-8 sm:pt-10">
          <div className="flex flex-col gap-7">
            {messages.map((message) =>
              message.role === 'user' ? (
                <UserMessage key={message.id} message={message} />
              ) : (
                <AssistantMessage
                  isLive={isSubmitting && message.id === messages.at(-1)?.id}
                  key={message.id}
                  message={message}
                />
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
