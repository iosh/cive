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

export {
  getContract,
  type GetContractErrorType,
  type GetContractParameters,
  type GetContractReturnType,
} from './actions/getContract.js'

export { toHex } from 'viem/utils'

export type {
  ByteArray,
  Hash,
  Hex,
  LogTopic,
  Signature,
  CompactSignature,
  SignableMessage,
} from './types/misc.js'

export {
  type EncodePackedErrorType,
  encodePacked,
  type ConcatBytesErrorType,
  type ConcatErrorType,
  type ConcatHexErrorType,
  concat,
  concatBytes,
  concatHex,
  type IsBytesErrorType,
  isBytes,
  type IsHexErrorType,
  isHex,
  type PadBytesErrorType,
  type PadErrorType,
  type PadHexErrorType,
  pad,
  padBytes,
  padHex,
  type SizeErrorType,
  size,
  type AssertEndOffsetErrorType,
  type AssertStartOffsetErrorType,
  type SliceBytesErrorType,
  type SliceErrorType,
  type SliceHexErrorType,
  type SliceReturnType,
  slice,
  sliceBytes,
  sliceHex,
  type TrimErrorType,
  type TrimReturnType,
  trim,
  type BytesToRlpErrorType,
  type HexToRlpErrorType,
  type ToRlpErrorType,
  type ToRlpReturnType,
  toRlp,
  type BoolToBytesErrorType,
  type BoolToBytesOpts,
  type HexToBytesErrorType,
  type HexToBytesOpts,
  type NumberToBytesErrorType,
  type StringToBytesErrorType,
  type StringToBytesOpts,
  type ToBytesErrorType,
  type ToBytesParameters,
  boolToBytes,
  toBytes,
  hexToBytes,
  numberToBytes,
  stringToBytes,
  type BoolToHexErrorType,
  type BoolToHexOpts,
  type BytesToHexErrorType,
  type BytesToHexOpts,
  type NumberToHexErrorType,
  type NumberToHexOpts,
  type StringToHexErrorType,
  type StringToHexOpts,
  type ToHexErrorType,
  type ToHexParameters,
  boolToHex,
  bytesToHex,
  numberToHex,
  stringToHex,
  type BytesToBigIntErrorType,
  type BytesToBigIntOpts,
  type BytesToBoolErrorType,
  type BytesToBoolOpts,
  type BytesToNumberErrorType,
  type BytesToNumberOpts,
  type BytesToStringErrorType,
  type BytesToStringOpts,
  type FromBytesErrorType,
  type FromBytesParameters,
  type FromBytesReturnType,
  bytesToBigInt,
  bytesToBigInt as bytesToBigint,
  bytesToBool,
  bytesToNumber,
  bytesToString,
  fromBytes,
  type AssertSizeErrorType,
  type FromHexErrorType,
  type FromHexParameters,
  type FromHexReturnType,
  type HexToBigIntErrorType,
  type HexToBigIntOpts,
  type HexToBoolErrorType,
  type HexToBoolOpts,
  type HexToNumberErrorType,
  type HexToNumberOpts,
  type HexToStringErrorType,
  type HexToStringOpts,
  fromHex,
  hexToBool,
  hexToBigInt,
  hexToNumber,
  hexToString,
  type FromRlpErrorType,
  fromRlp,
  type ToEventSelectorErrorType,
  toEventSelector,
  type IsHashErrorType,
  isHash,
  type Keccak256ErrorType,
  keccak256,
  type Sha256ErrorType,
  sha256,
  type Ripemd160ErrorType,
  ripemd160,
} from 'viem/utils'

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
