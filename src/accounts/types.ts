import type { CustomSource, Hex, OneOf } from "viem";

export type NetworkPrefix = 'cfx' | 'cfxtest' | `net${string}`;
export type AddressType = 'builtin' | 'user' | 'contract';
export  type Address = `${NetworkPrefix}:${string}` | `${NetworkPrefix}.type.${AddressType}:${string}`;



export type Account<TAddress extends Address = Address> = OneOf<
  JsonRpcAccount<TAddress> | LocalAccount<string, TAddress>
>

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
  