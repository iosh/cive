import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '~cive': join(import.meta.dirname, '../src'),
      '~test': import.meta.dirname,
    },
    setupFiles: [join(import.meta.dirname, 'setup.ts')],
    testTimeout: 50000,
    hookTimeout: 50000,
  },
})
