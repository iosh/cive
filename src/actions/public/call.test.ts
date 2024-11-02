import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { parseUnits } from 'viem'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployMulticall3, deployTest20 } from '../../../test/src/utils.js'
import { encodeFunctionData } from '../../utils/abi/encodeFunctionData.js'
import { wait } from '../../utils/wait.js'
import { call } from './call.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({
  account: sourceAccount,
})
const name4bytes = '0x06fdde03'

beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { contractCreated } = await deployTest20(client)
  const { data } = await call(client, {
    data: name4bytes,
    account: sourceAccount.address,
    to: contractCreated,
  })
  expect(data).toMatchInlineSnapshot(
    `"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000"`,
  )
})

test('zero data', async () => {
  const { contractCreated } = await deployTest20(client)
  const { data: mintData } = await call(client, {
    data: encodeFunctionData({
      abi: Test20.abi,
      functionName: 'mint',
      args: [sourceAccount.address, parseUnits('1', 18)],
    }),
    to: contractCreated,
  })
  expect(mintData).toMatchInlineSnapshot('undefined')
})

describe('batch call', () => {
  test('default', async () => {
    const { contractCreated: Multicall3Address } =
      await deployMulticall3(client)
    const { contractCreated: Test20Address } = await deployTest20(client)

    const client_2 = devConflux.getClient({
      batch: { multicall: true },
    })
    client_2.chain = {
      ...client.chain,
      contracts: { multicall3: { address: Multicall3Address! } },
    }
    const spy = vi.spyOn(client_2, 'request')

    const p = []
    p.push(
      call(client_2, {
        data: name4bytes,
        to: Test20Address,
      }),
    )
    p.push(
      call(client_2, {
        data: name4bytes,
        to: Test20Address,
      }),
    )
    await wait(1)
    p.push(
      call(client_2, {
        data: name4bytes,
        to: Test20Address,
      }),
    )
    await wait(1)
    p.push(
      call(client_2, {
        data: name4bytes,
        to: Test20Address,
      }),
    )
    await wait(50)
    p.push(
      call(client_2, {
        data: name4bytes,
        to: Test20Address,
      }),
    )
    p.push(
      call(client_2, {
        data: name4bytes,
        to: Test20Address,
      }),
    )

    const results = await Promise.all(p)

    expect(spy).toBeCalledTimes(4)
    expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000",
        },
        {
          "data": "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000065465737432300000000000000000000000000000000000000000000000000000",
        },
      ]
    `)
  })
})
