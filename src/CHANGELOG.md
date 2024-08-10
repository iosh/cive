# cive

## 0.1.0

### Minor Changes

- 8334e24: Removed the addressType parameter from the hexAddressToBase32 function. The function now determines the base32 address type based on the prefix of the hex address passed in (0x1, 0x8, or 0x0).
- de5928c: Added estimateContractGasAndCollateral
- 74edcd6: Added getContractEvents
- cadba6b: Added getContract

### Patch Changes

- 01d06bc: Reexported vite utils functions
- a5ccd1c: Added chain for export

## 0.0.4

### Patch Changes

- d0fb9ba: Added decodeFunctionResult for export
- 88afcee: Added decodeDeployData for export
- 3d36a78: Added encodeDeployData for export
  Added encodeEventTopics for export
  Added encodeFunctionData for export
  Added parseEventLogs for export
- 996790d: Added decodeFunctionData for export
- b56bf52: Added decodeEventLog for export

## 0.0.3

### Patch Changes

- 3f9c782: Added verifyMessage
  Fixed signTypedData address type error
  Added createContractEventFilter to publicClient
  Added readContract
  Added simulateContract
  Added writeContract to walletClient

## 0.0.2

### Patch Changes

- 8fa47c2: Added export of 'utils' functions.
