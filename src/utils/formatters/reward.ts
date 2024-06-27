import type { Reward } from '../../types/reward.js'
import type { RpcReward } from '../../types/rpc.js'
import type { ExactPartial } from '../../types/utils.js'

export function formatReward(reward: ExactPartial<RpcReward>): Reward {
  const result = {
    ...reward,
    totalReward: reward.totalReward ? BigInt(reward.totalReward) : undefined,
    baseReward: reward.baseReward ? BigInt(reward.baseReward) : undefined,
    txFee: reward.txFee ? Number(reward.txFee) : undefined,
  } as Reward

  return result
}
