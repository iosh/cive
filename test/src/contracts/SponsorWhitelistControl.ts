export const SponsorWhitelistControl = {
  abi: [
    {
      inputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
      name: 'addPrivilege',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
        { internalType: 'address[]', name: 'addresses', type: 'address[]' },
      ],
      name: 'addPrivilegeByAdmin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'getSponsorForCollateral',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'getSponsorForGas',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'getSponsoredBalanceForCollateral',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'getSponsoredBalanceForGas',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'getSponsoredGasFeeUpperBound',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'isAllWhitelisted',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
        { internalType: 'address', name: 'user', type: 'address' },
      ],
      name: 'isWhitelisted',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
      name: 'removePrivilege',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
        { internalType: 'address[]', name: 'addresses', type: 'address[]' },
      ],
      name: 'removePrivilegeByAdmin',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'setSponsorForCollateral',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
        { internalType: 'uint256', name: 'upperBound', type: 'uint256' },
      ],
      name: 'setSponsorForGas',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'contractAddr', type: 'address' },
      ],
      name: 'getAvailableStoragePoints',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const,
}
