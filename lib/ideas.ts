/**
 * Browser-only Ideas scratchpad. Conversation-style: no account or server
 * storage — ideas live in localStorage and clear if the browser data is wiped.
 */

export const IDEAS_STORAGE_KEY = 'cleo.ideas.v1'

export type Idea = {
  id: string
  title: string
  note: string
  done: boolean
  createdAt: number
  updatedAt: number
}

const MAX_TITLE = 200
const MAX_NOTE = 2_000
const MAX_IDEAS = 200

function trimTitle(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, MAX_TITLE)
}

function trimNote(value: string) {
  return value.trim().slice(0, MAX_NOTE)
}

function isIdea(value: unknown): value is Idea {
  if (!value || typeof value !== 'object') return false
  const idea = value as Partial<Idea>
  return (
    typeof idea.id === 'string' &&
    idea.id.length > 0 &&
    typeof idea.title === 'string' &&
    typeof idea.note === 'string' &&
    typeof idea.done === 'boolean' &&
    typeof idea.createdAt === 'number' &&
    typeof idea.updatedAt === 'number'
  )
}

/** Parse a stored JSON string into a validated idea list. */
export function parseIdeas(raw: string | null | undefined): Idea[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isIdea).slice(0, MAX_IDEAS)
  } catch {
    return []
  }
}

export function serializeIdeas(ideas: Idea[]): string {
  return JSON.stringify(ideas.slice(0, MAX_IDEAS))
}

export function createIdea(
  title: string,
  note = '',
  now = Date.now(),
  id = crypto.randomUUID(),
): Idea | null {
  const nextTitle = trimTitle(title)
  if (!nextTitle) return null
  return {
    id,
    title: nextTitle,
    note: trimNote(note),
    done: false,
    createdAt: now,
    updatedAt: now,
  }
}

export function addIdea(ideas: Idea[], title: string, note = ''): Idea[] {
  const idea = createIdea(title, note)
  if (!idea) return ideas
  return [idea, ...ideas].slice(0, MAX_IDEAS)
}

export function toggleIdeaDone(ideas: Idea[], id: string, now = Date.now()): Idea[] {
  return ideas.map((idea) =>
    idea.id === id ? { ...idea, done: !idea.done, updatedAt: now } : idea,
  )
}

export function removeIdea(ideas: Idea[], id: string): Idea[] {
  return ideas.filter((idea) => idea.id !== id)
}

export function updateIdea(
  ideas: Idea[],
  id: string,
  patch: { title?: string; note?: string },
  now = Date.now(),
): Idea[] {
  return ideas.map((idea) => {
    if (idea.id !== id) return idea
    const title =
      patch.title === undefined ? idea.title : trimTitle(patch.title) || idea.title
    const note = patch.note === undefined ? idea.note : trimNote(patch.note)
    return { ...idea, title, note, updatedAt: now }
  })
}

/** Open ideas first (newest), then completed (newest). */
export function sortIdeas(ideas: Idea[]): Idea[] {
  return [...ideas].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return b.updatedAt - a.updatedAt
  })
}

export function readIdeasFromStorage(
  storage: Pick<Storage, 'getItem'> | null | undefined = globalThis.localStorage,
): Idea[] {
  if (!storage) return []
  try {
    return parseIdeas(storage.getItem(IDEAS_STORAGE_KEY))
  } catch {
    return []
  }
}

export function writeIdeasToStorage(
  ideas: Idea[],
  storage: Pick<Storage, 'setItem'> | null | undefined = globalThis.localStorage,
) {
  if (!storage) return
  try {
    storage.setItem(IDEAS_STORAGE_KEY, serializeIdeas(ideas))
  } catch {
    // Quota / private mode — keep the in-memory list.
  }
}
