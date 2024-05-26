import type { EpochTag } from "../../types/block.js";
import { numberToHex, type Chain, type Hex, type Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import type { Address } from "../../accounts/types.js";

export type GetStorageRootParameters = {
  address: Address;
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

export type GetStorageRootReturnType = {
  data: Hex | null | "TOMBSTONE";
  intermediate: Hex | null | "TOMBSTONE";
  snapshot: Hex | null | "TOMBSTONE";
};

export async function GetStorageRoot<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetStorageRootParameters
): Promise<GetStorageRootReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const data = await client.request({
    method: "cfx_getStorageRoot",
    params: [address, _epochNumber || epochTag],
  });

  return data;
}
