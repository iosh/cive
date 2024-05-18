import type { Address } from "abitype";
import type { EpochTag } from "../../types/block";
import type { Sponsor } from "../../types/sponsor";
import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import { formatSponsor } from "../../utils/formatters/sponsor";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetSponsorInfoParameters = {
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

export type GetSponsorInfoReturnType = Sponsor;
export type GetSponsorErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function GetSponsorInfo<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetSponsorInfoParameters
): Promise<GetSponsorInfoReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const data = await client.request({
    method: "cfx_getSponsorInfo",
    params: [address, _epochNumber || epochTag],
  });

  return formatSponsor(data);
}
