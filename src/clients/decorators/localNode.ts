import { Transport } from "viem";
import { Chain } from "../../types/chain.js";
import { Account } from "../../accounts/types.js";
import { Client } from "../createClient.js";
import { clearTxpool } from "../../actions/localNode/clearTxpool.js";
import {
  GetLocalNodeAddressesReturnType,
  getLocalNodeAddresses,
} from "../../actions/localNode/getLocalNodeAddresses.js";
import {
  CreateLocalNodeAccountParameters,
  CreateLocalNodeAccountReturnType,
  createLocalNodeAccount,
} from "../../actions/localNode/createLocalNodeAccount.js";
import {
  UnlockLocalNodeAccountParameters,
  UnlockLocalNodeAccountReturnType,
  unlockLocalNodeAccount,
} from "../../actions/localNode/UnlockLocalNodeAccount.js";
import {
  LockLocalNodeAccountParameters,
  LockLocalNodeAccountReturnType,
  lockLocalNodeAccount,
} from "../../actions/localNode/LockLocalNodeAccount.js";
import {
  GenerateLocalNodeBlockParameters,
  GenerateLocalNodeBlockReturnTYpe,
  generateLocalNodeBlock,
} from "../../actions/localNode/generateLocalNodeBlock.js";

export type LocalNodeActions = {
  clearTxpool: () => Promise<void>;
  getLocalNodeAddresses: () => Promise<GetLocalNodeAddressesReturnType>;
  createLocalNodeAccount: (
    args: CreateLocalNodeAccountParameters
  ) => Promise<CreateLocalNodeAccountReturnType>;
  unlockLocalNodeAccount: (
    args: UnlockLocalNodeAccountParameters
  ) => Promise<UnlockLocalNodeAccountReturnType>;
  lockLocalNodeAccount: (
    args: LockLocalNodeAccountParameters
  ) => Promise<LockLocalNodeAccountReturnType>;
  generateLocalNodeBlock: (
    args: GenerateLocalNodeBlockParameters
  ) => Promise<GenerateLocalNodeBlockReturnTYpe>;
};

export function localNodeActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined
>(client: Client<TTransport, TChain, TAccount>): LocalNodeActions {
  return {
    clearTxpool: () => clearTxpool(client),
    getLocalNodeAddresses: () => getLocalNodeAddresses(client),
    createLocalNodeAccount: (args) => createLocalNodeAccount(client, args),
    unlockLocalNodeAccount: (args) => unlockLocalNodeAccount(client, args),
    lockLocalNodeAccount: (args) => lockLocalNodeAccount(client, args),
    generateLocalNodeBlock: (args) => generateLocalNodeBlock(client, args),
  };
}
