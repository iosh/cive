import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'

import { estimateMaxPriorityFeePerGas } from './estimateMaxPriorityFeePerGas.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await estimateMaxPriorityFeePerGas(client)).toBeDefined()
})
