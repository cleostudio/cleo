import type { Tool } from 'openai/resources/responses/responses'

import { PORTAL_FUNCTION_TOOLS } from '~/lib/cleo/portal-tools'

/** Hosted + custom tools available on each Cleo Responses turn. */
export const CLEO_RESPONSE_TOOLS: Tool[] = [
  { type: 'web_search' },
  {
    type: 'image_generation',
    partial_images: 2,
    quality: 'auto',
    size: 'auto',
    output_format: 'png',
  },
  {
    type: 'code_interpreter',
    container: { type: 'auto' },
  },
  ...PORTAL_FUNCTION_TOOLS,
]

export const CLEO_RESPONSE_INCLUDE = [
  'reasoning.encrypted_content',
  'code_interpreter_call.outputs',
] as const

/** Max tool-capable Responses rounds before a forced `tool_choice: "none"` synthesis. */
export const MAX_PORTAL_TOOL_ROUNDS = 5
