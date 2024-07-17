import {
  type AbiParameter,
  parseAbi,
  parseAbiParameters,
} from '../../types/abitype.js'

import { describe, expect, test } from 'vitest'

import { accounts } from '../../../test/src/constants.js'
import { Test20 } from '../../../test/src/contracts/Test20.js'
import { getAbiItem, getAmbiguousTypes, isArgOfType } from './getAbiItem.js'

test('default', () => {
  expect(
    getAbiItem({
      abi: Test20.abi,
      name: 'balanceOf',
      args: [accounts[0].base32Address],
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address",
        },
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256",
        },
      ],
      "stateMutability": "view",
      "type": "function",
    }
  `)
})

describe('selector', () => {
  test('function', () => {
    expect(
      getAbiItem({
        abi: Test20.abi,
        name: '0x70a08231',
      }),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address",
          },
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      }
    `)
  })
  test('event', () => {
    expect(
      getAbiItem({
        abi: Test20.abi,
        name: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      }),
    ).toMatchInlineSnapshot(`
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address",
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address",
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256",
          },
        ],
        "name": "Transfer",
        "type": "event",
      }
    `)
  })
})

test('no matching name', () => {
  expect(
    getAbiItem({
      abi: [],
      // @ts-expect-error
      name: 'balanceOf',
      args: [accounts[0].base32Address],
    }),
  ).toMatchInlineSnapshot('undefined')
})

test('overloads: no inputs', () => {
  expect(
    getAbiItem({
      abi: [
        {
          name: 'balanceOf',
          outputs: [{ name: 'x', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [{ name: 'x', type: 'uint256' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      name: 'balanceOf',
      args: [''],
    }),
  ).toMatchInlineSnapshot(`
      {
        "name": "balanceOf",
        "outputs": [
          {
            "name": "x",
            "type": "uint256",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      }
    `)
})

test('overloads: undefined inputs', () => {
  expect(
    getAbiItem({
      abi: [
        {
          inputs: undefined,
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      name: 'balanceOf',
      args: [''],
    }),
  ).toMatchInlineSnapshot(`
      {
        "inputs": undefined,
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      }
    `)
})

test('overloads: no args', () => {
  expect(
    getAbiItem({
      abi: [
        {
          inputs: [{ name: '', type: 'uint256' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      name: 'balanceOf',
    }),
  ).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      }
    `)
})

test('overload: different lengths without abi order define effect', () => {
  const abis = Test20.abi.filter(
    (abi) => abi.type === 'function' && abi.name === 'transfer',
  )
  const shortArgs = [accounts[0].base32Address, 420n] as const

  const longArgs = [accounts[0].base32Address, 420n] as const

  expect(
    getAbiItem({
      abi: abis,
      name: 'transfer',
      args: shortArgs,
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address",
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256",
        },
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    }
  `)
  expect(
    getAbiItem({
      abi: abis.reverse(),
      name: 'transfer',
      args: shortArgs,
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address",
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256",
        },
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    }
  `)

  expect(
    getAbiItem({
      abi: abis,
      name: 'transfer',
      args: longArgs,
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address",
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256",
        },
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    }
  `)
  expect(
    getAbiItem({
      abi: abis.reverse(),
      name: 'transfer',
      args: longArgs,
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address",
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256",
        },
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool",
        },
      ],
      "stateMutability": "nonpayable",
      "type": "function",
    }
  `)
})

test('overload: different types', () => {
  const abi = [
    {
      inputs: [],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ name: 'tokenId', type: 'string' }],
      name: 'mint',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]

  expect(
    getAbiItem({
      abi,
      name: 'mint',
    }),
  ).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)

  expect(
    getAbiItem({
      abi,
      name: 'mint',
      args: [420n],
    }),
  ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "name": "tokenId",
            "type": "uint256",
          },
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)

  expect(
    getAbiItem({
      abi,
      name: 'mint',
      args: ['foo'],
    }),
  ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "name": "tokenId",
            "type": "string",
          },
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)
})

test('overloads: tuple', () => {
  expect(
    getAbiItem({
      abi: [
        {
          inputs: [
            { name: 'foo', type: 'uint256' },
            {
              name: 'bar',
              type: 'tuple',
              components: [
                { name: 'a', type: 'string' },
                {
                  name: 'b',
                  type: 'tuple',
                  components: [
                    { name: 'merp', type: 'string' },
                    { name: 'meep', type: 'string' },
                  ],
                },
                { name: 'c', type: 'uint256' },
              ],
            },
          ],
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            { name: 'foo', type: 'uint256' },
            {
              name: 'bar',
              type: 'tuple',
              components: [
                { name: 'a', type: 'string' },
                {
                  name: 'b',
                  type: 'tuple',
                  components: [
                    { name: 'merp', type: 'string' },
                    { name: 'meep', type: 'string' },
                  ],
                },
                { name: 'c', type: 'address' },
              ],
            },
          ],
          name: 'foo',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      name: 'foo',
      args: [
        420n,
        {
          a: accounts[0].base32Address,
          b: { merp: 'test', meep: 'test' },
          c: accounts[0].base32Address,
        },
      ],
    }),
  ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "name": "foo",
            "type": "uint256",
          },
          {
            "components": [
              {
                "name": "a",
                "type": "string",
              },
              {
                "components": [
                  {
                    "name": "merp",
                    "type": "string",
                  },
                  {
                    "name": "meep",
                    "type": "string",
                  },
                ],
                "name": "b",
                "type": "tuple",
              },
              {
                "name": "c",
                "type": "address",
              },
            ],
            "name": "bar",
            "type": "tuple",
          },
        ],
        "name": "foo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)
})
