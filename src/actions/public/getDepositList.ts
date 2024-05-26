import type { EpochTag } from "../../types/block.js";
import type { Deposit } from "../../types/deposit.js";
import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import { formatDeposit } from "../../utils/formatters/deposit.js";
import type { Address } from "../../accounts/types.js";

export type GetDepositListParameters = {
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

export type GetDepositListReturnType = Deposit[];

export async function getDepositList<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetDepositListParameters
): Promise<GetDepositListReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const result = await client.request({
    method: "cfx_getDepositList",
    params: [address, _epochNumber || epochTag],
  });
  return result.map(formatDeposit);
}
