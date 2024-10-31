import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { getPoSTransactionByNumber } from './getPoSTransactionByNumber.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await getPoSTransactionByNumber(client, { transactionNumber: 0n }),
  ).toBeDefined()
})
