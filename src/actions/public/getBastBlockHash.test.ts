import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getBastBlockHash } from './getBastBlockHash.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getBastBlockHash(client)).toBeDefined()
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 1 })
  expect(await getBastBlockHash(client)).toBeDefined()
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 1 })
})
