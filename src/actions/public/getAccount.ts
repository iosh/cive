import type { Address } from "abitype";
import type { EpochTag } from "../../types/block";
import type { ChainAccount } from "../../types/chainAccount";
import { numberToHex, type Chain, type Transport } from "viem";
import { formatChainAccount } from "../../utils/formatters/chainAccount";
import type { Client } from "../../clients/createClient";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetChainAccountParameters = {
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

export type GetChainAccountReturnType = ChainAccount;

export type GetChainAccountErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getAccount<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetChainAccountParameters
) {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const result = await client.request({
    method: "cfx_getAccount",
    params: [address, _epochNumber || epochTag],
  });

  return formatChainAccount(result);
}
