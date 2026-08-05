import { createHash } from "node:crypto"

/**
 * Privacy-preserving `safety_identifier` for the Responses API.
 * Hash account or guest seeds so OpenAI can correlate abuse without receiving
 * raw emails, usernames, or IP strings.
 */
export function cleoSafetyIdentifier(seed: string) {
  const normalized = seed.trim() || "anonymous"

  return createHash("sha256")
    .update(`cleo:safety:${normalized}`)
    .digest("hex")
}
