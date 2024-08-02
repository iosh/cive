import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts } from '~test/src/constants.js'

import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import type {
  TransactionRequestBase,
  TransactionRequestEIP1559,
  TransactionRequestEIP2930,
  TransactionRequestLegacy,
} from '../../types/transaction.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { signTransaction } from './signTransaction.js'
import { parseGDrip } from '../../utils/index.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

const sourceAccount = accounts[0]
const base = {
  from: accounts[0].base32Address,
  gas: 21000n,
  nonce: 785,
  epochHeight: 1n,
  storageLimit: 1000n,
} satisfies TransactionRequestBase

describe('1559', () => {
  const baseEip1559 = {
    ...base,
    type: 'eip1559',
  } as const satisfies TransactionRequestEIP1559

  test('default: local', async () => {
    const signature = await signTransaction(client, {
      account: privateKeyToAccount(sourceAccount.privateKey, {
        networkId: sourceAccount.netId,
      }),
      ...baseEip1559,
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x63667802f858d4820311808082520880808203e8018303114580c080a014f13ad9cebfc1f5427e575ca2a8f45c8908799142baf29c77020f45d42b230da05e5e7565519f4c1d39e46a9ea224b5b4fb1b47f663e24037b9f2f0d67dd82953"`,
    )
  })
})

describe('eip2930', () => {
  const baseEip2930 = {
    ...base,
    type: 'eip2930',
  } as const satisfies TransactionRequestEIP2930

  test('default: local', async () => {
    const signature = await signTransaction(client, {
      account: privateKeyToAccount(sourceAccount.privateKey, {
        networkId: sourceAccount.netId,
      }),
      ...baseEip2930,
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x63667801f857d38203118082520880808203e8018303114580c001a043b3d25f239de18719d54a237097609ef3e641cc9505fccfd30b46bf8851e6efa0249eee8e8cb30fadde57a19e2a07f89d53c18e260c68a371fa977de387aa2e3f"`,
    )
  })
})

describe('legacy', () => {
  const baseLegacy = {
    ...base,
    gasPrice: parseGDrip('2'),
    type: 'legacy',
  } as const satisfies TransactionRequestLegacy

  test('default', async () => {
    expect(
      await signTransaction(client, {
        account: privateKeyToAccount(sourceAccount.privateKey, {
          networkId: sourceAccount.netId,
        }),
        ...baseLegacy,
      }),
    ).toMatchInlineSnapshot(
      `"0xf85ad6820311847735940082520880808203e801830311458001a0d0f203a0885ae811973e3447399bfc7babf3bc40d0b37a3688b33ecd2d809c7fa0197b340f27c0614a23d13ba9120c75cd36fc4e713c91da05c35b365182ca9a23"`,
    )
  })
})
