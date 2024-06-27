import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '~unit': join(__dirname, '../src'),
      '~test': join(__dirname, '.'),
    },
    setupFiles: [join(__dirname, './setup.ts')],
    testTimeout: 50000,
    hookTimeout: 50000,
  },
})
