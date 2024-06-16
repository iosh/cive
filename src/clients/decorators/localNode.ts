import { Transport } from "viem";
import { Chain } from "../../types/chain.js";
import { Account } from "../../accounts/types.js";
import { Client } from "../createClient.js";
import { clearTxpool } from "../../actions/localNode/clearTxpool.js";
import {
  GetLocalNodeAddressesReturnType,
  getLocalNodeAddresses,
} from "../../actions/localNode/getLocalNodeAddresses.js";

export type LocalNodeActions = {
  clearTxpool: () => Promise<void>;
  getLocalNodeAddresses: () => Promise<GetLocalNodeAddressesReturnType>;
};

export function localNodeActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
>(client: Client<TTransport, TChain, TAccount>): LocalNodeActions {
  return {
    clearTxpool: () => clearTxpool(client),
    getLocalNodeAddresses: () => getLocalNodeAddresses(client),
  };
}
