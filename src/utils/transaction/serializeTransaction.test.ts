import { Transaction, format } from 'js-conflux-sdk'
import { keccak256, parseEther, parseGwei } from 'viem'
import { describe, expect, test } from 'vitest'
import { sign } from '../../accounts/utils/sign.js'
import type {
  TransactionSerializableBase,
  TransactionSerializableEIP2930,
} from '../../types/transaction.js'
import { serializeTransaction } from './serializeTransaction.js'

const base = {
  to: 'cfxtest:aak39z1fdm02v71y33znvaxwthh99skcp2s48zasbp',
  nonce: 785,
  value: parseEther('0'),
  storageLimit: 100,
  epochHeight: 100,
  gas: 21000,
} satisfies TransactionSerializableBase

describe('1559', () => {
  const baseEip1559 = {
    ...base,
    chainId: 1,
    maxFeePerGas: parseGwei('2'),
    maxPriorityFeePerGas: parseGwei('2'),
  }

  test('default', () => {
    const tx = new Transaction({
      ...baseEip1559,
      value: baseEip1559.value.toString(),
      maxFeePerGas: baseEip1559.maxFeePerGas.toString(),
      maxPriorityFeePerGas: baseEip1559.maxPriorityFeePerGas.toString(),
      type: 2,
    })
    const encodeData = tx.encode(false)
    const serialized = serializeTransaction(baseEip1559)
    expect(serialized).toEqual(`${format.hex(encodeData)}`)
  })

  test('signed 1559', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseEip1559)),
      privateKey:
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    })
    const serialized = serializeTransaction(baseEip1559, signature)
    const tx = new Transaction({
      ...baseEip1559,
      value: baseEip1559.value.toString(),
      maxFeePerGas: baseEip1559.maxFeePerGas.toString(),
      maxPriorityFeePerGas: baseEip1559.maxPriorityFeePerGas.toString(),
      type: 2,
    })
    tx.sign(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      2,
    )
    const encodeData = tx.encode(true)

    expect(serialized).toEqual(`${format.hex(encodeData)}`)
  })
})

describe('2930', () => {
  const baseEip2930 = {
    ...base,
    chainId: 1,
    accessList: [
      {
        address: 'cfxtest:aak39z1fdm02v71y33znvaxwthh99skcp2s48zasbp',
        storageKeys: [
          '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
        ],
      },
    ],
    gasPrice: parseGwei('2'),
  } satisfies TransactionSerializableEIP2930

  test('default', () => {
    const serialized = serializeTransaction(baseEip2930)
    const tx = new Transaction({
      ...baseEip2930,
      value: baseEip2930.value.toString(),
      gasPrice: baseEip2930.gasPrice.toString(),
      type: 1,
      accessList: [...baseEip2930.accessList],
    })

    const encodeData = tx.encode(false)
    expect(serialized).toEqual(`${format.hex(encodeData)}`)
  })

  test('signed', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseEip2930)),
      privateKey:
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    })
    const serialized = serializeTransaction(baseEip2930, signature)

    const tx = new Transaction({
      ...baseEip2930,
      value: baseEip2930.value.toString(),
      gasPrice: baseEip2930.gasPrice.toString(),
      type: 1,
      accessList: [...baseEip2930.accessList],
    })
    tx.sign(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      2,
    )

    const encodeData = tx.encode(true)
    expect(serialized).toEqual(`${format.hex(encodeData)}`)
  })
})
