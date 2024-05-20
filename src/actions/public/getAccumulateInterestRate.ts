import { numberToHex, type Chain, type Transport } from "viem";
import type { EpochTag } from "../../types/block";
import type { Client } from "../../clients/createClient";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetAccumulateInterestRateParameters =
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
    };

export type GetAccumulateInterestRateReturnType = bigint;
export type GetAccumulateInterestRateErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getAccumulateInterestRate<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    epochNumber,
    epochTag = "latest_state",
  }: GetAccumulateInterestRateParameters
): Promise<GetAccumulateInterestRateReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const result = await client.request({
    method: "cfx_getAccumulateInterestRate",
    params: [_epochNumber || epochTag],
  });

  return BigInt(result);
}
