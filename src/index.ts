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

export type {
  Chain,
  ChainContract,
  ChainFees,
  ChainFeesFnParameters,
  ChainFormatter,
  ChainEstimateFeesPerGasFnParameters,
  DeriveChain,
  GetChainParameter,
  ChainFormatters,
  ChainSerializers,
  ExtractChainFormatterExclude,
  ExtractChainFormatterParameters,
  ExtractChainFormatterReturnType,
} from './types/chain.js'

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

export {
  type DecodeDeployDataErrorType,
  type DecodeDeployDataParameters,
  type DecodeDeployDataReturnType,
  decodeDeployData,
} from './utils/abi/decodeDeployData.js'

export {
  type DecodeEventLogErrorType,
  type DecodeEventLogParameters,
  type DecodeEventLogReturnType,
  decodeEventLog,
} from './utils/abi/decodeEventLog.js'
export {
  type DecodeFunctionDataErrorType,
  type DecodeFunctionDataParameters,
  type DecodeFunctionDataReturnType,
  decodeFunctionData,
} from './utils/abi/decodeFunctionData.js'
export {
  type DecodeFunctionResultErrorType,
  type DecodeFunctionResultParameters,
  type DecodeFunctionResultReturnType,
  decodeFunctionResult,
} from './utils/abi/decodeFunctionResult.js'

export {
  type EncodeDeployDataErrorType,
  type EncodeDeployDataParameters,
  type EncodeDeployDataReturnType,
  encodeDeployData,
} from './utils/abi/encodeDeployData.js'

export {
  type EncodeEventTopicsErrorType,
  type EncodeEventTopicsParameters,
  type EncodeEventTopicsReturnType,
  encodeEventTopics,
} from './utils/abi/encodeEventTopics.js'
export {
  type EncodeFunctionDataErrorType,
  type EncodeFunctionDataParameters,
  type EncodeFunctionDataReturnType,
  encodeFunctionData,
} from './utils/abi/encodeFunctionData.js'
export {
  type ParseEventLogsErrorType,
  type ParseEventLogsParameters,
  type ParseEventLogsReturnType,
  parseEventLogs,
} from './utils/abi/parseEventLogs.js'
