import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'
import { readContract } from './readContract.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })
let Test20Address: Address
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
  const { contractCreated } = await deployTest20(client)
  Test20Address = contractCreated!
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(
    await readContract(client, {
      abi: Test20.abi,
      functionName: 'decimals',
      address: Test20Address,
    }),
  ).toMatchInlineSnapshot('18')

  expect(
    await readContract(client, {
      abi: Test20.abi,
      functionName: 'name',
      address: Test20Address,
    }),
  ).toMatchInlineSnapshot(`"Test20"`)

  expect(
    await readContract(client, {
      abi: Test20.abi,
      functionName: 'totalSupply',
      address: Test20Address,
    }),
  ).toMatchInlineSnapshot('0n')

  expect(
    await readContract(client, {
      abi: Test20.abi,
      functionName: 'symbol',
      address: Test20Address,
    }),
  ).toMatchInlineSnapshot(`"TEST"`)
})
