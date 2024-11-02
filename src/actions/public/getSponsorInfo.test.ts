import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { SponsorWhitelistControl } from '~test/src/contracts/SponsorWhitelistControl.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { deployTest20 } from '../../../test/src/utils.js'
import { SponsorWhitelistControlHexAddress } from '../../constants/contract.js'
import type { Address } from '../../types/abitype.js'
import { hexAddressToBase32 } from '../../utils/address/hexAddressToBase32.js'
import { parseCFX } from '../../utils/unit/parseCFX.js'
import { mine } from '../test/mine.js'
import { writeContract } from '../wallet/writeContract.js'
import { GetSponsorInfo } from './getSponsorInfo.js'

let test20Address: Address
const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
beforeAll(async () => {
  await devConflux.start()
  const { contractCreated } = await deployTest20(client)
  test20Address = contractCreated!
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await GetSponsorInfo(client, { address: test20Address }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 0n,
      "sponsorBalanceForCollateral": 0n,
      "sponsorBalanceForGas": 0n,
      "sponsorForCollateral": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorForGas": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorGasBound": 0n,
      "usedStoragePoints": 0n,
    }
  `)
  const SponsorWhitelistControlAddress = hexAddressToBase32({
    hexAddress: SponsorWhitelistControlHexAddress,
    networkId: accounts[0].netId,
  })

  await writeContract(client, {
    address: SponsorWhitelistControlAddress,
    abi: SponsorWhitelistControl.abi,
    functionName: 'setSponsorForGas',
    args: [test20Address, parseCFX('0.01')],
    value: parseCFX('100'),
  })

  await writeContract(client, {
    address: SponsorWhitelistControlAddress,
    abi: SponsorWhitelistControl.abi,
    functionName: 'setSponsorForCollateral',
    args: [test20Address],
    value: parseCFX('15'),
  })

  await mine(client, { numTxs: 5 })

  expect(
    await GetSponsorInfo(client, { address: test20Address }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 7680n,
      "sponsorBalanceForCollateral": 7500000000000000000n,
      "sponsorBalanceForGas": 100000000000000000000n,
      "sponsorForCollateral": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorForGas": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorGasBound": 10000000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
})

test('epochTag', async () => {
  expect(
    await GetSponsorInfo(client, {
      address: test20Address,
      epochTag: 'earliest',
    }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 0n,
      "sponsorBalanceForCollateral": 0n,
      "sponsorBalanceForGas": 0n,
      "sponsorForCollateral": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorForGas": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorGasBound": 0n,
      "usedStoragePoints": 0n,
    }
  `)
  expect(
    await GetSponsorInfo(client, {
      address: test20Address,
      epochTag: 'latest_checkpoint',
    }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 0n,
      "sponsorBalanceForCollateral": 0n,
      "sponsorBalanceForGas": 0n,
      "sponsorForCollateral": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorForGas": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorGasBound": 0n,
      "usedStoragePoints": 0n,
    }
  `)
  expect(
    await GetSponsorInfo(client, {
      address: test20Address,
      epochTag: 'latest_confirmed',
    }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 0n,
      "sponsorBalanceForCollateral": 0n,
      "sponsorBalanceForGas": 0n,
      "sponsorForCollateral": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorForGas": "NET201029:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWNF1HCG",
      "sponsorGasBound": 0n,
      "usedStoragePoints": 0n,
    }
  `)
  expect(
    await GetSponsorInfo(client, {
      address: test20Address,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 7680n,
      "sponsorBalanceForCollateral": 7500000000000000000n,
      "sponsorBalanceForGas": 100000000000000000000n,
      "sponsorForCollateral": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorForGas": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorGasBound": 10000000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
})

test('epochNumber', async () => {
  await mine(client, { blocks: 20 })
  expect(
    await GetSponsorInfo(client, {
      address: test20Address,
      epochNumber: 10n,
    }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 7680n,
      "sponsorBalanceForCollateral": 7500000000000000000n,
      "sponsorBalanceForGas": 100000000000000000000n,
      "sponsorForCollateral": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorForGas": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorGasBound": 10000000000000000n,
      "usedStoragePoints": 0n,
    }
  `)

  expect(
    await GetSponsorInfo(client, {
      address: test20Address,
      epochNumber: 15n,
    }),
  ).toMatchInlineSnapshot(`
    {
      "availableStoragePoints": 7680n,
      "sponsorBalanceForCollateral": 7500000000000000000n,
      "sponsorBalanceForGas": 100000000000000000000n,
      "sponsorForCollateral": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorForGas": "NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X",
      "sponsorGasBound": 10000000000000000n,
      "usedStoragePoints": 0n,
    }
  `)
})
