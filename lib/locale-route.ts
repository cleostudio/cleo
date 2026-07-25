/** English-only site. Kept as a thin helper layer for call sites that still
 *  pass a locale argument around AMA/admin history. */
export type Locale = 'en'

export function localeFromPathname(_pathname: string): Locale {
  return 'en'
}

export function unlocalizedPathname(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  if (
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname.includes('\\') ||
    pathname.includes('\0')
  ) {
    throw new Error('Invalid locale path')
  }
  // Legacy /en URLs normalize to the unprefixed English path.
  if (pathname === '/en' || pathname === '/en/') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}

export function localePath(_locale: Locale, path: string) {
  const suffixIndex = path.search(/[?#]/)
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex)
  return `${unlocalizedPathname(pathname)}${suffix}`
}

export function localize(_locale: Locale, _zh: string, en: string) {
  return en
}
