;import type { EpochTag } from "../../types/block.js";
import type { Vote } from "../../types/vote.js";
import { numberToHex, type Chain, type Transport } from "viem";
import type { Client } from "../../clients/createClient.js";
import { formatVote } from "../../utils/formatters/vote.js";
import type { Address } from "../../accounts/types.js";

export type GetVoteListParameters = {
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

export type GetVoteListReturnType = Vote[];

export async function getVoteList<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetVoteListParameters
): Promise<GetVoteListReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const result = await client.request({
    method: "cfx_getVoteList",
    params: [address, _epochNumber || epochTag],
  });
  return result.map(formatVote);
}
