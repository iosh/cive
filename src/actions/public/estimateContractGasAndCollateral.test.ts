import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'

import { estimateContractGasAndCollateral } from './estimateContractGasAndCollateral.js'

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

test('default', async () => {
  const approveResult = await estimateContractGasAndCollateral(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'approve',
    args: [accounts[1].base32Address, 1n],
  })

  expect(approveResult.gasLimit).toBeGreaterThan(0n)

  expect(approveResult.gasUsed).toBeGreaterThan(0n)

  expect(approveResult.storageCollateralized).toBeGreaterThan(0n)

  const mintResult = await estimateContractGasAndCollateral(client, {
    abi: Test20.abi,
    address: test20Address,
    functionName: 'mint',
    args: [accounts[1].base32Address, 1n],
  })

  expect(mintResult.gasLimit).toBeGreaterThan(0n)

  expect(mintResult.gasUsed).toBeGreaterThan(0n)

  expect(mintResult.storageCollateralized).toBeGreaterThan(0n)
})
