import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import type { Address } from "abitype";
import type { EpochTag } from "../../types/block";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetBalanceParameters = {
  address: Address;
} & (
  | {
      epochTag?: EpochTag | undefined;
      epochNumber?: never | undefined;
    }
  | {
      epochTag?: never | undefined;
      epochNumber?: bigint | undefined;
    }
);

export type GetBalanceReturnType = bigint;

export type GetBalanceErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getBalance<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetBalanceParameters
):Promise<GetBalanceReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const balance = await client.request({
    method: "cfx_getBalance",
    params: [address, _epochNumber || epochTag],
  });

  return BigInt(balance);
}
