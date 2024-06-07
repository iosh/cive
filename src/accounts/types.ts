import type { CustomSource, Hex, OneOf } from "viem";
import type { HDKey } from "@scure/bip32";
import {
  mainNetworkIdType,
  testNetworkIdType,
} from "../utils/network/networkId.js";

export type NetworkPrefix = "cfx" | "cfxtest" | `net${number}`;

export type AddressType = "builtin" | "user" | "contract";

export type AddressWithNetworkPrefix<
  TNetworkPrefix extends NetworkPrefix,
  TAddressType extends AddressType = AddressType
> =
  | `${TNetworkPrefix}:${string}`
  | `${TNetworkPrefix}.type.${TAddressType}:${string}`;

export type Address<
  TNetworkId extends number = mainNetworkIdType | testNetworkIdType,
  TAddressType extends AddressType = AddressType
> = TNetworkId extends mainNetworkIdType
  ? AddressWithNetworkPrefix<"cfx", TAddressType>
  : TNetworkId extends testNetworkIdType
  ? AddressWithNetworkPrefix<"cfxtest", TAddressType>
  : AddressWithNetworkPrefix<`net${TNetworkId}`, TAddressType>;

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
