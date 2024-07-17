import { expect, test } from 'vitest'

import { erc20Abi } from 'abitype/abis'
import { accounts } from '../../../test/src/constants.js'
import { encodeFunctionData } from './encodeFunctionData.js'
import { prepareEncodeFunctionData } from './prepareEncodeFunctionData.js'
test('foo()', () => {
  expect(
    encodeFunctionData({
      abi: [
        {
          inputs: [],
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'foo',
    }),
  ).toEqual('0xc2985578')
  expect(
    encodeFunctionData({
      abi: [
        {
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'foo',
    }),
  ).toEqual('0xc2985578')
})

test('bar(uint256)', () => {
  expect(
    encodeFunctionData({
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
      ],
      functionName: 'bar',
      args: [1n],
    }),
  ).toEqual(
    '0x0423a1320000000000000000000000000000000000000000000000000000000000000001',
  )
})

test('getVoter((uint256,bool,address,uint256))', () => {
  expect(
    encodeFunctionData({
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
      ],
      functionName: 'getVoter',
      args: [
        {
          delegate: accounts[0].base32Address,
          vote: 41n,
          voted: true,
          weight: 69420n,
        },
      ],
    }),
  ).toEqual(
    '0xf37414670000000000000000000000000000000000000000000000000000000000010f2c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000156f6c9df2f05f1e9c15b10dbebd8851c9b4842f0000000000000000000000000000000000000000000000000000000000000029',
  )
})
test('inferred functionName', () => {
  expect(
    encodeFunctionData({
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
      ],
      args: [1n],
    }),
  ).toEqual(
    '0x0423a1320000000000000000000000000000000000000000000000000000000000000001',
  )
})

test('selector as functionName', () => {
  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: '0xa9059cbb',
    args: [accounts[0].base32Address, 69420n],
  })
  expect(data).toMatchInlineSnapshot(
    `"0xa9059cbb000000000000000000000000156f6c9df2f05f1e9c15b10dbebd8851c9b4842f0000000000000000000000000000000000000000000000000000000000010f2c"`,
  )
})

test('prepared', () => {
  const transfer = prepareEncodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
  })
  const data_prepared = encodeFunctionData({
    ...transfer,
    args: [accounts[0].base32Address, 69420n],
  })
  const data = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [accounts[0].base32Address, 69420n],
  })
  expect(data_prepared).toEqual(data)
})
