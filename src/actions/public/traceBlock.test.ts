import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { traceBlock } from './traceBlock.js'
import { generateLocalNodeBlock } from '../localNode/generateLocalNodeBlock.js'
import { BlockNotFoundError } from '../../errors/block.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const blockHash = await generateLocalNodeBlock(client, {
    numTxs: 1,
    blockSizeLimit: 1,
  })
  expect(
    async () => await traceBlock(client, { blockHash }),
  ).rejects.toThrowError(BlockNotFoundError)
})
