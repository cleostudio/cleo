import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

/**
 * Components and hooks that predate this lint gate and still trip the React
 * Compiler rules. Each entry is real debt, not a false positive:
 *
 * - `react-hooks/refs` — the "latest ref" pattern (`ref.current = prop` during
 *   render). Correct under the compiler is an effect or `useEffectEvent`.
 * - `react-hooks/set-state-in-effect` — mount-time client-only values synced
 *   through an effect, costing one extra render.
 * - `react-hooks/immutability` — a `useCallback` that recurses into itself
 *   before its own binding is initialised.
 *
 * Untangling these means reworking live interactive surfaces, so they are
 * scoped here rather than silenced globally: every new file is still held to
 * the full rule set. Delete entries as they are fixed; do not add new ones.
 */
const reactCompilerDebt = [
  'components/bookshelf.tsx',
  'components/cleo/ask-form.tsx',
  'components/cleo/zoomable-message-image.tsx',
  'components/footer-clock.tsx',
  'components/hidden-list-stage.tsx',
  'components/home-site-search.tsx',
  'components/post-toc.tsx',
  'components/preferences.tsx',
  'components/theme-provider.tsx',
  'components/ui/checkbox-group.tsx',
  'components/ui/radio-group.tsx',
  'components/ui/tabs.tsx',
  'hooks/use-dock-go-shortcuts.ts',
  'hooks/use-merge-split.tsx',
]

export default defineConfig([
  ...nextVitals,

  {
    // Test files render throwaway fixtures and stub components; production
    // image/link/hook rules do not describe anything meaningful there.
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      'jsx-a11y/alt-text': 'off',
      'react-hooks/immutability': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },

  {
    files: reactCompilerDebt,
    rules: {
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'drizzle/**',
    'public/**',
  ]),
])
