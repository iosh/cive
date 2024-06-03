import { Chain, Transport, numberToHex } from "viem";
import { PoSCommittee } from "../../types/pos.js";
import { Client } from "../../clients/createClient.js";
import { formatPoSCommittee } from "../../utils/formatters/pos.js";

export type GetPosCommitteeParameters = {
  blockNumber?: bigint;
};

export type GetPosCommitteeReturnType = PoSCommittee;

export async function getPosCommittee<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { blockNumber }: GetPosCommitteeParameters
): Promise<GetPosCommitteeReturnType> {
  const result = await client.request({
    method: "pos_getCommittee",
    params: blockNumber ? [numberToHex(blockNumber)] : [],
  });
  return formatPoSCommittee(result);
}
