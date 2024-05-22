import {
  numberToHex,
  type Chain,
  type NumberToHexErrorType,
  type Transport,
} from "viem";
import type { Block, EpochTag } from "../../types/block";
import type { Client } from "../../clients/createClient";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";
import { formatBlock } from "../../utils/formatters/block";

export type GetSkippedBlocksByEpochParameters =
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

export type GetSkippedBlocksByEpochReturnType = Block[];
export type GetSkippedBlocksByEpochErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function getSkippedBlocksByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = "latest_state" }: GetSkippedBlocksByEpochParameters
): Promise<GetSkippedBlocksByEpochReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const blocks = await client.request({
    method: "cfx_getSkippedBlocksByEpoch",
    params: [_epochNumber || epochTag],
  });

  const format = client.chain?.formatters?.block?.format || formatBlock;

  return blocks.map((block) => format(block));
}
