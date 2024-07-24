import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { deployTest20 } from '../../../test/src/utils.js'
import { parseCFX } from '../../utils/unit/parseCFX.js'
import { mine } from '../localNode/mine.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { writeContract } from '../wallet/writeContract.js'
import { GetStorageAt } from './getStorageAt.js'

const client = devConflux.getClient({
  account: getTestAccount(accounts[0]),
})
beforeAll(async () => {
  await devConflux.start()
  await sayHelloLocalNode(client)
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { contractCreated } = await deployTest20(client)

  await writeContract(client, {
    address: contractCreated!,
    abi: Test20.abi,
    functionName: 'mint',
    args: [accounts[0].base32Address, parseCFX('10')],
  })
  await mine(client, { numTxs: 1 })
  expect(
    await GetStorageAt(client, { address: contractCreated!, slot: '0x2' }),
  ).toMatchInlineSnapshot(
    `"0x0000000000000000000000000000000000000000000000008ac7230489e80000"`,
  )
})
