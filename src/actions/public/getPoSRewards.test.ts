import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { getPoSRewards } from './getPoSRewards.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getPoSRewards(client, { epochNumber: 0n })).toBeNull()
})