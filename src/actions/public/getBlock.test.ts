import { afterAll, assertType, beforeAll, describe, expect, test } from 'vitest'
import { devConflux } from '~test/src/conflux/client.js'
import { accounts, getTestAccount } from '../../../test/src/constants.js'
import type { Block } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { Hex } from '../../types/misc.js'
import { mine } from '../test/mine.js'
import { sendTransaction } from '../wallet/sendTransaction.js'
import { type GetBlockReturnType, getBlock } from './getBlock.js'

const client = devConflux.getClient()
beforeAll(async () => {
  await devConflux.start()
})

afterAll(async () => {
  await devConflux.stop()
})

test('legacy', async () => {
  const block = await getBlock(client)
  assertType<Block>(block)
  expect(block).toBeDefined()
  expect(
    Object.entries(block!)
      .filter(([_, value]) => {
        return value !== null && typeof value !== 'undefined'
      })
      .map(([key]) => key),
  ).toMatchInlineSnapshot(`
    [
      "adaptive",
      "blame",
      "blockNumber",
      "custom",
      "deferredLogsBloomHash",
      "deferredReceiptsRoot",
      "deferredStateRoot",
      "difficulty",
      "epochNumber",
      "gasLimit",
      "hash",
      "height",
      "miner",
      "nonce",
      "parentHash",
      "powQuality",
      "refereeHashes",
      "size",
      "timestamp",
      "transactions",
      "transactionsRoot",
    ]
  `)
})

test('1559', async () => {
  await mine(client, { blocks: 10 })
  const block = await getBlock(client)

  expect(
    Object.entries(block!)
      .filter(([_, value]) => {
        return value !== null && typeof value !== 'undefined'
      })
      .map(([key]) => key),
  ).toMatchInlineSnapshot(`
    [
      "adaptive",
      "baseFeePerGas",
      "blame",
      "blockNumber",
      "custom",
      "deferredLogsBloomHash",
      "deferredReceiptsRoot",
      "deferredStateRoot",
      "difficulty",
      "epochNumber",
      "gasLimit",
      "gasUsed",
      "hash",
      "height",
      "miner",
      "nonce",
      "parentHash",
      "posReference",
      "powQuality",
      "refereeHashes",
      "size",
      "timestamp",
      "transactions",
      "transactionsRoot",
    ]
  `)
})

test('epoch tag', async () => {
  await mine(client, { blocks: 100 })
  const blockWithEarliest = await getBlock(client, { epochTag: 'earliest' })
  assertType<GetBlockReturnType<Chain, false, 'earliest'>>(blockWithEarliest)

  assertType<null>(blockWithEarliest.gasUsed)
  expect(blockWithEarliest.gasUsed).toMatchInlineSnapshot('null')
  assertType<null>(blockWithEarliest.posReference)
  expect(blockWithEarliest.posReference).toMatchInlineSnapshot('null')
  assertType<null>(blockWithEarliest.baseFeePerGas)
  expect(blockWithEarliest.baseFeePerGas).toMatchInlineSnapshot('null')

  const blockWithCheckpoint = await getBlock(client, {
    epochTag: 'latest_checkpoint',
  })
  assertType<null>(blockWithCheckpoint.gasUsed)
  expect(blockWithCheckpoint.gasUsed).toMatchInlineSnapshot('null')
  assertType<null>(blockWithCheckpoint.posReference)
  expect(blockWithCheckpoint.posReference).toMatchInlineSnapshot('null')
  assertType<null>(blockWithCheckpoint.baseFeePerGas)
  expect(blockWithCheckpoint.baseFeePerGas).toMatchInlineSnapshot('null')

  const blockWithConfirmed = await getBlock(client, {
    epochTag: 'latest_confirmed',
  })

  assertType<bigint>(blockWithConfirmed.gasUsed)
  expect(blockWithConfirmed.gasUsed).toBeDefined()
  assertType<Hex>(blockWithConfirmed.posReference)
  expect(blockWithConfirmed.posReference).toBeDefined()
  assertType<bigint>(blockWithConfirmed.baseFeePerGas)
  expect(blockWithConfirmed.baseFeePerGas).toBeDefined()

  const blockWithLastState = await getBlock(client, {
    epochTag: 'latest_state',
  })

  assertType<bigint>(blockWithLastState.gasUsed)
  expect(blockWithLastState.gasUsed).toBeDefined()
  assertType<Hex>(blockWithLastState.posReference)
  expect(blockWithLastState.posReference).toBeDefined()
  assertType<bigint>(blockWithLastState.baseFeePerGas)
  expect(blockWithLastState.baseFeePerGas).toBeDefined()
})

test('epoch number', async () => {
  const block0 = await getBlock(client, { epochNumber: 10n })
  expect(block0).toBeDefined()
  expect(Object.keys(block0)).toMatchInlineSnapshot(`
    [
      "adaptive",
      "baseFeePerGas",
      "blame",
      "blockNumber",
      "custom",
      "deferredLogsBloomHash",
      "deferredReceiptsRoot",
      "deferredStateRoot",
      "difficulty",
      "epochNumber",
      "gasLimit",
      "gasUsed",
      "hash",
      "height",
      "miner",
      "nonce",
      "parentHash",
      "posReference",
      "powQuality",
      "refereeHashes",
      "size",
      "timestamp",
      "transactions",
      "transactionsRoot",
    ]
  `)
})

test('args: includeTransactions', async () => {
  const client = devConflux.getClient({ account: getTestAccount(accounts[0]) })
  await sendTransaction(client, {
    to: accounts[0].base32Address,
  })

  await mine(client, { numTxs: 1 })

  const block = await getBlock(client, {
    epochTag: 'latest_state',
    includeTransactions: true,
  })

  expect(block.transactions.length).toEqual(1)
  expect(Object.keys(block.transactions[0])).toMatchInlineSnapshot(`
    [
      "accessList",
      "blockHash",
      "chainId",
      "contractCreated",
      "data",
      "epochHeight",
      "from",
      "gas",
      "gasPrice",
      "hash",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "nonce",
      "r",
      "s",
      "status",
      "storageLimit",
      "to",
      "transactionIndex",
      "type",
      "v",
      "value",
      "yParity",
    ]
  `)
})

describe('args: hash', () => {
  test('gets block by block hash', async () => {
    const initialBlock = await getBlock(client)
    const block = await getBlock(client, {
      blockHash: initialBlock!.hash!,
    })
    expect(block).toEqual(initialBlock)
  })
})
