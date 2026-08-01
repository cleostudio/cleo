/** Max length for a display name injected into Cleo instructions. */
const MAX_DISPLAY_NAME_LENGTH = 80

/**
 * Normalize an account display name for private Responses API instructions.
 * Rejects empty / control-only values; strips markup delimiters so a crafted
 * name cannot break out of the instruction block.
 */
export function sanitizeUserDisplayName(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const cleaned = value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_DISPLAY_NAME_LENGTH)
    .trim()

  return cleaned || null
}

/**
 * Keep the signed-in account name out of the visible conversation. It is
 * supplied only as ephemeral developer context for the current request.
 */
export function buildUserProfileInstructions(displayName: string) {
  const name = sanitizeUserDisplayName(displayName)
  if (!name) return undefined

  return `<cleo_user_profile>
The user is signed in. Their account name is:
- Preferred name: ${name}

Use the name to personalize replies when it feels natural — a brief greeting, direct address, or acknowledging who you are talking to. Do not force the name into every reply, invent a nickname, or claim a prior relationship or memory beyond this conversation. Treat the name as private account context: never invent other personal details from it, and do not put it in citations or image-generation prompts unless the user asks.
</cleo_user_profile>`
}
