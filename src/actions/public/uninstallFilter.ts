import { RequestErrorType } from "viem/utils";
import { Filter } from "../../types/filter.js";
import { ErrorType } from "../../errors/utils.js";
import { Chain, Transport } from "viem";
import { Client } from "../../clients/createClient.js";

export type UninstallFilterParameters = {
  filter: Filter<any>;
};
export type UninstallFilterReturnType = boolean;

export type UninstallFilterErrorType = RequestErrorType | ErrorType;

export async function uninstallFilter<TChain extends Chain | undefined>(
  _client: Client<Transport, TChain>,
  { filter }: UninstallFilterParameters
): Promise<UninstallFilterReturnType> {
  return filter.request({
    method: "cfx_uninstallFilter",
    params: [filter.id],
  });
}
