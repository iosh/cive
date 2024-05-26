import { numberToHex, type Chain, type Hash, type Transport } from "viem";
import type { Block, EpochNumber } from "../../types/block.js";
import type { Client } from "../../clients/createClient.js";
import { formatBlock } from "../../utils/formatters/block.js";

export type GetBlockByHashWithPivotAssumptionParameters = {
  blockHash: Hash;
  assumedPivotHash: Hash;
  epochNumber: EpochNumber;
};

export type GetBlockByHashWithPivotAssumptionReturnType = Block;

export async function getBlockByHashWithPivotAssumption<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>,
  {
    blockHash,
    assumedPivotHash,
    epochNumber,
  }: GetBlockByHashWithPivotAssumptionParameters
): Promise<GetBlockByHashWithPivotAssumptionReturnType> {
  const _epochNumber = numberToHex(epochNumber);

  const result = await client.request({
    method: "cfx_getBlockByHashWithPivotAssumption",
    params: [blockHash, assumedPivotHash, _epochNumber],
  });

  const format = client.chain?.formatters?.block?.format || formatBlock;

  return format(result);
}
