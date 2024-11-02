import { afterAll, beforeAll, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'

import { accounts, getTestAccount } from '../../../test/src/constants.js'

import { deployTest20 } from '../../../test/src/utils.js'
import { mine } from '../test/mine.js'
import { getAdmin } from './getAdmin.js'
import { getBlock } from './getBlock.js'

const sourceAccount = getTestAccount(accounts[0])
const client = devConflux.getClient({ account: sourceAccount })

beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('default', async () => {
  const { contractCreated } = await deployTest20(client)

  expect(
    await getAdmin(client, { address: contractCreated! }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )
})

test('args epoch tag', async () => {
  const { contractCreated } = await deployTest20(client)
  await mine(client, { blocks: 100 })
  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochTag: 'earliest',
    }),
  ).toMatchInlineSnapshot('null')
  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochTag: 'latest_checkpoint',
    }),
  ).toMatchInlineSnapshot('null')

  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochTag: 'latest_confirmed',
    }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochTag: 'latest_state',
    }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )
})

test('args epoch number', async () => {
  const { contractCreated } = await deployTest20(client)
  const block = await getBlock(client)
  await mine(client, { blocks: 100 })
  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochNumber: block.blockNumber - 5n,
    }),
  ).toMatchInlineSnapshot('null')

  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochNumber: block.blockNumber + 10n,
    }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochNumber: block.blockNumber + 20n,
    }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochNumber: block.blockNumber + 50n,
    }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )

  expect(
    await getAdmin(client, {
      address: contractCreated!,
      epochNumber: block.blockNumber + 100n,
    }),
  ).toMatchInlineSnapshot(
    `"NET201029:TYPE.USER:AAM085E78N2F8HY6C02U5TZ7VBJ6XREEF6A6STZJ3X"`,
  )
})
