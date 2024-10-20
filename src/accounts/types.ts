import type { HDKey } from '@scure/bip32'
import type { Hash, Hex, OneOf } from 'viem'
import type {
  mainNetworkIdType,
  testNetworkIdType,
} from '../constants/networkId.js'
import type {
  mainNetworkNameType as MainnetNameType,
  otherNetworkNameType as PrivatenetNameType,
  testNetworkNameType as TestnetNameType,
} from '../constants/networkName.js'
import type { TypedData } from '../types/abitype.js'
import type { SignableMessage } from '../types/misc.js'
import type {
  TransactionSerializable,
  TransactionSerialized,
} from '../types/transaction.js'
import type { TypedDataDefinition } from '../types/typedData.js'
import type { IsNarrowable } from '../types/utils.js'
import type { GetTransactionType } from '../utils/transaction/getTransactionType.js'
import type { SerializeTransactionFn } from '../utils/transaction/serializeTransaction.js'

export type NetworkNameType =
  | MainnetNameType
  | TestnetNameType
  | `${PrivatenetNameType}${number}`

export type AddressUserType = 'user'
export type AddressContractType = 'contract'
export type AddressBuiltinType = 'builtin'
export type AddressNullType = 'null'

export type AddressType =
  | AddressUserType
  | AddressContractType
  | AddressBuiltinType
  | AddressNullType

type NetworkTypeName<
  T extends MainnetNameType | TestnetNameType | PrivatenetNameType,
  Upcase extends boolean | undefined = undefined,
> = Upcase extends undefined ? T : Uppercase<T>

type NetworkName<
  TNetworkId extends number | undefined = undefined,
  Upcase extends boolean | undefined = undefined,
> = TNetworkId extends undefined
  ?
      | NetworkTypeName<MainnetNameType, Upcase>
      | NetworkTypeName<TestnetNameType, Upcase>
      | `${NetworkTypeName<
          PrivatenetNameType,
          Upcase
        >}${TNetworkId extends undefined ? string : TNetworkId}`
  : TNetworkId extends mainNetworkIdType
    ? NetworkTypeName<MainnetNameType, Upcase>
    : TNetworkId extends testNetworkIdType
      ? NetworkTypeName<TestnetNameType, Upcase>
      : `${NetworkTypeName<
          PrivatenetNameType,
          Upcase
        >}${TNetworkId extends undefined ? string : TNetworkId}`

type FullAddressType<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
> = `${NetworkName<
  TNetworkId,
  true
>}:${Uppercase<`TYPE.${TAddressType extends undefined
  ? AddressType
  : TAddressType extends AddressUserType
    ? Uppercase<AddressUserType>
    : TAddressType extends AddressContractType
      ? Uppercase<AddressContractType>
      : TAddressType extends AddressBuiltinType
        ? Uppercase<AddressBuiltinType>
        : TAddressType extends AddressNullType
          ? Uppercase<AddressNullType>
          : never}`>}:${string}`

export type Address<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined,
> = TVerbose extends undefined
  ?
      | FullAddressType<TNetworkId, TAddressType>
      | `${NetworkName<TNetworkId>}:${string}`
  : TVerbose extends true
    ? FullAddressType<TNetworkId, TAddressType>
    : `${NetworkName<TNetworkId>}:${string}`

export type Account<TAddress extends Address = Address> = OneOf<
  JsonRpcAccount<TAddress> | LocalAccount<string, TAddress>
>
export type HexAddress = `0x${string}`

export type AccountSource = Address | CustomSource

export type CustomSource = {
  address: Address
  signMessage: ({ message }: { message: SignableMessage }) => Promise<Hash>
  signTransaction: <
    serializer extends
      SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
    transaction extends Parameters<serializer>[0] = Parameters<serializer>[0],
  >(
    transaction: transaction,
    args?:
      | {
          serializer?: serializer | undefined
        }
      | undefined,
  ) => Promise<
    IsNarrowable<
      TransactionSerialized<GetTransactionType<transaction>>,
      Hash
    > extends true
      ? TransactionSerialized<GetTransactionType<transaction>>
      : Hash
  >
  signTypedData: <
    const typedData extends TypedData | Record<string, unknown>,
    primaryType extends keyof typedData | 'CIP23Domain' = keyof typedData,
  >(
    typedDataDefinition: TypedDataDefinition<typedData, primaryType>,
  ) => Promise<Hash>
}

export type JsonRpcAccount<TAddress extends Address = Address> = {
  address: TAddress
  type: 'json-rpc'
}

export type LocalAccount<
  TSource extends string = string,
  TAddress extends Address = Address,
> = CustomSource & {
  address: TAddress
  publicKey: Hex
  source: TSource
  type: 'local'
}

export type HDAccount = LocalAccount<'hd'> & {
  getHdKey(): HDKey
}

export type HDOptions =
  | {
      /** The account index to use in the path (`"m/44'/503'/${accountIndex}'/0/0"`). */
      accountIndex?: number | undefined
      /** The address index to use in the path (`"m/44'/503'/0'/0/${addressIndex}"`). */
      addressIndex?: number | undefined
      /** The change index to use in the path (`"m/44'/503'/0'/${changeIndex}/0"`). */
      changeIndex?: number | undefined
      path?: never | undefined
      networkId: number
    }
  | {
      accountIndex?: never | undefined
      addressIndex?: never | undefined
      changeIndex?: never | undefined
      /** The HD path. */
      path: `m/44'/503'/${string}`
      networkId: number
    }

export type PrivateKeyAccount = LocalAccount<'privateKey'>
