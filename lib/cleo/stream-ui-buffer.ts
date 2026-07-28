import type { ActivityItem, MessageImage } from '~/lib/cleo/stream'

export type StreamUiSnapshot = {
  activities: ActivityItem[]
  content: string
  images: MessageImage[]
}

/**
 * Mutable buffer that coalesces streamed assistant updates so React state can
 * flush at most once per animation frame.
 */
export function createStreamUiBuffer(initial?: Partial<StreamUiSnapshot>) {
  let content = initial?.content ?? ''
  let activities = [...(initial?.activities ?? [])]
  let images = [...(initial?.images ?? [])]
  let dirty = false
  let frame: number | null = null

  const upsertActivity = (activity: ActivityItem) => {
    const index = activities.findIndex((item) => item.id === activity.id)
    if (index === -1) {
      activities = [...activities, activity]
      return
    }

    const previous = activities[index]!
    const next = [...activities]
    next[index] = {
      ...previous,
      ...activity,
      action: activity.action ?? previous.action,
      summary: activity.summary ?? previous.summary,
    }
    activities = next
  }

  const upsertImage = (image: MessageImage) => {
    if (!image.id) {
      images = [...images, image]
      return
    }

    const index = images.findIndex((item) => item.id === image.id)
    if (index === -1) {
      images = [...images, image]
      return
    }

    const next = [...images]
    next[index] = image
    images = next
  }

  return {
    appendText(delta: string) {
      if (!delta) return
      content += delta
      dirty = true
    },
    applyActivity(activity: ActivityItem) {
      upsertActivity(activity)
      dirty = true
    },
    applyImage(image: MessageImage) {
      upsertImage(image)
      dirty = true
    },
    snapshot(): StreamUiSnapshot {
      return {
        content,
        activities: [...activities],
        images: [...images],
      }
    },
    isDirty() {
      return dirty
    },
    /** Apply buffered state if dirty; clears the dirty flag. */
    consume(): StreamUiSnapshot | null {
      if (!dirty) return null
      dirty = false
      return this.snapshot()
    },
    schedule(flush: () => void, raf: typeof requestAnimationFrame = requestAnimationFrame) {
      if (frame !== null) return
      frame = raf(() => {
        frame = null
        flush()
      })
    },
    cancel(caf: typeof cancelAnimationFrame = cancelAnimationFrame) {
      if (frame === null) return
      caf(frame)
      frame = null
    },
    flushNow(
      flush: () => void,
      caf: typeof cancelAnimationFrame = cancelAnimationFrame,
    ) {
      this.cancel(caf)
      flush()
    },
    get content() {
      return content
    },
    get hasImages() {
      return images.length > 0
    },
  }
}

export type StreamUiBuffer = ReturnType<typeof createStreamUiBuffer>
