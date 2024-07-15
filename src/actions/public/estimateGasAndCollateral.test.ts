import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'

import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import { parseCFX } from '../../unit/parseCFX.js'
import { parseGDrip } from '../../unit/parseGDrip.js'
import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { estimateGasAndCollateral } from './estimateGasAndCollateral.js'

const sourceAccount = getTestAccount(accounts[0])
const targetAccount = getTestAccount(accounts[1])
const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  await generateEmptyLocalNodeBlocks(client, { numBlocks: 10 })
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

test('args: maxFeePerGas', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      account: targetAccount.address,
      to: sourceAccount.address,
      maxFeePerGas: parseGDrip('33'),
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

test('args: gas', async () => {
  expect(
    await estimateGasAndCollateral(client, {
      account: targetAccount.address,
      to: sourceAccount.address,
      gas: parseGDrip('2'),
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

describe('local account', () => {
  test('default', async () => {
    expect(
      await estimateGasAndCollateral(client, {
        account: privateKeyToAccount(accounts[0].privateKey, {
          networkId: accounts[0].netId,
        }),
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
        account: privateKeyToAccount(accounts[0].privateKey, {
          networkId: accounts[0].netId,
        }),
      }),
    ).toMatchInlineSnapshot(`
      {
        "gasLimit": 53512n,
        "gasUsed": 53512n,
        "storageCollateralized": 0n,
      }
    `)
  })

  test('args: gasPrice (on chain w/ block.baseFeePerGas)', async () => {
    expect(
      await estimateGasAndCollateral(client, {
        account: privateKeyToAccount(accounts[0].privateKey, {
          networkId: accounts[0].netId,
        }),
        to: accounts[1].base32Address,
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

  test('args: maxFeePerGas (on eip1559)', async () => {
    expect(
      await estimateGasAndCollateral(client, {
        account: privateKeyToAccount(accounts[0].privateKey, {
          networkId: accounts[0].netId,
        }),
        to: accounts[1].base32Address,
        maxFeePerGas: parseGDrip('33'),
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

  test('args: gas', async () => {
    expect(
      await estimateGasAndCollateral(client, {
        account: privateKeyToAccount(accounts[0].privateKey, {
          networkId: accounts[0].netId,
        }),
        to: accounts[1].base32Address,
        gas: parseGDrip('2'),
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
})
