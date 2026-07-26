import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  chromaticTokens,
  editorialTokens,
  layerTokens,
  layoutTokens,
  motionTokens,
  paletteRamp,
  semanticColorTokens,
  surfaceLadder,
  THEME_PRESET_UPSTREAM,
  typeWeightTokens,
} from './theme-preset'

const globals = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')

/** Skips `@media` blocks so a responsive override cannot shadow a base value. */
function withoutAtRules(css: string) {
  let output = ''
  let index = 0

  while (index < css.length) {
    const next = css.indexOf('@media', index)

    if (next === -1) {
      return output + css.slice(index)
    }

    output += css.slice(index, next)
    index = css.indexOf('{', next) + 1

    let depth = 1

    while (index < css.length && depth > 0) {
      if (css[index] === '{') depth += 1
      if (css[index] === '}') depth -= 1
      index += 1
    }
  }

  return output
}

const base = withoutAtRules(globals)

/** Merges the declarations of every top-level rule matching `selector`. */
function declarations(selector: string) {
  const merged = new Map<string, string>()
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const opener = new RegExp(`(^|\\})\\s*${escaped}\\s*\\{`, 'gm')

  for (const match of base.matchAll(opener)) {
    let depth = 1
    let index = match.index + match[0].length
    const start = index

    while (index < base.length && depth > 0) {
      if (base[index] === '{') depth += 1
      if (base[index] === '}') depth -= 1
      index += 1
    }

    for (const declaration of base
      .slice(start, index - 1)
      .matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      merged.set(declaration[1] as string, (declaration[2] as string).trim())
    }
  }

  return merged
}

const root = declarations(':root')
const light = declarations('.public-site')
const dark = declarations('.dark.public-site')

describe('theme preset: palette', () => {
  it('defines the full warm gray ramp in both themes', () => {
    for (const token of paletteRamp) {
      expect(light.get(token), `${token} missing from the light ramp`).toMatch(
        /^oklch\(/,
      )
      expect(dark.get(token), `${token} missing from the dark ramp`).toMatch(
        /^oklch\(/,
      )
    }
  })

  it('inverts the ramp in dark rather than recolouring semantics one by one', () => {
    const lightness = (value: string) =>
      Number(/^oklch\(([\d.]+)/.exec(value)?.[1])

    expect(lightness(light.get('--gray-1') as string)).toBeGreaterThan(
      lightness(light.get('--gray-12') as string),
    )
    expect(lightness(dark.get('--gray-1') as string)).toBeLessThan(
      lightness(dark.get('--gray-12') as string),
    )
  })

  it('resolves every semantic color through the ramp, never a raw color', () => {
    for (const token of semanticColorTokens) {
      expect(
        light.get(token),
        `${token} should read from the ramp on the public site`,
      ).toMatch(/^var\(--gray-/)
    }
  })

  it('keeps the chromatic semantics off the ramp', () => {
    for (const token of chromaticTokens) {
      const value = light.get(token) ?? root.get(token)

      expect(value, `${token} is missing`).toBeDefined()
      expect(value, `${token} should carry its own hue`).toMatch(/^oklch\(/)
    }
  })

  it('keeps the editorial tokens the print vocabulary depends on', () => {
    for (const token of editorialTokens) {
      expect(
        light.get(token) ?? root.get(token),
        `${token} is missing`,
      ).toBeDefined()
    }
  })

  it('carries the eight-step surface ladder into both themes', () => {
    const darkFallback = declarations('.dark')

    for (const token of surfaceLadder) {
      expect(root.get(token), `${token} has no base value`).toBeDefined()
      expect(
        darkFallback.get(token),
        `${token} has no dark value`,
      ).toBeDefined()
    }
  })
})

describe('theme preset: pinned tokens', () => {
  it.each([
    ...Object.entries(motionTokens),
    ...Object.entries(typeWeightTokens),
    ...Object.entries(layoutTokens),
    ...Object.entries(layerTokens),
  ])('pins %s to %s', (token, value) => {
    expect(root.get(token)).toBe(value)
  })

  it('derives every radius step from the base radius', () => {
    for (const step of ['sm', 'md', 'xl', '2xl', '3xl', '4xl']) {
      const declaration = new RegExp(`--radius-${step}:\\s*([^;]+);`).exec(
        globals,
      )?.[1]

      expect(declaration, `--radius-${step} should scale from --radius`).toMatch(
        /calc\(var\(--radius\)/,
      )
    }
  })

  it('thins the hairline on high-density displays', () => {
    expect(globals).toMatch(
      /min-resolution:\s*192dpi[\s\S]{0,200}--border-hairline:\s*0\.5px/,
    )
  })
})

describe('theme preset: conformance', () => {
  const columnWidths = [
    layoutTokens['--content-column'],
    layoutTokens['--content-column-narrow'],
  ]

  it('exposes the column to Tailwind so utilities and CSS share one source', () => {
    expect(globals).toContain('--container-content: var(--content-column)')
    expect(globals).toContain(
      '--container-content-narrow: var(--content-column-narrow)',
    )
  })

  it.each(columnWidths)(
    'keeps %s out of the stylesheet as a literal width',
    (width) => {
      // A literal here desynchronises the shell from the ambient guides.
      expect(globals).not.toContain(`min(${width},`)
    },
  )

  it.each(columnWidths)('keeps max-w-[%s] out of components', (width) => {
    const offenders = componentSources()
      .filter((source) => readFileSync(source, 'utf8').includes(`max-w-[${width}]`))
      .map((source) => source.replace(`${process.cwd()}/`, ''))

    expect(offenders, 'use max-w-content or max-w-content-narrow').toEqual([])
  })

  it('states the upstream the preset tracks', () => {
    expect(THEME_PRESET_UPSTREAM).toBe('https://github.com/CaliCastle/cali.so')
  })
})

function componentSources() {
  return ['src/app', 'src/components'].flatMap((directory) =>
    readdirSync(join(process.cwd(), directory), { recursive: true })
      .map(String)
      .filter((name) => name.endsWith('.tsx') && !name.includes('.test.'))
      .map((name) => join(process.cwd(), directory, name)),
  )
}
