import { numberToHex, type Chain, type Hash, type Transport } from "viem";
import type { Client } from "../../clients/createClient";
import type { EpochTag } from "../../types/block";
import type { RpcEpochNumber } from "../../types/rpc";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";

export type GetBlocksByEpochParameters = {} & (
  | {
      epochNumber?: bigint;
      epochTag?: never | undefined;
    }
  | {
      epochNumber?: never | undefined;
      epochTag?: EpochTag;
    }
);

export type GetBlocksByEpochReturnType = Hash[];

export type GetBlocksByEpochErrorType = RequestErrorType | NumberToHexErrorType | ErrorType;

export async function getBlocksByEpoch<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { epochNumber, epochTag = "latest_state" }: GetBlocksByEpochParameters
): Promise<GetBlocksByEpochReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const blockHashes = await client.request({
    method: "cfx_getBlocksByEpoch",
    params: [_epochNumber || epochTag],
  });

  return blockHashes;
}
