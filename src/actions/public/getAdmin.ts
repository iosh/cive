import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import type { EpochTag } from "../../types/block";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";
import type { Address } from "../../accounts/types";

export type GetAdminParameters = {
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

export type GetAdminReturnType = Address | null;

export type GetAdminErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getAdmin<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetAdminParameters
): Promise<GetAdminReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const adminAddress = await client.request({
    method: "cfx_getAdmin",
    params: [address, _epochNumber || epochTag],
  });

  return adminAddress;
}
