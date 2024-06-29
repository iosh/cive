import type { Transport } from 'viem'
import type { Account } from '../../accounts/types.js'
import { clearTxpool } from '../../actions/localNode/clearTxpool.js'
import {
  type CreateLocalNodeAccountParameters,
  type CreateLocalNodeAccountReturnType,
  createLocalNodeAccount,
} from '../../actions/localNode/createLocalNodeAccount.js'
import {
  type GenerateEmptyLocalNodeBlocksParameters,
  type GenerateEmptyLocalNodeBlocksReturnType,
  generateEmptyLocalNodeBlocks,
} from '../../actions/localNode/generateEmptyLocalNodeBlocks.js'
import {
  type GenerateLocalNodeBlockParameters,
  type GenerateLocalNodeBlockReturnTYpe,
  generateLocalNodeBlock,
} from '../../actions/localNode/generateLocalNodeBlock.js'
import {
  type GetLocalNodeAddressesReturnType,
  getLocalNodeAddresses,
} from '../../actions/localNode/getLocalNodeAddresses.js'
import {
  type LockLocalNodeAccountParameters,
  type LockLocalNodeAccountReturnType,
  lockLocalNodeAccount,
} from '../../actions/localNode/lockLocalNodeAccount.js'
import {
  type UnlockLocalNodeAccountParameters,
  type UnlockLocalNodeAccountReturnType,
  unlockLocalNodeAccount,
} from '../../actions/localNode/unlockLocalNodeAccount.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'

export type LocalNodeActions = {
  clearTxpool: () => Promise<void>
  getLocalNodeAddresses: () => Promise<GetLocalNodeAddressesReturnType>
  createLocalNodeAccount: (
    args: CreateLocalNodeAccountParameters,
  ) => Promise<CreateLocalNodeAccountReturnType>
  unlockLocalNodeAccount: (
    args: UnlockLocalNodeAccountParameters,
  ) => Promise<UnlockLocalNodeAccountReturnType>
  lockLocalNodeAccount: (
    args: LockLocalNodeAccountParameters,
  ) => Promise<LockLocalNodeAccountReturnType>
  generateLocalNodeBlock: (
    args: GenerateLocalNodeBlockParameters,
  ) => Promise<GenerateLocalNodeBlockReturnTYpe>
  generateEmptyLocalNodeBlocks: (
    args: GenerateEmptyLocalNodeBlocksParameters,
  ) => Promise<GenerateEmptyLocalNodeBlocksReturnType>
}

export function localNodeActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
>(client: Client<TTransport, TChain, TAccount>): LocalNodeActions {
  return {
    clearTxpool: () => clearTxpool(client),
    getLocalNodeAddresses: () => getLocalNodeAddresses(client),
    createLocalNodeAccount: (args) => createLocalNodeAccount(client, args),
    unlockLocalNodeAccount: (args) => unlockLocalNodeAccount(client, args),
    lockLocalNodeAccount: (args) => lockLocalNodeAccount(client, args),
    generateLocalNodeBlock: (args) => generateLocalNodeBlock(client, args),
    generateEmptyLocalNodeBlocks: (args) =>
      generateEmptyLocalNodeBlocks(client, args),
  }
}
