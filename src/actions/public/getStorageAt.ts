import type { Address } from "abitype";
import type { EpochTag } from "../../types/block";
import { numberToHex, type Chain, type Hex, type Transport } from "viem";
import type { Client } from "../../clients/createClient";

export type GetStorageAtParameters = {
  address: Address;
  slot: Hex;
} & (
  | {
      /**
       * @default 'latest_state'
       */
      epochTag?: EpochTag | undefined;
      epochNumber?: never | undefined;
    }
  | {
      epochTag?: never | undefined;
      epochNumber?: bigint | undefined;
    }
);

export type GetStorageAtReturnType = Hex | null;

export async function GetStorageAt<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    address,
    slot,
    epochNumber,
    epochTag = "latest_state",
  }: GetStorageAtParameters
): Promise<GetStorageAtReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const data = await client.request({
    method: "cfx_getStorageAt",
    params: [address, slot, _epochNumber || epochTag],
  });

  if (data === "0x") return null;

  return data;
}