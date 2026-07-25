import type { BookingEmailKind } from './types'

export type BookingEmailContext = {
  kind: BookingEmailKind
  /** Kept for type/DB compat; emails are always rendered in English. */
  locale: 'zh' | 'en'
  guestName: string
  startsAt: Date
  endsAt: Date
  guestTimeZone: string
  meetingProvider: 'google-meet' | 'tencent-meeting'
  meetingUrl: string | null
  manageUrl: string | null
  /** Only meaningful for the 'cancelled' kind. */
  refund: 'automatic' | 'none' | null
}

type Locale = BookingEmailContext['locale']

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'button'; label: string; url: string }
  | { type: 'link'; label: string; url: string }

function providerName(provider: BookingEmailContext['meetingProvider'], _locale?: Locale) {
  if (provider === 'google-meet') return 'Google Meet'
  return 'Tencent Meeting'
}

function formatSessionTime(startsAt: Date, guestTimeZone: string, _locale?: Locale) {
  const intlLocale = 'en-US'
  const dateTime = new Intl.DateTimeFormat(intlLocale, {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: guestTimeZone,
  }).format(startsAt)
  const zoneName =
    new Intl.DateTimeFormat(intlLocale, {
      timeZoneName: 'short',
      timeZone: guestTimeZone,
    })
      .formatToParts(startsAt)
      .find((part) => part.type === 'timeZoneName')?.value ?? guestTimeZone
  return `${dateTime} (${zoneName}, 60 minutes)`
}

function greeting(guestName: string, _locale?: Locale): Block {
  return {
    type: 'paragraph',
    text: `Hi ${guestName},`,
  }
}

function meetingBlocks(context: BookingEmailContext): Block[] {
  const name = providerName(context.meetingProvider)
  if (context.meetingUrl) {
    return [
      {
        type: 'paragraph',
        text: `We'll meet on ${name}.`,
      },
      {
        type: 'button',
        label: 'Join the session',
        url: context.meetingUrl,
      },
    ]
  }
  return [
    {
      type: 'paragraph',
      text: `Your ${name} link is still being finalized and will follow in a calendar update.`,
    },
  ]
}

function policyBlock(_locale?: Locale): Block {
  return {
    type: 'paragraph',
    text: 'You can reschedule or cancel for free until 24 hours before the session. Within 24 hours of the start time, cancellations are not automatically refunded.',
  }
}

function manageBlocks(
  manageUrl: string | null,
  _locale: Locale | undefined,
  presentation: 'button' | 'link',
): Block[] {
  if (!manageUrl) return []
  return [
    {
      type: 'paragraph',
      text: 'Your private Manage Link below lets you view, reschedule, or cancel this booking. Please keep it to yourself.',
    },
    {
      type: presentation,
      label: 'Manage your booking',
      url: manageUrl,
    },
  ]
}

function signOff(): Block {
  return { type: 'paragraph', text: 'Cali' }
}

function subjectFor(kind: BookingEmailKind, _locale?: Locale): string {
  const subjects: Record<BookingEmailKind, string> = {
    confirmation: 'Your AMA Session with Cali is booked',
    rescheduled: 'Your AMA Session has a new time',
    needs_reschedule: 'Please pick a new time for your AMA Session',
    cancelled: 'Your AMA Session has been cancelled',
    reminder_24h: 'Your AMA Session is in 24 hours',
    reminder_1h: 'Your AMA Session starts in 1 hour',
  }
  return subjects[kind]
}

function bodyBlocks(context: BookingEmailContext): Block[] {
  const sessionTime = formatSessionTime(context.startsAt, context.guestTimeZone)
  const manageAs = context.meetingUrl ? 'link' : 'button'

  switch (context.kind) {
    case 'confirmation':
      return [
        greeting(context.guestName),
        {
          type: 'paragraph',
          text: `Thank you for booking an AMA Session. We're set for ${sessionTime}.`,
        },
        ...meetingBlocks(context),
        policyBlock(),
        ...manageBlocks(context.manageUrl, context.locale, manageAs),
        {
          type: 'paragraph',
          text: 'Looking forward to talking with you.',
        },
        signOff(),
      ]
    case 'rescheduled':
      return [
        greeting(context.guestName),
        {
          type: 'paragraph',
          text: `Your AMA Session has been rescheduled. The new time is ${sessionTime}.`,
        },
        ...meetingBlocks(context),
        policyBlock(),
        ...manageBlocks(context.manageUrl, context.locale, manageAs),
        {
          type: 'paragraph',
          text: 'See you then.',
        },
        signOff(),
      ]
    case 'needs_reschedule':
      return [
        greeting(context.guestName),
        {
          type: 'paragraph',
          text: 'Sorry about this: while your payment was completing, someone else took the time you picked. Your payment went through and your booking is safe, it just needs a new time.',
        },
        {
          type: 'paragraph',
          text: "Whenever you're ready, pick a new time with your private Manage Link below. The link manages this booking, so please keep it to yourself.",
        },
        ...(context.manageUrl
          ? [
              {
                type: 'button',
                label: 'Pick a new time',
                url: context.manageUrl,
              } satisfies Block,
            ]
          : []),
        {
          type: 'paragraph',
          text: 'Sorry again for the shuffle. Talk soon.',
        },
        signOff(),
      ]
    case 'cancelled':
      return [
        greeting(context.guestName),
        {
          type: 'paragraph',
          text: `Your AMA Session scheduled for ${sessionTime} has been cancelled.`,
        },
        ...(context.refund === 'automatic'
          ? [
              {
                type: 'paragraph',
                text: 'A full refund has been issued to your original payment method. It may take a few business days to show up.',
              } satisfies Block,
            ]
          : []),
        ...(context.refund === 'none'
          ? [
              {
                type: 'paragraph',
                text: 'Per the cancellation policy, bookings cancelled within 24 hours of the start time are not automatically refunded.',
              } satisfies Block,
            ]
          : []),
        {
          type: 'paragraph',
          text: "If anything went sideways or you'd like to rebook, just reply to this email.",
        },
        signOff(),
      ]
    case 'reminder_24h':
      return [
        greeting(context.guestName),
        {
          type: 'paragraph',
          text: `Just a reminder that your AMA Session is coming up: ${sessionTime}.`,
        },
        ...meetingBlocks(context),
        ...manageBlocks(context.manageUrl, context.locale, 'link'),
        signOff(),
      ]
    case 'reminder_1h':
      return [
        greeting(context.guestName),
        {
          type: 'paragraph',
          text: `Your AMA Session starts soon: ${sessionTime}.`,
        },
        ...meetingBlocks(context),
        ...manageBlocks(context.manageUrl, context.locale, 'link'),
        signOff(),
      ]
  }
}

function renderText(blocks: Block[], _locale?: Locale): string {
  return blocks
    .map((block) =>
      block.type === 'paragraph' ? block.text : `${block.label}: ${block.url}`,
    )
    .join('\n\n')
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function renderHtml(blocks: Block[]): string {
  const rendered = blocks
    .map((block) => {
      if (block.type === 'paragraph') {
        return `<p style="margin: 0 0 16px; color: #374151;">${escapeHtml(block.text)}</p>`
      }
      if (block.type === 'button') {
        return `<p style="margin: 24px 0;"><a href="${escapeHtml(block.url)}" style="display: inline-block; padding: 10px 20px; border-radius: 8px; background-color: #111827; color: #ffffff; text-decoration: none; font-weight: 500;">${escapeHtml(block.label)}</a></p>`
      }
      return `<p style="margin: 0 0 16px;"><a href="${escapeHtml(block.url)}" style="color: #111827; text-decoration: underline;">${escapeHtml(block.label)}</a></p>`
    })
    .join('\n')
  return `<div style="max-width: 560px; margin: 0 auto; padding: 24px 16px; font-family: ${FONT_STACK}; font-size: 14px; line-height: 1.6; color: #374151;">\n${rendered}\n</div>`
}

export function renderBookingEmail(context: BookingEmailContext): {
  subject: string
  text: string
  html: string
} {
  const blocks = bodyBlocks(context)
  return {
    subject: subjectFor(context.kind),
    text: renderText(blocks),
    html: renderHtml(blocks),
  }
}
