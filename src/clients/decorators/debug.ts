import { Transport } from "viem";
import { Chain } from "../../types/chain.js";
import { Account, Address } from "../../accounts/types.js";
import { Client } from "../createClient.js";
import { clearTxpool } from "../../actions/debug/clrearTxpool.js";

export type DebugActions = {
  clearTxpool: () => Promise<void>;
};

export function debugActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account<Address> | undefined = Account<Address> | undefined
>(client: Client<TTransport, TChain, TAccount>): DebugActions {
  return {
    clearTxpool: () => clearTxpool(client),
  };
}
