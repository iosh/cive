import type { ErrorType } from "../../errors/utils.js";
import { Hex, Keccak256ErrorType, keccak256 } from "viem";
import { hexAddressToBase32 } from "../../utils/address/hexAddressToBase32.js";
import { Address, AddressType } from "../types.js";

export type PublicKeyToAddressParameters<
  TChainId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
> = {
  publicKey: Hex;
  chainId: TChainId;
  addressType?: TAddressType;
  verbose?: TVerbose;
};

export type PublicKeyToAddressErrorType = Keccak256ErrorType | ErrorType;

export function publicKeyToAddress<
  TChainId extends number = number,
  TAddressType extends AddressType | undefined = undefined,
  TVerbose extends boolean | undefined = undefined
>({
  publicKey,
  chainId,
  addressType = "user",
  verbose = false,
}: PublicKeyToAddressParameters<TChainId, TAddressType, TVerbose>) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return hexAddressToBase32({
    hexAddress: `0x${address}`,
    chainId,
    addressType,
    verbose,
  }) as Address<TChainId, TAddressType, TVerbose>;
}
