import { Transport } from "viem";
import { Chain } from "../../types/chain.js";
import { Account } from "../../accounts/types.js";
import { Client } from "../createClient.js";
import { clearTxpool } from "../../actions/localNode/clearTxpool.js";

export type LocalNodeActions = {
  abc: () => Promise<void>;
};

export function localNodeActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
>(client: Client<TTransport, TChain, TAccount>): LocalNodeActions {
  return {
    abc: () => clearTxpool(client),
  };
}
