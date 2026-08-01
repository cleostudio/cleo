/** @vitest-environment jsdom */

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

import { GalleryNavCard, NavCards } from '~/components/nav-cards'
import { countries } from '~/lib/countries'
import { getAllPosts } from '~/lib/content'
import { allGalleryItems } from '~/lib/gallery'
import { allTopics } from '~/lib/topics'

afterEach(() => {
  cleanup()
})

describe('NavCards', () => {
  it('renders Writing, Gallery, Explore, and Topics doorways', () => {
    const posts = getAllPosts()
    const topics = allTopics()

    render(
      <NavCards
        postCount={posts.length}
        exploreCount={countries.length}
        topicCount={topics.length}
        photoCard={<GalleryNavCard />}
      />,
    )

    expect(
      screen.getByRole('link', { name: /Writing/i }).getAttribute('href'),
    ).toBe('/blog')
    expect(
      screen.getByRole('link', { name: /Gallery/i }).getAttribute('href'),
    ).toBe('/gallery')
    expect(
      screen.getByRole('link', { name: /Explore/i }).getAttribute('href'),
    ).toBe('/explore')
    expect(
      screen.getByRole('link', { name: /Topics/i }).getAttribute('href'),
    ).toBe('/topics')

    expect(screen.getByText(`${posts.length} posts`)).toBeTruthy()
    expect(screen.getByText(`${countries.length} countries`)).toBeTruthy()
    expect(screen.getByText(`${topics.length} topics`)).toBeTruthy()
    expect(
      screen.getByText(`${allGalleryItems().length} photographs`),
    ).toBeTruthy()
  })
})
