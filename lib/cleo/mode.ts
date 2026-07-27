/**
 * Cleo interaction modes — map UI choice to reasoning floor, tool set hints,
 * and instruction nudges without changing Cleo's identity.
 *
 * Web search knobs follow OpenAI Responses `web_search` guidance:
 * `search_context_size` low/medium/high for lookup vs deeper research.
 */

import type { WebSearchTool } from 'openai/resources/responses/responses'

import type { CleoReasoningEffort } from '~/lib/cleo/reasoning-effort'

export const CLEO_MODES = ['quick', 'auto', 'research'] as const

export type CleoMode = (typeof CLEO_MODES)[number]

export type CleoWebSearchContextSize = NonNullable<
  WebSearchTool['search_context_size']
>

export function isCleoMode(value: unknown): value is CleoMode {
  return (
    typeof value === 'string' &&
    (CLEO_MODES as readonly string[]).includes(value)
  )
}

export function parseCleoMode(value: unknown): CleoMode {
  return isCleoMode(value) ? value : 'auto'
}

/** Floor reasoning effort for the selected mode (heuristic may raise it). */
export function modeReasoningFloor(mode: CleoMode): CleoReasoningEffort {
  if (mode === 'quick') return 'low'
  if (mode === 'research') return 'high'
  return 'medium'
}

/** Raise or clamp heuristic effort to respect the mode floor/ceiling. */
export function applyModeReasoningEffort(
  mode: CleoMode,
  heuristic: CleoReasoningEffort,
): CleoReasoningEffort {
  if (mode === 'quick') {
    return heuristic === 'high' ? 'medium' : 'low'
  }
  if (mode === 'research') {
    return 'high'
  }
  return heuristic
}

export function modeAllowsCodeInterpreter(mode: CleoMode): boolean {
  return mode !== 'quick'
}

export function modeTextVerbosity(
  mode: CleoMode,
): 'low' | 'medium' | 'high' {
  if (mode === 'quick') return 'low'
  if (mode === 'research') return 'high'
  return 'medium'
}

/** Hosted web_search context size for the selected mode. */
export function modeWebSearchContextSize(
  mode: CleoMode,
): CleoWebSearchContextSize {
  if (mode === 'quick') return 'low'
  if (mode === 'research') return 'high'
  return 'medium'
}

/** Hosted web_search tool config for the selected mode. */
export function buildModeWebSearchTool(mode: CleoMode): WebSearchTool {
  return {
    type: 'web_search',
    search_context_size: modeWebSearchContextSize(mode),
  }
}

/** Extra developer instructions for the selected mode. */
export function buildModeInstructions(mode: CleoMode): string {
  if (mode === 'quick') {
    return `<cleo_mode>
Mode: quick. Prefer a short, direct answer. Skip optional tool calls when a confident brief reply works. Use portal tools only when a guide link or photo is clearly needed. Do not use the python/code interpreter unless the user explicitly asks for a calculation you cannot do safely in your head.
</cleo_mode>`
  }

  if (mode === 'research') {
    return `<cleo_mode>
Mode: research. Prefer evidence-backed answers. Use portal tools for on-site guides/photos/Writing when relevant, and \`web_search\` for external or time-sensitive claims. For fact-checks: state a clear verdict, cite sources next to supported claims, and note material uncertainty. Use the python tool for non-trivial calculations, unit conversions, or numeric comparisons when it improves accuracy.
</cleo_mode>`
  }

  return `<cleo_mode>
Mode: auto. Match depth to the request. Use portal tools for catalog subjects, \`web_search\` when evidence is needed, and the python tool for non-trivial math or data crunching.
</cleo_mode>`
}

export const CLEO_MODE_OPTIONS = [
  {
    id: 'quick' as const,
    label: 'Quick',
    description: 'Short answers; fewer tools',
  },
  {
    id: 'auto' as const,
    label: 'Auto',
    description: 'Balanced depth and tools',
  },
  {
    id: 'research' as const,
    label: 'Research',
    description: 'Evidence-backed answers with sources',
  },
]

/** Stable OpenAI prompt_cache_key per mode (tools + instructions differ). */
export function modePromptCacheKey(mode: CleoMode): string {
  return `cleo:agent:v1:${mode}`
}

/** Allow parallel portal lookups in Auto/Research; keep Quick serial. */
export function modeParallelToolCalls(mode: CleoMode): boolean {
  return mode !== 'quick'
}
