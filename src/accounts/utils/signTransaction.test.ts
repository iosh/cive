import {
  afterAll,
  assertType,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest'
import { parseGDrip } from '../../unit/parseGDrip.js'
import type {
  TransactionSerializable,
  TransactionSerializableBase,
  TransactionSerializedLegacy,
} from '../../types/transaction.js'
import { signTransaction } from './signTransaction.js'
import { accounts } from '~test/src/conflux/accounts.js'
import { Transaction, format } from 'js-conflux-sdk'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../../actions/localNode/sayHelloLocalNode.js'

// const client = devConflux.getClient()
// beforeAll(async () => {
//   await devConflux.start()
//   await sayHelloLocalNode(client)
// })

// afterAll(async () => {
//   await devConflux.stop()
// })

const base = {
  gas: 21000n,
  nonce: 785,
  storageLimit: 100n,
  epochHeight: 0,
} satisfies TransactionSerializableBase

describe('legacy', () => {
  const baseLegacy = {
    ...base,
    gasPrice: parseGDrip('2'),
    type: 'legacy',
    chainId: accounts[0].netId,
  } as const satisfies TransactionSerializable

  test('default', async () => {
    const signature = await signTransaction({
      transaction: baseLegacy,
      privateKey: accounts[0].privateKey,
    })
    assertType<TransactionSerializedLegacy>(signature)

    const tx = new Transaction({
      ...baseLegacy,
      type: 0,
      gasPrice: baseLegacy.gasPrice.toString(),
      gas: baseLegacy.gas.toString(),
      storageLimit: baseLegacy.storageLimit.toString(),
    })
    tx.sign(accounts[0].privateKey, 1)
    expect(signature).toBe(format.hex(tx.encode(true)))
  })
})
