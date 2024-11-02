import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { BlockNotFoundError } from '../../errors/block.js'
import { generateLocalNodeBlock } from '../test/generateLocalNodeBlock.js'
import { traceBlock } from './traceBlock.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
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
