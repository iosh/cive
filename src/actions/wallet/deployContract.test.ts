import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'

import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'

import { parseAbi } from 'viem'
import { deployContract } from './deployContract.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })
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
    await deployContract(client, {
      abi: parseAbi(['constructor(address to, uint256 tokenId)']),
      bytecode: '0x',
      args: [accounts[0].hexAddress, 123n],
    }),
  ).toBeDefined()
})

test('defined inline', async () => {
  expect(
    await deployContract(client, {
      abi: [
        {
          type: 'constructor',
          stateMutability: 'nonpayable',
          inputs: [
            {
              type: 'address',
              name: 'to',
            },
            {
              type: 'uint256',
              name: 'tokenId',
            },
          ],
        },
      ],
      bytecode: '0x',
      args: [accounts[0].hexAddress, 123n],
    }),
  ).toBeDefined()
})
