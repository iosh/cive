import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'

import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { estimateGasAndCollateral } from './estimateGasAndCollateral.js'
import { parseCFX } from '../../unit/parseCFX.js'
import { parseGDrip } from '../../unit/parseGDrip.js'

const sourceAccount = getTestAccount(accounts[0])
const targetAccount = getTestAccount(accounts[1])
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
    await estimateGasAndCollateral(client, {
      to: targetAccount.address,
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(`
    {
      "gasLimit": 21000n,
      "gasUsed": 21000n,
      "storageCollateralized": 0n,
    }
  `)
})

test('falls back to wallet client account', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      account: targetAccount.address,
      to: sourceAccount.address,
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(`
    {
      "gasLimit": 21000n,
      "gasUsed": 21000n,
      "storageCollateralized": 0n,
    }
  `)
})

test('args: account', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      account: targetAccount.address,
      to: sourceAccount.address,
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(`
    {
      "gasLimit": 21000n,
      "gasUsed": 21000n,
      "storageCollateralized": 0n,
    }
  `)
})

test('args: data', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      data: '0x00000000000000000000000000000000000000000000000004fefa17b7240000',
      account: targetAccount.address,
      to: sourceAccount.address,
    }),
  ).toMatchInlineSnapshot(`
    {
      "gasLimit": 21512n,
      "gasUsed": 21512n,
      "storageCollateralized": 0n,
    }
  `)
})

test('args: gasPrice', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      account: targetAccount.address,
      to: sourceAccount.address,
      gasPrice: parseGDrip('33'),
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(`
      {
        "gasLimit": 21000n,
        "gasUsed": 21000n,
        "storageCollateralized": 0n,
      }
    `)
})

test('args: nonce', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      account: targetAccount.address,
      to: sourceAccount.address,
      nonce: 100,
      value: parseCFX('1'),
    }),
  ).toMatchInlineSnapshot(`
    {
      "gasLimit": 21000n,
      "gasUsed": 21000n,
      "storageCollateralized": 0n,
    }
  `)
})
