import type { Transport } from 'viem'
import type { LocalNodeClient } from '../../clients/createLocalClient.js'
import { deferredStateEpochCount } from '../../constants/epoch.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { getAction } from '../../utils/getAction.js'
import { wait } from '../../utils/wait.js'
import { getBastBlockHash } from '../public/getBastBlockHash.js'
import { generateEmptyLocalNodeBlocks } from './generateEmptyLocalNodeBlocks.js'
import { generateLocalNodeBlock } from './generateLocalNodeBlock.js'

export type MineParameters =
  | {
      numTxs?: number
      blockSizeLimit?: number
    }
  | {
      blocks: number
    }

export async function mine<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: LocalNodeClient<Transport, TChain, TAccount, false>,
  parameters: MineParameters = {},
) {
  if ('blocks' in parameters) {
    const { blocks } = parameters
    const generateBlocks = getAction(
      client,
      generateEmptyLocalNodeBlocks,
      'generateEmptyLocalNodeBlocks',
    )
    await generateBlocks({ numBlocks: blocks })
  } else {
    const { numTxs = 1, blockSizeLimit = 20480 } = parameters
    const generateOneBlock = getAction(
      client,
      generateLocalNodeBlock,
      'generateLocalNodeBlock',
    )
    const baseBlock = getAction(client, getBastBlockHash, 'getBastBlockHash')
    for (let i = 0; i < deferredStateEpochCount; i++) {
      const generatedHash = await generateOneBlock({
        numTxs,
        blockSizeLimit,
      })
      while (true) {
        const hash = await baseBlock({})
        if (hash !== generatedHash) {
          await wait(10)
        } else {
          break
        }
      }
    }
  }
}
