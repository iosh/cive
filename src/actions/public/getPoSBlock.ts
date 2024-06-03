import { Chain, Hash, Transport, numberToHex } from "viem";
import { PoSBlock } from "../../types/pos.js";
import { Client } from "../../clients/createClient.js";
import { formatPoSBlock } from "../../utils/formatters/pos.js";
import { BlockNotFoundError } from "../../errors/block.js";

export type GetPoSBlockParameters = {
  blockHash: Hash;
};

export type GetPosBlockReturnType = PoSBlock;

export async function getPoSBlock<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { blockHash }: GetPoSBlockParameters
): Promise<GetPosBlockReturnType> {
  const result = await client.request({
    method: "pos_getBlockByHash",
    params: [blockHash],
  });

  if (!result) {
    throw new BlockNotFoundError({ blockHash: undefined });
  }

  return formatPoSBlock(result);
}
