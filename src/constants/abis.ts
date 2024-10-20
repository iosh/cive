/* [Multicall3](https://github.com/mds1/multicall) */
export const multicall3Abi = [
  {
    inputs: [
      {
        components: [
          {
            name: 'target',
            type: 'address',
          },
          {
            name: 'allowFailure',
            type: 'bool',
          },
          {
            name: 'callData',
            type: 'bytes',
          },
        ],
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        components: [
          {
            name: 'success',
            type: 'bool',
          },
          {
            name: 'returnData',
            type: 'bytes',
          },
        ],
        name: 'returnData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// ERC-6492 - universal deployless signature validator contract
// constructor(address _signer, bytes32 _hash, bytes _signature) → bytes4 returnValue
// returnValue is either 0x1 (valid) or 0x0 (invalid)
export const universalSignatureValidatorAbi = [
  {
    inputs: [
      {
        name: '_signer',
        type: 'address',
      },
      {
        name: '_hash',
        type: 'bytes32',
      },
      {
        name: '_signature',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
] as const
