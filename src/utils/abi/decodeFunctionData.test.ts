import { expect, expectTypeOf, test } from 'vitest'

import { accounts } from '../../../test/src/constants.js'
import type { Address } from '../../types/abitype.js'
import { decodeFunctionData } from './decodeFunctionData.js'

test('foo()', () => {
  expect(
    decodeFunctionData({
      abi: [
        {
          inputs: [],
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0xc2985578',
      networkId: accounts[0].netId,
    }),
  ).toEqual({ args: undefined, functionName: 'foo' })
  expect(
    decodeFunctionData({
      abi: [
        {
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0xc2985578',
      networkId: accounts[0].netId,
    }),
  ).toEqual({ args: undefined, functionName: 'foo' })
})

test('bar(uint256)', () => {
  expect(
    decodeFunctionData({
      abi: [
        {
          inputs: [
            {
              name: 'a',
              type: 'uint256',
            },
          ],
          name: 'bar',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ] as const,
      data: '0x0423a1320000000000000000000000000000000000000000000000000000000000000001',
      networkId: accounts[0].netId,
    }),
  ).toEqual({
    args: [1n],
    functionName: 'bar',
  })
})

test('getVoter((uint256,bool,address,uint256))', () => {
  const result = decodeFunctionData({
    abi: [
      {
        inputs: [
          {
            components: [
              {
                name: 'weight',
                type: 'uint256',
              },
              {
                name: 'voted',
                type: 'bool',
              },
              {
                name: 'delegate',
                type: 'address',
              },
              {
                name: 'vote',
                type: 'uint256',
              },
            ],
            name: 'voter',
            type: 'tuple',
          },
        ],
        name: 'getVoter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
    data: '0xf37414670000000000000000000000000000000000000000000000000000000000010f2c000000000000000000000000000000000000000000000000000000000000000100000000000000000000000015cc3c03994DB5b0d9A5eEdD10CabaB0813678AC0000000000000000000000000000000000000000000000000000000000000029',
    networkId: accounts[0].netId,
  })

  expect(result).toEqual({
    args: [
      {
        delegate: 'net201029:aam62tadxfg5npg3y11r4egm1m2jcrx2zue8f7yjpu',
        vote: 41n,
        voted: true,
        weight: 69420n,
      },
    ],
    functionName: 'getVoter',
  })

  expectTypeOf(result).toEqualTypeOf<{
    functionName: 'getVoter'
    args: readonly [
      {
        delegate: Address
        vote: bigint
        voted: boolean
        weight: bigint
      },
    ]
  }>()
})

test('returns discrimated union type for abi with multiple abi items', () => {
  const result = decodeFunctionData({
    abi: [
      {
        inputs: [
          {
            components: [
              {
                name: 'weight',
                type: 'uint256',
              },
              {
                name: 'voted',
                type: 'bool',
              },
              {
                name: 'delegate',
                type: 'address',
              },
              {
                name: 'vote',
                type: 'uint256',
              },
            ],
            name: 'voter',
            type: 'tuple',
          },
        ],
        name: 'getVoter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            name: 'a',
            type: 'uint256',
          },
        ],
        name: 'bar',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'foo',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
    data: '0x0423a1320000000000000000000000000000000000000000000000000000000000000001',
    networkId: accounts[0].netId,
  })

  expectTypeOf(result).toEqualTypeOf<
    | {
        functionName: 'getVoter'
        args: readonly [
          {
            delegate: Address
            vote: bigint
            voted: boolean
            weight: bigint
          },
        ]
      }
    | {
        functionName: 'bar'
        args: readonly [bigint]
      }
    | {
        functionName: 'foo'
        args: readonly []
      }
  >()

  expect(result).toEqual({ args: [1n], functionName: 'bar' })
})
