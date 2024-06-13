import { numberToHex, type Hash, type Transport } from "viem";
import type { Account } from "../../accounts/types.js";
import type { EpochNumber, EpochTag } from "../../types/block.js";
import type { Client } from "../../clients/createClient.js";
import type { RpcBlock } from "../../types/rpc.js";
import { BlockNotFoundError } from "../../errors/block.js";
import { formatBlock, type FormattedBlock } from "../../utils/formatters/block.js";
import type { Prettify } from "../../types/utils.js";
import { Chain } from "../../types/chain.js";

export type GetBlockParameters<
  TIncludeTransactions extends boolean = false,
  TEpochTag extends EpochTag = "latest_state"
> =
  | {
      includeTransactions?: TIncludeTransactions | undefined;
    } & (
      | {
          blockHash?: Hash | undefined;
          blockNumber?: never | undefined;
          epochNumber?: never | undefined;
          epochTag?: never | undefined;
        }
      | {
          blockHash?: never | undefined;
          blockNumber?: number;
          epochNumber?: never | undefined;
          epochTag?: never | undefined;
        }
      | {
          blockHash?: never | undefined;
          blockNumber?: never | undefined;
          epochNumber?: EpochNumber | undefined;
          epochTag?: never | undefined;
        }
      | {
          blockHash?: never | undefined;
          blockNumber?: never | undefined;
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
    blockNumber,
    epochNumber,
    epochTag,
    includeTransactions,
  }: GetBlockParameters<TIncludeTransactions, TEpochTag> = {}
): Promise<GetBlockReturnType<TChain, TIncludeTransactions, TEpochTag>> {
  const _blockNumber = blockNumber ? numberToHex(blockNumber) : undefined;
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
  } else if (_blockNumber) {
    block = await client.request({
      method: "cfx_getBlockByBlockNumber",
      params: [_blockNumber, _includeTransactions],
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
