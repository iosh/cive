import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { getSupplyInfo } from './getSupplyInfo.js'

const client = devConflux.getClient({
  account: getTestAccount(accounts[0]),
})
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  expect(await getSupplyInfo(client)).toMatchInlineSnapshot(`
    {
      "totalCirculating": 100050000000000000000000n,
      "totalCollateral": 50062500000000000000n,
      "totalEspaceTokens": 0n,
      "totalIssued": 5000100000000000000000000000n,
      "totalStaking": 2000000000000000000000000n,
    }
  `)
})
