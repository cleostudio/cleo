/** @vitest-environment jsdom */

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const push = vi.fn()

// jsdom has no layout, so it ships no scrollIntoView.
Element.prototype.scrollIntoView = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode
    href: string
    prefetch?: boolean
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

import { HomeSiteSearch } from './home-site-search'
import type { SiteSearchHit } from '~/lib/site-search'

const hits: SiteSearchHit[] = [
  {
    id: 'explore:japan',
    kind: 'explore',
    title: 'Japan',
    subtitle: 'JP · Asia',
    href: '/explore/japan',
    keywords: 'eastern asia tokyo fuji',
  },
  {
    id: 'photo:places:japan',
    kind: 'photo',
    title: 'Mount Fuji',
    subtitle: 'Japan',
    href: '/gallery#photo-places-japan',
  },
  {
    id: 'space:mars',
    kind: 'space',
    title: 'Mars',
    subtitle: 'MAR · Solar System',
    href: '/space/mars',
  },
  {
    id: 'writing:pale-blue-marble',
    kind: 'writing',
    title: 'Pale Blue Marble',
    subtitle: 'Nov 2025',
    href: '/blog/pale-blue-marble',
    keywords: 'voyager distance',
  },
  {
    id: 'surface:/gallery',
    kind: 'surface',
    title: 'Gallery',
    subtitle: 'Photographs',
    href: '/gallery',
  },
]

function setup(spotlightIds?: string[]) {
  render(<HomeSiteSearch hits={hits} spotlightIds={spotlightIds} />)
  return screen.getByRole('combobox')
}

function type(field: HTMLElement, value: string) {
  fireEvent.change(field, { target: { value } })
}

function optionNames() {
  return screen.getAllByRole('option').map((option) => option.textContent)
}

afterEach(() => {
  cleanup()
  push.mockClear()
})

describe('HomeSiteSearch', () => {
  it('stays closed until the field is used', () => {
    setup()
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('groups matches by kind and labels each row', () => {
    const field = setup()
    type(field, 'japan')

    expect(screen.getByRole('group', { name: 'Countries' })).toBeTruthy()
    expect(screen.getByRole('group', { name: 'Photographs' })).toBeTruthy()
    expect(optionNames()[0]).toContain('Japan')
    expect(optionNames()[0]).toContain('Country')
  })

  it('searches photographs and writing alongside the guides', () => {
    const field = setup()

    type(field, 'fuji')
    expect(optionNames()[0]).toContain('Mount Fuji')

    type(field, 'voyager')
    expect(optionNames()[0]).toContain('Pale Blue Marble')

    type(field, 'gallery')
    expect(optionNames()[0]).toContain('Gallery')
  })

  it('emphasizes the matched letters of a title', () => {
    const field = setup()
    type(field, 'jap')

    const option = screen.getAllByRole('option')[0]!
    expect(option.querySelector('.home-site-search-match')?.textContent).toBe(
      'Jap',
    )
  })

  it('keeps a split name in one run so the pieces still read as one word', () => {
    const field = setup()
    type(field, 'jap')

    // The pieces share a parent that sets no gap between them; hoisting them
    // into the row's flex layout would space "Jap" away from "an".
    const name = screen
      .getAllByRole('option')[0]!
      .querySelector('.home-site-search-row-name')
    expect(name?.textContent).toBe('Japan')
    expect([...name!.children].map((piece) => piece.textContent)).toEqual([
      'Jap',
      'an',
    ])
  })

  it('offers an Ask Cleo row for every query and links it to /cleo', () => {
    const field = setup()
    type(field, 'japan')

    const ask = screen.getByRole('option', { name: /Ask Cleo/ })
    expect(ask.getAttribute('href')).toBe('/cleo?q=japan')
    // A plain name is a lookup: the catalog match leads.
    expect(optionNames().at(-1)).toContain('Ask Cleo')
  })

  it('leads with Ask Cleo when the query reads as a question', () => {
    const field = setup()
    type(field, 'why is mars red?')

    expect(optionNames()[0]).toContain('Ask Cleo')
    expect(
      screen.getByRole('option', { name: /Ask Cleo/ }).getAttribute('href'),
    ).toBe('/cleo?q=why%20is%20mars%20red%3F')
  })

  it('offers Cleo when nothing in the catalog matches', () => {
    const field = setup()
    type(field, 'zzzznothing')

    expect(optionNames()).toHaveLength(1)
    expect(screen.getByRole('group', { name: 'No catalog match' })).toBeTruthy()
    expect(
      screen.getByRole('option', { name: /Ask Cleo/ }).getAttribute('href'),
    ).toBe('/cleo?q=zzzznothing')
  })

  it('highlights the top match so Return opens it', () => {
    const field = setup()
    type(field, 'japan')

    expect(field.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getAllByRole('option')[0]!.getAttribute('aria-selected')).toBe(
      'true',
    )

    fireEvent.keyDown(field, { key: 'Enter' })
    expect(push).toHaveBeenCalledWith('/explore/japan')
  })

  it('clears the query after a result is clicked', () => {
    const field = setup()
    type(field, 'japan')

    fireEvent.click(screen.getAllByRole('option')[0]!)

    expect((field as HTMLInputElement).value).toBe('')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('moves the highlight with the arrow keys and wraps around', () => {
    const field = setup()
    type(field, 'japan')

    const selected = () =>
      screen.getAllByRole('option').find((option) => option.dataset.active)
        ?.textContent

    fireEvent.keyDown(field, { key: 'ArrowDown' })
    expect(selected()).toContain('Mount Fuji')
    expect(field.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: /Mount Fuji/ }).id,
    )

    fireEvent.keyDown(field, { key: 'ArrowUp' })
    expect(selected()).toContain('Japan')

    // Up from the first row wraps to the last: the Ask Cleo option.
    fireEvent.keyDown(field, { key: 'ArrowUp' })
    expect(selected()).toContain('Ask Cleo')

    fireEvent.keyDown(field, { key: 'Home' })
    expect(selected()).toContain('Japan')

    fireEvent.keyDown(field, { key: 'End' })
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(push).toHaveBeenCalledWith('/cleo?q=japan')
  })

  it('sends the question to Cleo on Command-Return whatever is highlighted', () => {
    const field = setup()
    type(field, 'japan')

    fireEvent.keyDown(field, { key: 'Enter', metaKey: true })
    expect(push).toHaveBeenCalledWith('/cleo?q=japan')

    fireEvent.keyDown(field, { key: 'Enter', ctrlKey: true })
    expect(push).toHaveBeenLastCalledWith('/cleo?q=japan')
  })

  it('closes on Escape, then clears the query on a second Escape', () => {
    const field = setup()
    type(field, 'japan')

    fireEvent.keyDown(field, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()

    fireEvent.keyDown(field, { key: 'Escape' })
    expect((field as HTMLInputElement).value).toBe('')
  })

  it('shows spotlight starting points before anything is typed', () => {
    const field = setup(['explore:japan', 'space:mars', 'surface:/gallery'])
    fireEvent.focus(field)

    expect(screen.getByRole('group', { name: 'Start anywhere' })).toBeTruthy()
    expect(optionNames()).toHaveLength(3)
    // Nothing is highlighted yet, so Return cannot fire off a stray navigation.
    expect(field.getAttribute('aria-activedescendant')).toBeNull()
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(push).not.toHaveBeenCalled()

    fireEvent.keyDown(field, { key: 'ArrowDown' })
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(push).toHaveBeenCalledWith('/explore/japan')
  })

  it('ignores spotlight ids that are not in the catalog', () => {
    const field = setup(['explore:japan', 'explore:not-a-country'])
    fireEvent.focus(field)

    expect(optionNames()).toHaveLength(1)
  })

  it('focuses the field from anywhere with the slash key', () => {
    const field = setup()
    field.blur()

    fireEvent.keyDown(document.body, { key: '/' })
    expect(document.activeElement).toBe(field)
  })

  it('does not steal the slash key while typing in the field', () => {
    const field = setup()
    type(field, 'and/or')

    fireEvent.keyDown(field, { key: '/' })
    expect((field as HTMLInputElement).value).toBe('and/or')
  })
})
