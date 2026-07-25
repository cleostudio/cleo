"use client"

import {
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { CornerRightUp, Plus, Square, X } from "lucide-react"
import { ThinkingOrb } from "thinking-orbs"

import { ActivityPanel } from "@/components/activity-panel"
import { LiquidGlass } from "@/components/liquid-glass"
import { Markdown } from "@/components/markdown"
import { PixelCluster } from "@/components/pixel-cluster"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  filesToMessageImages,
  IMAGE_ACCEPT,
  MAX_IMAGES_PER_MESSAGE,
} from "@/lib/client-images"
import {
  type ActivityItem,
  type MessageImage,
  parseStreamLine,
} from "@/lib/stream"
import { cn } from "@/lib/utils"

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
  const [input, setInput] = useState("")
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messageIdRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0
  const canSubmit =
    !isSubmitting && (Boolean(input.trim()) || pendingImages.length > 0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  useEffect(() => {
    if (!isSubmitting && hasMessages) {
      inputRef.current?.focus()
    }
  }, [hasMessages, isSubmitting])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const question = input.trim()
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

      const applyTextDelta = (delta: string) => {
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
        throw new Error("The AI service returned an empty response.")
      }
    } catch (requestError) {
      const aborted =
        isAbortError(requestError) || abortController.signal.aborted

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
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-column flex min-h-[calc(100svh-2rem)] min-w-0 flex-col sm:min-h-[calc(100svh-3rem)]">
      {hasMessages ? (
        <div className="flex-1 pt-10 pb-36 sm:pb-40">
          <div className="mb-8 enter flex items-center gap-2">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Cleo
            </p>
            <PixelCluster className="shrink-0" variant={1} />
          </div>
          <div className="flex flex-col gap-7">
            {messages.map((message) =>
              message.role === "user" ? (
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
            className="scroll-mb-28"
            ref={messagesEndRef}
          />
        </div>
      ) : null}

      <div
        className={cn(
          hasMessages
            ? null
            : "flex flex-1 flex-col justify-center pb-16 pt-10"
        )}
      >
        {!hasMessages ? (
          <header className="cleo-masthead enter">
            <div className="cleo-masthead-title">
              <h1>Cleo</h1>
              <PixelCluster className="shrink-0" variant={2} />
            </div>
            <p className="cleo-masthead-lede">
              A general-purpose AI agent — candid, conversational, and ready
              when you are. Attach images, search the web, or just ask.
            </p>
            <p className="cleo-masthead-hint">
              Press <kbd>D</kbd> to toggle theme
            </p>
          </header>
        ) : null}

        <div
          className={cn(
            "prompt-dock-shell",
            !hasMessages && "enter"
          )}
          data-docked={hasMessages || undefined}
          style={
            !hasMessages
              ? ({ "--enter-delay": "80ms" } as CSSProperties)
              : undefined
          }
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
                aria-label={isSubmitting ? "Stop generating" : "Send message"}
                className="prompt-dock-send size-11 shrink-0 rounded-full active:!translate-y-0"
                disabled={!isSubmitting && !canSubmit}
                onClick={isSubmitting ? handleStop : undefined}
                size="icon"
                type={isSubmitting ? "button" : "submit"}
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
    </div>
  )
}
