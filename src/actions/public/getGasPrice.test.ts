import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'

import { getGasPrice } from './getGasPrice.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getGasPrice(client)).toBeGreaterThan(0n)
})
