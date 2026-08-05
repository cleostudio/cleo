import { randomUUID } from 'node:crypto'

/** Max characters per stored memory note. */
export const CLEO_MEMORY_NOTE_MAX = 280
/** Max stored notes per signed-in account. */
export const CLEO_MEMORY_NOTES_MAX = 20
/** Soft cap for the injected `<cleo_user_memory>` developer block. */
export const CLEO_MEMORY_BLOCK_MAX = 1_800

export type CleoMemoryNote = {
  id: string
  note: string
  createdAt: Date | string
}

export type ParsedMemoryNote =
  | { ok: true; note: string }
  | { ok: false; error: string; status: number }

/**
 * Normalize a user-authored memory note. Strips controls and angle brackets so
 * a crafted note cannot break out of the instruction block.
 */
export function sanitizeMemoryNote(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const cleaned = value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, CLEO_MEMORY_NOTE_MAX)
    .trim()

  return cleaned || null
}

export function parseMemoryNoteBody(body: unknown): ParsedMemoryNote {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON body.', status: 400 }
  }

  const note = sanitizeMemoryNote((body as { note?: unknown }).note)
  if (!note) {
    return {
      ok: false,
      error: `note is required (1–${CLEO_MEMORY_NOTE_MAX} characters).`,
      status: 400,
    }
  }

  return { ok: true, note }
}

export function newCleoMemoryId(): string {
  return randomUUID()
}

/**
 * Newest-first notes that fit in the injection budget. Older notes drop first.
 */
export function selectNotesForInjection(
  notes: readonly CleoMemoryNote[],
  blockMax = CLEO_MEMORY_BLOCK_MAX,
): CleoMemoryNote[] {
  const sorted = [...notes].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()
    return bTime - aTime
  })

  const selected: CleoMemoryNote[] = []
  let used = '<cleo_user_memory>\n</cleo_user_memory>\n'.length

  for (const entry of sorted) {
    const line = `- ${entry.note}\n`
    if (used + line.length > blockMax) break
    selected.push(entry)
    used += line.length
  }

  // Present oldest→newest in the block for natural reading.
  return selected.reverse()
}

/**
 * Private developer block for signed-in preference notes. Guests never get this.
 */
export function buildUserMemoryInstructions(
  notes: readonly CleoMemoryNote[],
): string | undefined {
  const selected = selectNotesForInjection(notes)
  if (selected.length === 0) return undefined

  const lines = selected.map((entry) => `- ${entry.note}`).join('\n')

  return `<cleo_user_memory>
The user opted in to remember these durable preferences across sessions:
${lines}

Use a note only when it clearly helps the current request. Do not invent memories, preferences, or personal facts beyond this list. Do not recite the whole list unprompted. Treat these notes as private account context — never put them in citations or image-generation prompts unless the user asks. Guests and users without this block have no durable memory.
</cleo_user_memory>`
}
