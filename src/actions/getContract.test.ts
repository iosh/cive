import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { parseUnits } from 'viem'
import { accounts, getTestAccount } from '../../test/src/constants.js'
import { Test20 } from '../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../test/src/utils.js'
import type { Address } from '../accounts/types.js'
import { getContract } from './getContract.js'
import { mine } from './test/mine.js'
import { writeContract } from './wallet/writeContract.js'

const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })

let test20Address: Address
beforeAll(async () => {
  await devConflux.start()
  const { contractCreated } = await deployTest20(client)
  test20Address = contractCreated!
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', () => {
  const contract = getContract({
    abi: Test20.abi,
    address: test20Address,
    client: { public: client, wallet: client },
  })
  expect(contract.address).toBe(test20Address)
  expect(contract.abi).toBe(Test20.abi)
})

test('createEventFilter', async () => {
  const contract = getContract({
    abi: Test20.abi,
    address: test20Address,
    client: { public: client, wallet: client },
  })

  await expect(
    contract.createEventFilter.Transfer({ from: accounts[0].base32Address }),
  ).resolves.toBeDefined()
})

test('estimateGasAndCollateral', async () => {
  const contract = getContract({
    abi: Test20.abi,
    address: test20Address,
    client: { public: client, wallet: client },
  })

  await expect(
    contract.createEventFilter.Transfer({ from: accounts[0].base32Address }),
  ).resolves.toBeDefined()
})

test('read', async () => {
  const contract = getContract({
    abi: Test20.abi,
    address: test20Address,
    client: { public: client, wallet: client },
  })
  await expect(
    contract.read.balanceOf([accounts[0].base32Address]),
  ).resolves.toMatchInlineSnapshot('0n')
})

test('simulate', async () => {
  const contract = getContract({
    abi: Test20.abi.filter((x) => (x as { name: string }).name === 'mint'),
    address: test20Address,
    client: { public: client, wallet: client },
  })

  await expect(
    contract.simulate.mint([accounts[0].base32Address, 100n]),
  ).resolves.toBeDefined()
})

test('getEvents', async () => {
  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'mint',
    args: [accounts[0].base32Address, parseUnits('1000', 18)],
  })
  await mine(client, { numTxs: 1 })

  await writeContract(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'transfer',
    args: [accounts[0].base32Address, 1n],
  })
  await mine(client, { numTxs: 1 })

  const contract = getContract({
    abi: Test20.abi,
    address: test20Address,
    client: { public: client, wallet: client },
  })

  const logs = await contract.getEvents.Transfer()

  expect(logs.length).toMatchInlineSnapshot('2')
  expect(logs[0].eventName).toMatchInlineSnapshot(`"Transfer"`)
  expect(logs[0].args).toMatchInlineSnapshot(`
    {
      "from": "net201029:aajaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadput7khz",
      "to": "net201029:aam085e78n2f8hy6c02u5tz7vbj6xreef6a6stzj3x",
      "value": 1000000000000000000000n,
    }
  `)
})

test('write', async () => {
  const contract = getContract({
    abi: Test20.abi.filter((x) => (x as { name: string }).name === 'mint'),
    address: test20Address,
    client: { public: client, wallet: client },
  })

  await expect(
    contract.write.mint([accounts[0].base32Address, 100n]),
  ).resolves.toBeDefined()
})
