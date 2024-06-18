import { Transport, numberToHex } from "viem";
import { LocalNodeClient } from "../../clients/createLocalClient.js";
import { Chain } from "../../types/chain.js";
import { Hash } from "../../types/misc.js";
import { Account } from "../../accounts/types.js";

export type GenerateLocalNodeBlockParameters = {
  numTxs: number;
  blockSizeLimit: number;
};

export type GenerateLocalNodeBlockReturnTYpe = Hash;

export async function generateLocalNodeBlock<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  { numTxs, blockSizeLimit }: GenerateLocalNodeBlockParameters
): Promise<GenerateLocalNodeBlockReturnTYpe> {
  const _numTsx = numberToHex(numTxs);
  const _blockSizeLimit = numberToHex(blockSizeLimit);
  const result = await client.request({
    method: "generateoneblock",
    params: [_numTsx, _blockSizeLimit],
  });
  return result;
}
