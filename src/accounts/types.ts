import type { CustomSource, Hex, OneOf } from "viem";
import type { HDKey } from "@scure/bip32";
import {
  mainNetworkIdType,
  testNetworkIdType,
} from "../constants/networkId.js";
import {
  mainNetworkNameType,
  otherNetworkNameType,
  testNetworkNameType,
} from "../constants/networkName.js";

export type NetworkNameType =
  | mainNetworkNameType
  | testNetworkNameType
  | `${otherNetworkNameType}${number}`;

export type AddressTypeUser = "user";
export type AddressTypeContract = "contract";
export type AddressTypeBuiltin = "builtin";
export type AddressTypeNull = "null";

export type AddressType =
  | AddressTypeUser
  | AddressTypeContract
  | AddressTypeBuiltin
  | AddressTypeNull;

type NetworkName<TNetworkId extends number | undefined = undefined> =
  TNetworkId extends undefined
    ?
        | mainNetworkNameType
        | testNetworkNameType
        | `${otherNetworkNameType}${string}`
    : TNetworkId extends mainNetworkIdType
    ? mainNetworkNameType
    : TNetworkId extends testNetworkIdType
    ? testNetworkNameType
    : `${otherNetworkNameType}${string}`;

type FullAddressType<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined
> = `${Uppercase<`${NetworkName<TNetworkId>}.type.${TAddressType extends undefined
  ? AddressType
  : TAddressType extends AddressTypeUser
  ? Uppercase<AddressTypeUser>
  : TAddressType extends AddressTypeContract
  ? Uppercase<AddressTypeContract>
  : TAddressType extends AddressTypeBuiltin
  ? Uppercase<AddressTypeBuiltin>
  : TAddressType extends AddressTypeNull
  ? Uppercase<AddressTypeNull>
  : never}`>}:${string}`;

export type Address<
  TNetworkId extends number | undefined = undefined,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
> = TVerbose extends undefined
  ?
      | FullAddressType<TNetworkId, TAddressType>
      | `${NetworkName<TNetworkId>}:${string}`
  : TVerbose extends true
  ? FullAddressType<TNetworkId, TAddressType>
  : `${NetworkName<TNetworkId>}:${string}`;
export type Account<TAddress extends Address = Address> = OneOf<
  JsonRpcAccount<TAddress> | LocalAccount<string, TAddress>
>;

export type JsonRpcAccount<TAddress extends Address = Address> = {
  address: TAddress;
  type: "json-rpc";
};

export type LocalAccount<
  TSource extends string = string,
  TAddress extends Address = Address
> = CustomSource & {
  address: TAddress;
  publicKey: Hex;
  source: TSource;
  type: "local";
};

export type HDAccount = LocalAccount<"hd"> & {
  getHdKey(): HDKey;
};

export type HDOptions =
  | {
      /** The account index to use in the path (`"m/44'/503'/${accountIndex}'/0/0"`). */
      accountIndex?: number | undefined;
      /** The address index to use in the path (`"m/44'/503'/0'/0/${addressIndex}"`). */
      addressIndex?: number | undefined;
      /** The change index to use in the path (`"m/44'/503'/0'/${changeIndex}/0"`). */
      changeIndex?: number | undefined;
      path?: never | undefined;
    }
  | {
      accountIndex?: never | undefined;
      addressIndex?: never | undefined;
      changeIndex?: never | undefined;
      /** The HD path. */
      path: `m/44'/503'/${string}`;
    };
