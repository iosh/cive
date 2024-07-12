import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getPoSBlock } from './getPoSBlock.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getPoSBlock(client)).toBeDefined()

  expect(await getPoSBlock(client, { blockNumber: 1n })).toBeDefined()

  expect(
    async () =>
      await getPoSBlock(client, {
        blockHash:
          '0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
      }),
  ).rejects.toThrowError('could not be found')
})
