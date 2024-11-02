import type { TestClient } from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { deferredStateEpochCount } from '../../constants/epoch.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { getAction } from '../../utils/getAction.js'
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
  client: TestClient<Transport, TChain, TAccount, false>,
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
    for (let i = 0; i < deferredStateEpochCount; i++) {
      await generateOneBlock({
        numTxs,
        blockSizeLimit,
      })
    }
  }
}
