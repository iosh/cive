import type { Account } from '../../accounts/types.js'
import {
  type GetCurrentSyncPhaseReturnType,
  getCurrentSyncPhase,
} from '../../actions/index.js'
import { clearTxpool } from '../../actions/test/clearTxpool.js'
import {
  type CreateLocalNodeAccountParameters,
  type CreateLocalNodeAccountReturnType,
  createLocalNodeAccount,
} from '../../actions/test/createLocalNodeAccount.js'
import {
  type GenerateEmptyLocalNodeBlocksParameters,
  type GenerateEmptyLocalNodeBlocksReturnType,
  generateEmptyLocalNodeBlocks,
} from '../../actions/test/generateEmptyLocalNodeBlocks.js'
import {
  type GenerateLocalNodeBlockParameters,
  type GenerateLocalNodeBlockReturnTYpe,
  generateLocalNodeBlock,
} from '../../actions/test/generateLocalNodeBlock.js'
import {
  type GetLocalNodeAddressesReturnType,
  getLocalNodeAddresses,
} from '../../actions/test/getLocalNodeAddresses.js'
import {
  type LockLocalNodeAccountParameters,
  type LockLocalNodeAccountReturnType,
  lockLocalNodeAccount,
} from '../../actions/test/lockLocalNodeAccount.js'
import { type MineParameters, mine } from '../../actions/test/mine.js'
import {
  type UnlockLocalNodeAccountParameters,
  type UnlockLocalNodeAccountReturnType,
  unlockLocalNodeAccount,
} from '../../actions/test/unlockLocalNodeAccount.js'
import type { Chain } from '../../types/chain.js'
import type { Client } from '../createClient.js'
import type { Transport } from '../transports/createTransport.js'

export type TestActions = {
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
  mine: (args: MineParameters) => Promise<void>
  getCurrentSyncPhase: () => Promise<GetCurrentSyncPhaseReturnType>
}

export function testActions<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
>(client: Client<TTransport, TChain, TAccount>): TestActions {
  return {
    clearTxpool: () => clearTxpool(client),
    getLocalNodeAddresses: () => getLocalNodeAddresses(client),
    createLocalNodeAccount: (args) => createLocalNodeAccount(client, args),
    unlockLocalNodeAccount: (args) => unlockLocalNodeAccount(client, args),
    lockLocalNodeAccount: (args) => lockLocalNodeAccount(client, args),
    generateLocalNodeBlock: (args) => generateLocalNodeBlock(client, args),
    generateEmptyLocalNodeBlocks: (args) =>
      generateEmptyLocalNodeBlocks(client, args),
    mine: (args) => mine(client, args),
    getCurrentSyncPhase: () => getCurrentSyncPhase(client),
  }
}
