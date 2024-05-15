import { numberToHex, type Chain, type Hash, type Transport } from "viem";
import type { Account } from "../../accounts/types";
import type { EpochTag } from "../../types/block";
import type { Client } from "../../clients/createClient";
import type { RpcBlock } from "../../types/rpc";
import { BlockNotFoundError } from "../../errors/block";
import { formatBlock, type FormattedBlock } from "../../utils/formatters/block";
import type { Prettify } from "../../types/utils";

export type GetBlockParameters<
  TIncludeTransactions extends boolean = false,
  TEpochTag extends EpochTag = "latest_state"
> =
  | {
      includeTransactions?: TIncludeTransactions | undefined;
    } & (
      | {
          blockHash?: Hash | undefined;
          epochNumber?: never | undefined;
          epochTag?: never | undefined;
        }
      | {
          blockHash?: never | undefined;
          epochNumber?: bigint | undefined;
          epochTag?: never | undefined;
        }
      | {
          blockHash?: never | undefined;
          epochNumber?: never | undefined;
          /**
           * the epoch tag string
           * @default "latest_state"
           */
          epochTag?: TEpochTag | undefined;
        }
    );
export type GetBlockReturnType<
  TChain extends Chain | undefined = undefined,
  TIncludeTransactions extends boolean = false,
  TBlockTag extends EpochTag = "latest_state"
> = Prettify<FormattedBlock<TChain, TIncludeTransactions, TBlockTag>>;

export async function getBlock<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TIncludeTransactions extends boolean = false,
  TEpochTag extends EpochTag = "latest_state"
>(
  client: Client<Transport, TChain, TAccount>,
  {
    blockHash,
    epochNumber,
    epochTag,
    includeTransactions,
  }: GetBlockParameters<TIncludeTransactions, TEpochTag> = {}
): Promise<GetBlockReturnType<TChain, TIncludeTransactions, TEpochTag>> {
  const _epochTag = epochTag ?? "latest_state";
  const _includeTransactions = includeTransactions ?? false;

  const epochNumberHex =
    typeof epochNumber !== "undefined" ? numberToHex(epochNumber) : undefined;

  let block: RpcBlock | null = null;

  if (blockHash) {
    block = await client.request({
      method: "cfx_getBlockByHash",
      params: [blockHash, _includeTransactions],
    });
  } else {
    block = await client.request({
      method: "cfx_getBlockByEpochNumber",
      params: [epochNumberHex || _epochTag, _includeTransactions],
    });
  }
  if (!block) throw new BlockNotFoundError({ blockHash, epochNumber });

  const format = client.chain?.formatters?.block?.format || formatBlock;
  return format(block);
}
