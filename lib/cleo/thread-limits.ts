/** Stage 1 IndexedDB sizing — keep under typical origin quotas. */

/** Soft cap for all persisted Cleo thread data in this origin. */
export const MAX_TOTAL_THREAD_BYTES = 96 * 1024 * 1024

/** Soft cap for a single thread (text + image Blobs + reasoning cache). */
export const MAX_THREAD_BYTES = 32 * 1024 * 1024

/** Reasoning is an expendable cache (plan §3.3); 30-day TTL. */
export const REASONING_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** Per-thread ceiling for encrypted reasoning before it is dropped. */
export const MAX_REASONING_BYTES_PER_THREAD = 2 * 1024 * 1024

/**
 * Mutable view used by the store so tests can tighten caps without reloading
 * modules. Production code leaves these at the constants above.
 */
export const threadStoreLimits = {
  maxTotalBytes: MAX_TOTAL_THREAD_BYTES,
  maxThreadBytes: MAX_THREAD_BYTES,
  maxReasoningBytesPerThread: MAX_REASONING_BYTES_PER_THREAD,
  reasoningTtlMs: REASONING_TTL_MS,
}

export function resetThreadStoreLimitsForTests() {
  threadStoreLimits.maxTotalBytes = MAX_TOTAL_THREAD_BYTES
  threadStoreLimits.maxThreadBytes = MAX_THREAD_BYTES
  threadStoreLimits.maxReasoningBytesPerThread = MAX_REASONING_BYTES_PER_THREAD
  threadStoreLimits.reasoningTtlMs = REASONING_TTL_MS
}
