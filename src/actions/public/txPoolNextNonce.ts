import { Chain, Transport } from "viem";
import { Address } from "../../accounts/types.js";
import { Client } from "../../clients/createClient.js";

export type TxPoolNextNonceParameters = {
  address: Address;
};

export type TxPoolNextNonceReturnType = number;

export async function txPoolNextNonce<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address }: TxPoolNextNonceParameters
): Promise<TxPoolNextNonceReturnType> {
  const nonce = await client.request({
    method: "txpool_nextNonce",
    params: [address],
  });
  return Number(nonce);
}
