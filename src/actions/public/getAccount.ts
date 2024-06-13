import type { EpochNumber, EpochTag } from "../../types/block.js";
import type { ChainAccount } from "../../types/chainAccount.js";
import { numberToHex, type Transport } from "viem";
import { formatChainAccount } from "../../utils/formatters/chainAccount.js";
import type { Client } from "../../clients/createClient.js";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";
import type { Address } from "../../accounts/types.js";
import { Chain } from "../../types/chain.js";

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
      epochNumber?: EpochNumber | undefined;
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
