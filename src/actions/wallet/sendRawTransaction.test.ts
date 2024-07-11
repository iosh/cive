import { afterAll, beforeAll, expect, test, vi } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '~test/src/constants.js'

import { generateEmptyLocalNodeBlocks } from '../localNode/generateEmptyLocalNodeBlocks.js'
import { sayHelloLocalNode } from '../localNode/sayHelloLocalNode.js'
import { prepareTransactionRequest } from './prepareTransactionRequest.js'
import { signTransaction } from '../../accounts/index.js'
import { sendRawTransaction } from './sendRawTransaction.js'

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
  const request = await prepareTransactionRequest(client, {
    account: sourceAccount,
    to: sourceAccount.address,
    value: 1n,
  })
  const serializedTransaction = await signTransaction(client, request)
  const hash = await sendRawTransaction(client, { serializedTransaction })
  expect(hash).toBeDefined()
})
