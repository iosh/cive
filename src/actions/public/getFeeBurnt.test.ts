import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { parseCFX } from '../../utils/unit/parseCFX.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { getFeeBurnt } from './getFeeBurnt.js'
const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  await mine(client, { blocks: 10 })
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getFeeBurnt(client)).toMatchInlineSnapshot('0n')

  await sendTransaction(client, {
    to: accounts[0].base32Address,
    value: parseCFX('1'),
  })
  await mine(client, { numTxs: 1 })
  expect(await getFeeBurnt(client)).toMatchInlineSnapshot('21000n')
})
