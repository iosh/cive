import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { toBytes } from 'viem'
import { accounts, getTestAccount } from '../../../test/src/constants.js'

import { mnemonicToAccount } from '../../accounts/mnemonicToAccount.js'
import { hashMessage } from '../../utils/index.js'
import { parseSignature } from '../../utils/signature/parseSignature.js'

import { signMessage } from '../wallet/signMessage.js'
import { verifyHash } from './verifyHash.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({
  account: sourceAccount,
})

beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  vi.restoreAllMocks()
  await devConflux.stop()
})

describe('local account', async () => {
  test('hex', async () => {
    const signature = await signMessage(client, {
      account: sourceAccount,
      message: 'hello world',
    })
    expect(
      await verifyHash(client, {
        address: sourceAccount.address,
        hash: hashMessage('hello world'),
        signature,
      }),
    ).toBe(true)
    expect(
      await verifyHash(client, {
        address: sourceAccount.address,
        hash: hashMessage('hello world1'),
        signature,
      }),
    ).toBe(false)
  })

  test('bytes', async () => {
    const signature = await signMessage(client, {
      account: sourceAccount,
      message: 'hello world',
    })

    expect(
      await verifyHash(client, {
        address: sourceAccount.address,
        hash: hashMessage('hello world'),
        signature: toBytes(signature),
      }),
    ).toBe(true)
  })

  test('object', async () => {
    const signature = await signMessage(client, {
      account: sourceAccount,
      message: 'hello world',
    })

    await expect(
      verifyHash(client, {
        address: sourceAccount.address,
        hash: hashMessage('hello world'),
        signature: parseSignature(signature),
      }),
    ).resolves.toBe(true)
  })

  test('ecdsa recovery', async () => {
    const account = mnemonicToAccount(
      'advance income refuse grain method capable upset coast minor situate such library',
      { networkId: accounts[0].netId },
    )
    const signature = await signMessage(client, {
      account,
      message: 'hello world',
    })
    vi.spyOn(client, 'request').mockRejectedValueOnce(
      new Error('RPC request failed'),
    )

    await expect(
      verifyHash(client, {
        address: account.address,
        hash: hashMessage('hello world'),
        signature,
      }),
    ).resolves.toBe(true)
  })
})
