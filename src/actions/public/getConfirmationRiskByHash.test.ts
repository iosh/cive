import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { generateLocalNodeBlock } from '../localNode/generateLocalNodeBlock.js'
import { getConfirmationRiskByHash } from './getConfirmationRiskByHash.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

const randomHash = `0x${'a'.repeat(64)}` as const

test('default', async () => {
  const hash = await generateLocalNodeBlock(client, {
    numTxs: 10,
    blockSizeLimit: 1024,
  })
  expect(
    await getConfirmationRiskByHash(client, { blockHash: hash }),
  ).toBeTypeOf('bigint')

  expect(
    await getConfirmationRiskByHash(client, { blockHash: randomHash }),
  ).toBe(undefined)
})
