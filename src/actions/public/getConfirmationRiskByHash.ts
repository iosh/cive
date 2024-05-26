import type { Chain, Hash, Transport } from "viem";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";
import type { Client } from "../../clients/createClient.js";

export type GetConfirmationRiskByHashParameters = {
  blockHash: Hash;
};

export type GetConfirmationRiskByHashReturnType = BigInt | undefined;

export type GetConfirmationRiskByHashErrorType = RequestErrorType | ErrorType;

export async function getConfirmationRiskByHash<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>,
  { blockHash }: GetConfirmationRiskByHashParameters
): Promise<GetConfirmationRiskByHashReturnType> {
  const confirmationRisk = await client.request({
    method: "cfx_getConfirmationRiskByHash",
    params: [blockHash],
  });

  if (confirmationRisk) {
    return BigInt(confirmationRisk);
  }
  return undefined;
}
