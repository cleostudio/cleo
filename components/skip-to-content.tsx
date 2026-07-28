import { T } from '~/lib/i18n'

/** First focusable control — jumps past the chrome/dock into main content. */
export function SkipToContent() {
  return (
    <a href="#main-content" className="skip-to-content">
      <T zh="跳到主要内容" en="Skip to content" />
    </a>
  )
}
