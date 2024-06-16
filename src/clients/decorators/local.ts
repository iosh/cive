import { Transport } from "viem";
import { Chain } from "../../types/chain.js";
import { Account } from "../../accounts/types.js";
import { Client } from "../createClient.js";
import { clearTxpool } from "../../actions/localNode/clearTxpool.js";
import {
  GetAddressesLocalNodeReturnType,
  getAddressesLocalNode,
} from "../../actions/localNode/getAccountsFromLocal.js";

export type LocalNodeActions = {
  clearTxpool: () => Promise<void>;
  getAddressesLocalNode: () => Promise<GetAddressesLocalNodeReturnType>;
};

export function localNodeActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
>(client: Client<TTransport, TChain, TAccount>): LocalNodeActions {
  return {
    clearTxpool: () => clearTxpool(client),
    getAddressesLocalNode: () => getAddressesLocalNode(client),
  };
}
