import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import type { Address } from '../../accounts/types.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { simulateContract } from './simulateContract.js'

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
    (
      await simulateContract(client, {
        abi: Test20.abi,
        functionName: 'mint',
        address: Test20Address,
        args: [sourceAccount.address, 100n],
      })
    ).result,
  ).toEqual(undefined)
})
test('overloaded function', async () => {
  expect(
    (
      await simulateContract(client, {
        abi: Test20.abi,
        address: Test20Address,
        account: accounts[1].base32Address,
        functionName: 'mint',
        args: [sourceAccount.address, 100n],
      })
    ).result,
  ).toEqual(undefined)
})
