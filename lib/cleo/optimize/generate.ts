import OpenAI from 'openai'

import { buildCleoInstructions } from '~/lib/cleo/instructions'

export const CLEO_OPTIMIZE_MODEL = 'gpt-5.6-terra'

export type GenerateReplyFn = (
  instructions: string,
  prompt: string,
) => Promise<string>

export type ReviseInstructionsFn = (metaPrompt: string) => Promise<string>

function extractOutputText(response: {
  output_text?: string
  output?: Array<{
    type?: string
    content?: Array<{ type?: string; text?: string }>
  }>
}): string {
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim()
  }

  const parts: string[] = []
  for (const item of response.output ?? []) {
    if (item.type !== 'message' || !Array.isArray(item.content)) continue
    for (const part of item.content) {
      if (part.type === 'output_text' && typeof part.text === 'string') {
        parts.push(part.text)
      }
    }
  }
  return parts.join('\n').trim()
}

/** Live reply generation for optimize scoring (no tools — catalog is in instructions). */
export function createOpenAIGenerateReply(
  client: OpenAI = new OpenAI(),
  model = CLEO_OPTIMIZE_MODEL,
): GenerateReplyFn {
  return async (baseInstructions, prompt) => {
    const response = await client.responses.create({
      model,
      store: false,
      reasoning: { effort: 'low' },
      input: [
        {
          role: 'developer',
          content: buildCleoInstructions(baseInstructions),
        },
        { role: 'user', content: prompt },
      ],
    })
    const text = extractOutputText(response)
    if (!text) {
      throw new Error('Optimize generate returned empty output_text.')
    }
    return text
  }
}

export function createOpenAIReviseInstructions(
  client: OpenAI = new OpenAI(),
  model = CLEO_OPTIMIZE_MODEL,
): ReviseInstructionsFn {
  return async (metaPrompt) => {
    const response = await client.responses.create({
      model,
      store: false,
      reasoning: { effort: 'medium' },
      input: [
        {
          role: 'developer',
          content:
            'You are an expert prompt engineer revising Cleo base instructions. Follow the output contract exactly.',
        },
        { role: 'user', content: metaPrompt },
      ],
    })
    const text = extractOutputText(response)
    if (!text) {
      throw new Error('Optimize revise returned empty output_text.')
    }
    return text
  }
}
