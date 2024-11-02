import { parseUnits } from 'viem'
import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import { encodeFunctionData } from '../../utils/abi/encodeFunctionData.js'
import { call } from '../public/call.js'
import { mine } from '../test/mine.js'
import { writeContract } from './writeContract.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { contractCreated: Test20Address } = await deployTest20(client)
  expect(
    await writeContract(client, {
      address: Test20Address!,
      abi: Test20.abi,
      functionName: 'mint',
      args: [sourceAccount.address, parseUnits('10', 18)],
    }),
  ).toBeDefined()

  await mine(client)

  expect(
    await call(client, {
      to: Test20Address!,
      data: encodeFunctionData({
        abi: Test20.abi,
        functionName: 'balanceOf',
        args: [sourceAccount.address],
      }),
    }),
  ).toMatchInlineSnapshot(`
    {
      "data": "0x0000000000000000000000000000000000000000000000008ac7230489e80000",
    }
  `)
})
