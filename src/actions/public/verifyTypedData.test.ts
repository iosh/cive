import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount, typedData } from '~test/src/constants.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { verifyTypedData } from './verifyTypedData.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({
  account: sourceAccount,
})

beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

describe('verifyTypedData', () => {
  test('default', async () => {
    expect(
      await verifyTypedData(client, {
        ...typedData.basic,
        primaryType: 'Mail',
        address: sourceAccount.address,
        signature:
          '0xeb376dca45860063b24144736ec5bd39120d38e280712acb958acdcce3c93c305b0942d29e23474c70132baaff12a47d39c6bceab1255232136d51a9d9f1bd2b01',
      }),
    ).toBe(true)
    expect(
      await verifyTypedData(client, {
        ...typedData.complex,
        primaryType: 'Mail',
        address: sourceAccount.address,
        signature:
          '0x82f7e3bf7fe76e03c521e02befaeef5c47b08f59e7744df97b10c6e0ca85bdbf683cad7362bf1278f53208021b49be5829db95d04ed5369e8f51d6ae87a5a26600',
      }),
    ).toBe(true)
  })
})
