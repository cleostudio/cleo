/**
 * Shared Continue affordance for interrupted Cleo answers (Stop, truncated
 * streams, mid-turn reload). The client submits CONTINUE_PROMPT as a hidden
 * user turn; the API appends resume guidance so the model finishes the draft
 * instead of restarting a tool sweep.
 */

export const CONTINUE_PROMPT = "Continue from where you left off."

export const CONTINUE_RESUME_GUIDANCE = `<continue_resume>
The user asked to continue an interrupted answer. Resume the unfinished draft:
do not restart from scratch, do not repeat sections already written, and prefer
finishing the existing reply over launching a new tool sweep unless a tool
result is clearly missing for the remaining content.
</continue_resume>`

export function isContinuePrompt(text: string): boolean {
  return text.trim() === CONTINUE_PROMPT
}
