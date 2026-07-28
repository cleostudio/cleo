/**
 * Smoke the Ask Cleo deep-link contract (prompts, topic= round-trips, UI links).
 * Runs the focused vitest suite — no production server required.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const targets = [
  'lib/cleo/ask-links.fixtures.test.ts',
  'lib/cleo/ask-links.test.ts',
  'lib/cleo/ask-params.test.ts',
  'lib/cleo/parse-ask-search-params.test.ts',
  'lib/cleo/compare-neighbors.test.ts',
  'lib/cleo/topic-photos.test.ts',
  'lib/cleo/cleo-page-ask.test.ts',
  'components/ask-cleo-link.test.tsx',
]

const result = spawnSync(
  'pnpm',
  ['exec', 'vitest', 'run', ...targets],
  {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  },
)

process.exit(result.status ?? 1)
