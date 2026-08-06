/**
 * Thread scroll helpers for Cleo — chloei-style turn anchoring on top of
 * `use-stick-to-bottom`. Latest turn stays near the top until its content
 * approaches the prompt, then falls through to true bottom stick.
 */

/** Breathing room above the latest user bubble while a turn is anchored. */
export const ANCHOR_TOP_GAP_PX = 44

/** Start bottom-following slightly before the turn reaches the prompt. */
export const STREAMING_SCROLL_EARLY_TRIGGER_PX = 72

/** Extra air below the measured prompt clearance for the overflow trigger. */
export const STREAMING_SCROLL_PROMPT_BUFFER_PX = 24

export type ThreadScrollMessage = {
  hidden?: boolean
  id: number
  role: "assistant" | "user"
}

export type ThreadMessageGroup<T extends ThreadScrollMessage> = {
  messages: T[]
  userMessageId: number | null
}

/** Group visible messages into user→assistant turns (hidden Continue users skipped). */
export function groupThreadMessages<T extends ThreadScrollMessage>(
  messages: readonly T[],
): ThreadMessageGroup<T>[] {
  const groups: ThreadMessageGroup<T>[] = []

  for (const message of messages) {
    if (message.hidden) {
      continue
    }

    if (message.role === "user") {
      groups.push({
        messages: [message],
        userMessageId: message.id,
      })
      continue
    }

    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.userMessageId !== null) {
      lastGroup.messages.push(message)
      continue
    }

    groups.push({
      messages: [message],
      userMessageId: null,
    })
  }

  return groups
}

export type ThreadScrollTargetInput = {
  contentElement: HTMLElement
  isActiveTurnInProgress: boolean
  overflowPinnedTurnId: string | null
  promptSelector?: string
  targetScrollTop: number
}

export type ThreadScrollTargetResult = {
  overflowPinnedTurnId: string | null
  scrollTop: number
}

/**
 * Compute the stick target for the latest turn. Anchors the turn near the top
 * until its visible content nears the prompt (or a prior overflow pin for that
 * turn is still active), then returns the library's default bottom target.
 */
export function resolveThreadScrollTarget({
  targetScrollTop,
  contentElement,
  isActiveTurnInProgress,
  overflowPinnedTurnId,
  promptSelector = "[data-prompt-form]",
}: ThreadScrollTargetInput): ThreadScrollTargetResult {
  const latestTurnGroups = contentElement.querySelectorAll<HTMLElement>(
    "[data-message-group='turn']",
  )

  if (latestTurnGroups.length === 0) {
    return { scrollTop: targetScrollTop, overflowPinnedTurnId }
  }

  const latestTurnGroup = latestTurnGroups[latestTurnGroups.length - 1]
  if (!latestTurnGroup) {
    return { scrollTop: targetScrollTop, overflowPinnedTurnId }
  }

  const latestTurnId = latestTurnGroup.dataset.userMessageId || null
  const contentTop = contentElement.getBoundingClientRect().top
  const latestTurnTop = latestTurnGroup.getBoundingClientRect().top
  const anchoredTarget = Math.max(
    latestTurnTop - contentTop - ANCHOR_TOP_GAP_PX,
    0,
  )

  const scrollViewport = contentElement.parentElement
  const scrollViewportRect = scrollViewport?.getBoundingClientRect()
  const scrollViewportHeight = scrollViewportRect?.height ?? 0

  const latestVisibleTurnElement =
    latestTurnGroup.lastElementChild instanceof HTMLElement
      ? latestTurnGroup.lastElementChild
      : latestTurnGroup
  const latestVisibleTurnBoundary =
    latestVisibleTurnElement.getBoundingClientRect().bottom - latestTurnTop

  const promptElement =
    contentElement.ownerDocument.querySelector<HTMLElement>(promptSelector)
  const promptRect = promptElement?.getBoundingClientRect()
  const promptClearance =
    promptRect && scrollViewportRect
      ? Math.max(0, scrollViewportRect.bottom - promptRect.top)
      : (promptRect?.height ?? 0)

  // Use the last rendered item in the turn instead of the group's min-height
  // so the user's bubble keeps its original anchored position.
  const earlyTriggerOffset = Math.max(
    STREAMING_SCROLL_EARLY_TRIGGER_PX,
    promptClearance + STREAMING_SCROLL_PROMPT_BUFFER_PX,
  )
  const latestTurnNearPrompt =
    scrollViewportHeight > 0 &&
    latestVisibleTurnBoundary > scrollViewportHeight - earlyTriggerOffset

  let nextPinnedTurnId = overflowPinnedTurnId
  if (isActiveTurnInProgress && latestTurnNearPrompt && latestTurnId) {
    nextPinnedTurnId = latestTurnId
  }

  if (
    latestTurnNearPrompt &&
    latestTurnId !== null &&
    (isActiveTurnInProgress || nextPinnedTurnId === latestTurnId)
  ) {
    return { scrollTop: targetScrollTop, overflowPinnedTurnId: nextPinnedTurnId }
  }

  return { scrollTop: anchoredTarget, overflowPinnedTurnId: nextPinnedTurnId }
}
