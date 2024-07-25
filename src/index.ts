// biome-ignore lint/performance/noBarrelFile: <explanation>
export {
  type Abi,
  type AbiFunction,
  type AbiParameter,
  type AbiEvent,
  type AbiStateMutability,
  type AbiParameterKind,
  type AbiParameterToPrimitiveType,
  type Address,
  type Narrow,
  type ParseAbi,
  type ParseAbiItem,
  type ParseAbiParameter,
  type ParseAbiParameters,
  type ResolvedRegister,
  type TypedData,
  type TypedDataDomain,
  type TypedDataParameter,
  CircularReferenceError,
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidAbiItemError,
  InvalidAbiTypeParameterError,
  InvalidFunctionModifierError,
  InvalidModifierError,
  InvalidParameterError,
  InvalidParenthesisError,
  InvalidSignatureError,
  InvalidStructSignatureError,
  SolidityProtectedKeywordError,
  UnknownTypeError,
  UnknownSignatureError,
  parseAbi,
  parseAbiItem,
  parseAbiParameter,
  parseAbiParameters,
} from './types/abitype.js'

export { http, webSocket, type Transport } from './clients/transports/index.js'
export { custom } from 'viem'
export { mainnet, testnet } from './chains/index.js'

export {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  type MulticallBatchOptions,
  createClient,
  rpcSchema,
} from './clients/createClient.js'

export { publicActions } from './clients/decorators/public.js'

export {
  type PublicClient,
  type PublicClientConfig,
  type CreatePublicClientErrorType,
  createPublicClient,
} from './clients/createPublicClient.js'

export {
  type WalletClientConfig,
  type WalletClient,
  type CreateWalletClientErrorType,
  createWalletClient,
} from './clients/createWalletClient.js'

export { formatCFX } from './utils/unit/formatCFX.js'
export { formatGDrip } from './utils/unit/formatGDrip.js'
export { formatUnits } from './utils/unit/formatUnits.js'
export { parseCFX } from './utils/unit/parseCFX.js'
export { parseGDrip } from './utils/unit/parseGDrip.js'
export { parseUnits } from './utils/unit/parseUnits.js'

export { toHex } from 'viem/utils'
