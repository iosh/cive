import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import type { EpochNumber, EpochTag } from "../../types/block.js";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";
import type { Address } from "../../accounts/types.js";

export type GetCollateralForStorageParameters = {
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
      epochNumber?: EpochNumber | undefined;
    }
);

export type GetCollateralForStorageReturnType = bigint;

export type GetCollateralForStorageErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getCollateralForStorage<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetCollateralForStorageParameters
):Promise<GetCollateralForStorageReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const collateralForStorage = await client.request({
    method: "cfx_getCollateralForStorage",
    params: [address, _epochNumber || epochTag],
  });

  return BigInt(collateralForStorage);
}
