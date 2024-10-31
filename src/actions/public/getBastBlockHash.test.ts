import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'

import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { getBastBlockHash } from './getBastBlockHash.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
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
