import { existsSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { getAtlasEntry } from './atlas'
import { resolveOgAssetPath } from './og'
import { getSpaceSubject } from './space'
import { staticRendition } from './static-photo'

describe('resolveOgAssetPath', () => {
  it('maps curated atlas and space JPEGs onto public/images files', () => {
    const japan = getAtlasEntry('japan')
    const mars = getSpaceSubject('mars')
    expect(japan).toBeTruthy()
    expect(mars).toBeTruthy()

    const japanPath = resolveOgAssetPath(staticRendition(japan!.photo, 640).src)
    const marsPath = resolveOgAssetPath(staticRendition(mars!.photo, 640).src)

    expect(japanPath.startsWith(path.join(process.cwd(), 'public', 'images'))).toBe(
      true,
    )
    expect(marsPath.startsWith(path.join(process.cwd(), 'public', 'images'))).toBe(
      true,
    )
    expect(existsSync(japanPath)).toBe(true)
    expect(existsSync(marsPath)).toBe(true)
  })

  it('rejects traversal and unknown public roots', () => {
    expect(() => resolveOgAssetPath('/images/../secret.jpg')).toThrow(
      'Invalid OG cover path',
    )
    expect(() => resolveOgAssetPath('/media/foo.jpg')).toThrow(
      'Invalid OG cover path',
    )
  })
})
