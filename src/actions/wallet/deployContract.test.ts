import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'

import { generateEmptyLocalNodeBlocks } from '../test/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../test/sayHelloLocalNode.js'

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
      args: [accounts[0].base32Address, 123n],
    }),
  ).toMatchInlineSnapshot(
    `"0x63da4c5b57f2f5d2732b6d98bf0b066c1d097a3cd5b310871750fce4d6ea4dcc"`,
  )
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
      args: [accounts[0].base32Address, 123n],
    }),
  ).toMatchInlineSnapshot(
    `"0xce3bacd17d867c58f34b2a671d690fd1b4872616a6fb65e9a08936d22d7bacbb"`,
  )
})
