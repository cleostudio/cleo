/** Copy text with Clipboard API, falling back to `execCommand` when needed. */
export async function copyTextToClipboard(value: string): Promise<boolean> {
  if (typeof document === 'undefined') return false

  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    // insecure context / permissions policy — try the legacy path
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}
