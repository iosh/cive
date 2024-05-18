import type { Address } from "abitype";
import type { EpochTag } from "../../types/block";
import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetNextNonceParameters = {
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

export type GetNextNonceReturnType = bigint;

export type GetNextNonceErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getNextNonce<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetNextNonceParameters
): Promise<GetNextNonceReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const nonce = await client.request({
    method: "cfx_getNextNonce",
    params: [address, _epochNumber || epochTag],
  });
  return BigInt(nonce);
}
