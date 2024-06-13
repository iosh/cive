import type { EpochNumber, EpochTag } from "../../types/block.js";
import { numberToHex, type Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";
import type { Address } from "../../accounts/types.js";
import { Chain } from "../../types/chain.js";

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
      epochNumber?: EpochNumber | undefined;
    }
);

export type GetNextNonceReturnType = number;

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
  return Number(nonce);
}
