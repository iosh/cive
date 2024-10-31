# cive

## 0.7.0

### Minor Changes

- cca897c: Added test client and action

## 0.6.0

### Minor Changes

- d012f90: Added verifyMessage action
- d78897a: Added verifyTypedData
- 8ad9d2d: Added verifyHash

### Patch Changes

- 2bec220: Added abitype

## 0.5.0

### Minor Changes

- a1d7d29: Add multicall action

### Patch Changes

- 3c84c15: Added multicall3 contract

## 0.4.1

### Patch Changes

- f484fe1: Added wallet action to export
- 68dd2a6: Fixed EIP1193EventMap Address type

## 0.4.0

### Minor Changes

- 3f0bb14: Added websocet to client transport

### Patch Changes

- 0518000: Fixed testnet websocket endpoint

## 0.3.1

### Patch Changes

- cbd103a: Added typesVersions to package.json

## 0.3.0

### Minor Changes

- a97b4ad: Added custom function from viem
- db328b4: Updated Transport type from viem
- 201e365: Update http function from viem

### Patch Changes

- 8eab43c: Updated viem version
- ea50656: Added fallback to export

## 0.2.0

### Minor Changes

- a05940f: Added cacheTime option to getEpochNumber
- c96878b: Added waitForTransactionReceipt
- 52e83aa: Added watchEpochNumber
- c755385: Added getContractAddress

### Patch Changes

- 37fe445: Updated simulateContract and writeContract type
- 677effe: Added public action for export
- 10b6b25: Fixed contract address calculation in the getContractAddress function

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
