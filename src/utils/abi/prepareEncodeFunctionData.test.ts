import { erc20Abi } from '../../types/abitype/abis/json.js'
import { expect, test } from 'vitest'
import { prepareEncodeFunctionData } from './prepareEncodeFunctionData.js'

test('default', () => {
  const prepared = prepareEncodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
  })
  expect(prepared).toMatchInlineSnapshot(`
    {
      "abi": [
        {
          "inputs": [
            {
              "name": "recipient",
              "type": "address",
            },
            {
              "name": "amount",
              "type": "uint256",
            },
          ],
          "name": "transfer",
          "outputs": [
            {
              "name": "",
              "type": "bool",
            },
          ],
          "stateMutability": "nonpayable",
          "type": "function",
        },
      ],
      "functionName": "0xa9059cbb",
    }
  `)
})

test('inferred functionName', () => {
  expect(
    prepareEncodeFunctionData({
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
  ).toMatchInlineSnapshot(`
      {
        "abi": [
          {
            "inputs": [
              {
                "name": "a",
                "type": "uint256",
              },
            ],
            "name": "bar",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
        ],
        "functionName": "0x0423a132",
      }
    `)
})
