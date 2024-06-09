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

export type NetworkPrefix =
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

type Prefix<TNetworkId extends number = number> =
  TNetworkId extends mainNetworkIdType
    ? "cfx"
    : TNetworkId extends testNetworkIdType
    ? "cfxtest"
    : `net${TNetworkId}`;

export type AddressWithNetworkPrefix<
  TNetworkId extends number = number,
  TAddressType extends AddressType = AddressType,
  TVerbose extends boolean = boolean
> = TVerbose extends true
  ? `${Prefix<TNetworkId>}.type.${TAddressType}:${string}`
  : `${Prefix<TNetworkId>}:${string}`;

export type Address<
  TNetworkId extends number = number,
  TAddressType extends AddressType = AddressType,
  TVerbose extends boolean = boolean
> = AddressWithNetworkPrefix<TNetworkId, TAddressType, TVerbose>;

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
