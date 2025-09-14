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
  storageLimit: 100n,
  epochHeight: 100n,
  gas: 21000n,
} satisfies TransactionSerializableBase

describe('1559', () => {
  const baseEip1559 = {
    ...base,
    chainId: 1,
    maxFeePerGas: parseGwei('2'),
    maxPriorityFeePerGas: parseGwei('2'),
  }

  test('default', () => {
    const serialized = serializeTransaction(baseEip1559)
    expect(serialized).toMatchInlineSnapshot(
      `"0x63667802eb8203118477359400847735940082520894139fd6e51aad88f6f4ce6ab8827279cfffb922668064640180c0"`,
    )
  })

  test('signed 1559', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseEip1559)),
      privateKey:
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    })
    const serialized = serializeTransaction(baseEip1559, signature)

    expect(serialized).toMatchInlineSnapshot(
      `"0x63667802f86feb8203118477359400847735940082520894139fd6e51aad88f6f4ce6ab8827279cfffb922668064640180c001a0f934d62f67dbcb9ef6d821f1a6a68aafa593d255f663c85d8869bfa9563fe393a0284b6e12cef77f5e1e9e2c2840aa8ccfba67c9d0882c9064d71bc45209cfbe3f"`,
    )
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
    expect(serialized).toMatchInlineSnapshot(
      `"0x63667801f85f820311847735940082520894139fd6e51aad88f6f4ce6ab8827279cfffb922668064640180f838f794139fd6e51aad88f6f4ce6ab8827279cfffb92266e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    )
  })

  test('signed', async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseEip2930)),
      privateKey:
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    })
    const serialized = serializeTransaction(baseEip2930, signature)

    expect(serialized).toMatchInlineSnapshot(
      `"0x63667801f8a4f85f820311847735940082520894139fd6e51aad88f6f4ce6ab8827279cfffb922668064640180f838f794139fd6e51aad88f6f4ce6ab8827279cfffb92266e1a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe01a0b31185b3b7bc8ad0ae24fd65fb9bbd409f181880f32dc571567b87c1691a0ecda068efc71e831f68deed8c497497030befd20cecc1582ebf54cca4bd87ec24dc74"`,
    )
  })
})
