import { Transaction, format } from 'js-conflux-sdk'
import { concatHex, toHex, toRlp } from 'viem'
import {
  afterAll,
  assertType,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest'
import { accounts } from '~test/src/constants.js'
import { devConflux } from '~test/src/conflux/client.js'
import { sayHelloLocalNode } from '../../actions/localNode/sayHelloLocalNode.js'
import type {
  TransactionSerializable,
  TransactionSerializableBase,
  TransactionSerializableEIP1559,
  TransactionSerializableEIP2930,
  TransactionSerializableGeneric,
  TransactionSerializableLegacy,
  TransactionSerializedLegacy,
} from '../../types/transaction.js'
import { parseGDrip } from '../../unit/parseGDrip.js'
import { base32AddressToHex } from '../../utils/address/base32AddressToHex.js'
import type { SerializeTransactionFn } from '../../utils/transaction/serializeTransaction.js'
import { signTransaction } from './signTransaction.js'

// const client = devConflux.getClient()
// beforeAll(async () => {
//   await devConflux.start()
//   await sayHelloLocalNode(client)
// })

// afterAll(async () => {
//   await devConflux.stop()
// })

const base = {
  gas: 21000n,
  nonce: 785,
  storageLimit: 100n,
  epochHeight: 0,
} satisfies TransactionSerializableBase

describe('cip 1559', () => {
  const baseEip1559 = {
    ...base,
    chainId: 1,
    type: 'eip1559',
    maxPriorityFeePerGas: parseGDrip('2'),
    maxFeePerGas: parseGDrip('3'),
  } as const satisfies TransactionSerializable

  test('default', async () => {
    const signature = await signTransaction({
      transaction: baseEip1559,
      privateKey: accounts[0].privateKey,
    })

    const tx = new Transaction({
      ...baseEip1559,
      type: 2,
      gas: baseEip1559.gas.toString(),
      storageLimit: baseEip1559.storageLimit.toString(),
      maxPriorityFeePerGas: baseEip1559.maxPriorityFeePerGas.toString(),
      maxFeePerGas: baseEip1559.maxFeePerGas.toString(),
    })
    tx.sign(accounts[0].privateKey, 1)
    expect(signature).toEqual(format.hex(tx.encode(true)))
    expect(signature).toMatchInlineSnapshot(
      `"0x63667802f85bd7820311847735940084b2d05e00825208808064800180c001a07de9699bc1adaa5b1be90fd01dcada7f9f7326426e2cf0ce830456f31a3d3df6a014ecec5e16a4a16727215ab6854262f353e4542517cbf391e0971be4ba7157a9"`,
    )
  })

  test('minimal (w/ maxFeePerGas)', async () => {
    const args = {
      chainId: 1,
      maxFeePerGas: 1n,
    }
    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667802f84fcb80800180808080800180c080a00d0688b6c8761e84b9028dec0246feeccbf07f66b5469090f56f0b8a901db6eea01145da6df02f7e2e58242e475e5bcf07b2ef5dc34877e313f2b9df635a918d02"`,
    )
  })

  test('minimal (w/ type)', async () => {
    const args = {
      chainId: 1,
      type: 'eip1559',
    } as const
    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667802f84fcb80808080808080800180c001a0094236243630f31a19c4b65e1576ef82da135f86f27f31ba7900782d07c4131da0356549806c28758bc4cb42ec099306f78af876fa055933f5d086e2d740f2f7b8"`,
    )
  })

  test('args: accessList', async () => {
    const args = {
      ...baseEip1559,
      accessList: [
        {
          address: accounts[0].base32Address,
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ],
        },
      ],
    } satisfies TransactionSerializableEIP1559

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667802f8b8f873820311847735940084b2d05e00825208808064800180f85bf85994156f6c9df2f05f1e9c15b10dbebd8851c9b4842ff842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe80a0edf0999e8e0d57acc09f4de73904c25cf655534790324e1fac385c6ffd33f0aba02d41571a92cd6ce3791e38b97d7f3fac383c124935a58e39e74d5b0abca7ea37"`,
    )
  })

  test('args: data', async () => {
    const args = {
      ...baseEip1559,
      data: '0x1234',
    } satisfies TransactionSerializableEIP1559

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667802f85dd9820311847735940084b2d05e008252088080648001821234c001a0d649dac42d624f2b6d462fe0ee2cad5015471a8290c93212ddea29567cac0529a0028bec33e29a368e05ff61352fa37a1c6b21efff35cd79498e9a55a133a9f613"`,
    )
  })

  test('args: maxFeePerGas/maxPriorityFeePerGas', async () => {
    const args = {
      ...baseEip1559,
      maxFeePerGas: parseGDrip('20'),
      maxPriorityFeePerGas: parseGDrip('2'),
    } satisfies TransactionSerializableEIP1559

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667802f85cd882031184773594008504a817c800825208808064800180c001a0e05cbf9c2c51ba6613c11f8d1f703b408118023b97fb7a054af0f32cfda7e00ca0656982a2d1175fb6d5c5a52543ae6c9a4109e85801b866e6453b5e18d5830b31"`,
    )
  })
})

describe('eip2930', () => {
  const baseEip2930 = {
    ...base,
    chainId: 1,
    gasPrice: parseGDrip('2'),
    type: 'eip2930',
  } as const satisfies TransactionSerializable

  test('default', async () => {
    const signature = await signTransaction({
      transaction: baseEip2930,
      privateKey: accounts[0].privateKey,
    })

    const tx = new Transaction({
      ...baseEip2930,
      type: 1,
      gasPrice: baseEip2930.gasPrice.toString(),
      gas: baseEip2930.gas.toString(),
      storageLimit: baseEip2930.storageLimit.toString(),
    })
    tx.sign(accounts[0].privateKey, 1)

    expect(signature).toEqual(format.hex(tx.encode(true)))
    expect(signature).toMatchInlineSnapshot(
      `"0x63667801f856d28203118477359400825208808064800180c001a0e2329960a88426e4a3409aeff26376011c398f93596973a11c2f7be1599b5be0a0579a1302720b244201345789a67772275e42575c63c0c7e083a2ada81d1e7f42"`,
    )
  })

  test('minimal (w/ accessList & gasPrice)', async () => {
    const args = {
      chainId: 1,
      accessList: [
        {
          address: accounts[0].base32Address,
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          ],
        },
      ],
      gasPrice: parseGDrip('2'),
    } as TransactionSerializableEIP2930

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667801f88cf84780847735940080808080800180f838f794156f6c9df2f05f1e9c15b10dbebd8851c9b4842fe1a0000000000000000000000000000000000000000000000000000000000000000001a03628ea6028eb728f142daf1df663bb54b3ce65d87725c307f13758725ee1b52ca012974aa3345eacea35ceb154566b82223bf4265cc375f14d954711e9980a0d3d"`,
    )
  })

  test('minimal (w/ type)', async () => {
    const args = {
      chainId: 1,
      type: 'eip2930',
    } as const
    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667801f84eca808080808080800180c080a05a33bd911c7f3daf5cbf08cfe26818348d5d72768af1c7ea9f2b0d8600ffe351a073111ce78fb7af119c04eb4a99563f33d3b60f5002930891172c41a7e91b0882"`,
    )
  })

  test('args: accessList', async () => {
    const args = {
      ...baseEip2930,
      accessList: [
        {
          address: accounts[0].base32Address,
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ],
        },
      ],
    } satisfies TransactionSerializableEIP2930

    const tx = new Transaction({
      ...baseEip2930,
      type: 1,
      gasPrice: baseEip2930.gasPrice.toString(),
      gas: baseEip2930.gas.toString(),
      storageLimit: baseEip2930.storageLimit.toString(),
      accessList: [
        {
          address: accounts[0].base32Address,
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ],
        },
      ],
    })
    tx.sign(accounts[0].privateKey, 1)

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toEqual(format.hex(tx.encode(true)))
    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667801f8b3f86e8203118477359400825208808064800180f85bf85994156f6c9df2f05f1e9c15b10dbebd8851c9b4842ff842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe80a095f8abdea3fa592f36cecf2b382ec21205d1d166db4148e94899bc57921d73bda01835cf5335fb6df411f96591e449a8bab163e79686c5825c5a7eaeeaa67998de"`,
    )
  })

  test('args: data', async () => {
    const args = {
      ...baseEip2930,
      data: '0x1234',
    } satisfies TransactionSerializableEIP2930

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667801f858d482031184773594008252088080648001821234c080a08cece57b822e412e29ad7b332fd9da7949c67d4158530e241d3b128cf325e4e9a01e79fdf84dc10a9b81e81fee67701754418d68a03f1761c89e56bf758a153bc0"`,
    )
  })

  test('args: gasPrice', async () => {
    const args = {
      ...baseEip2930,
      gasPrice: parseGDrip('20'),
    } satisfies TransactionSerializableEIP2930

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0x63667801f857d38203118504a817c800825208808064800180c001a0260561705af55b73bc30337c7741d74ea83ba0394f1c17d0dc7af907b70bf01fa034d4c5ed21318e6da799b7cfc3e32fbb13d426d4bcf8beb1ecc5d0e04ef98285"`,
    )
  })
})

describe('with custom EIP2718 serializer', () => {
  type ExampleTransaction = Omit<TransactionSerializableGeneric, 'type'> & {
    type: 'cip64'
    chainId: number
    additionalField: `0x${string}`
  }

  test('default', async () => {
    const exampleSerializer: SerializeTransactionFn<ExampleTransaction> = vi.fn(
      (transaction) => {
        const {
          chainId,
          nonce,
          gas,
          to,
          value,
          additionalField,
          maxFeePerGas,
          maxPriorityFeePerGas,
          data,
        } = transaction

        const serializedTransaction = [
          chainId ? toHex(chainId) : '0x',
          nonce ? toHex(nonce) : '0x',
          maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
          maxFeePerGas ? toHex(maxFeePerGas) : '0x',
          gas ? toHex(gas) : '0x',
          additionalField ?? '0x',
          to ? base32AddressToHex({ address: to }) : '0x',
          value ? toHex(value) : '0x',
          data ?? '0x',
          [],
        ]

        return concatHex(['0x08', toRlp(serializedTransaction)])
      },
    )

    const example2718Transaction: ExampleTransaction = {
      ...base,
      type: 'cip64',
      additionalField: '0x0000',
      chainId: 42240,
    }

    const signature = await signTransaction({
      transaction: example2718Transaction,
      privateKey: accounts[0].privateKey,
      serializer: exampleSerializer,
    })
    assertType(signature)

    expect(exampleSerializer).toHaveBeenCalledWith(example2718Transaction)

    expect(signature).toMatchInlineSnapshot(
      '"0x08d282a5008203118080825208820000808080c0"',
    )
  })
})

describe('legacy', () => {
  const baseLegacy = {
    ...base,
    gasPrice: parseGDrip('2'),
    type: 'legacy',
    chainId: accounts[0].netId,
  } as const satisfies TransactionSerializable

  test('default', async () => {
    const signature = await signTransaction({
      transaction: baseLegacy,
      privateKey: accounts[0].privateKey,
    })
    assertType<TransactionSerializedLegacy>(signature)

    const tx = new Transaction({
      ...baseLegacy,
      type: 0,
      gasPrice: baseLegacy.gasPrice.toString(),
      gas: baseLegacy.gas.toString(),
      storageLimit: baseLegacy.storageLimit.toString(),
    })
    tx.sign(accounts[0].privateKey, 1)
    expect(signature).toBe(format.hex(tx.encode(true)))
  })

  test('minimal (w/ gasPrice)', async () => {
    const args = {
      gasPrice: parseGDrip('2'),
    } as TransactionSerializableEIP2930

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0xf851cd8084773594008080808080018001a040e46dfc1b24ccf69860e0122666c531c111815d96bc540b32d59bc4eb80032ba06736a1e231083d54c12ee762863c7033277c71ae0b912eae1c98a1ae4975a45a"`,
    )
  })

  test('minimal (w/ type)', async () => {
    const args = {
      type: 'legacy',
    } as const
    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0xf84dc980808080808080018001a0a9e18e781a90b9569104a42346649d6a8dd6f2775b7b069239a8083a84e532c8a004e7104b8027dd26e7c2c5a2500225896bad804e38a59aceb10260ae570d0916"`,
    )
  })

  test('args: data', async () => {
    const args = {
      ...baseLegacy,
      data: '0x1234',
    } satisfies TransactionSerializableLegacy

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0xf85ad68203118477359400825208808064808303114582123480a088f663d311c4e4f7557f4e9bda1b2840c375301c473c7f899ef6a32e9403b363a07c11f759c7811eb6c0153e8c43ff435b2c37c8cc950165fecee352295f41f93c"`,
    )
  })

  test('args: gas', async () => {
    const args = {
      ...baseLegacy,
      gas: 21000n,
    } satisfies TransactionSerializableLegacy

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0xf858d4820311847735940082520880806480830311458080a0dcb4e04afe920a788ad745996fc3491a52bf4995ea2727479de0b238bd165277a077e36e39210e7e31a94a278b0b90cd5e0db77f42add5dbb7cf2781e515a23bbc"`,
    )
  })

  test('args: gasPrice', async () => {
    const args = {
      ...baseLegacy,
      gasPrice: parseGDrip('20'),
    } satisfies TransactionSerializableLegacy

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0xf859d58203118504a817c80082520880806480830311458001a08f4c05a6d344b007b68c6265b77dafa744c7f264e7a2b82b9d38d746d09e4a76a01ab95769278bc5277730a78091728a3ba2fdac250ce7f81f0223eba6b6016e36"`,
    )
  })

  test('args: chainId', async () => {
    const args = {
      ...baseLegacy,
      chainId: 1,
    } satisfies TransactionSerializableLegacy

    expect(
      await signTransaction({
        transaction: args,
        privateKey: accounts[0].privateKey,
      }),
    ).toMatchInlineSnapshot(
      `"0xf855d1820311847735940082520880806480018001a0f2b86377598005ebf921fa232eadc1bc0893cf3c7a8002e0c11ce0d22b4b9697a014d5ae9c7644f77bd648d3b520e5abc29acf38f455218a9795bb332dbc787089"`,
    )
  })
})
