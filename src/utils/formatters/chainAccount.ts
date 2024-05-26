import type { ChainAccount } from "../../types/chainAccount.js";
import type { RpcChainAccount } from "../../types/rpc.js";
import type { ExactPartial } from "../../types/utils.js";

export function formatChainAccount(
  chainAccount: ExactPartial<RpcChainAccount>
) {
  const result = {
    ...chainAccount,
    balance: chainAccount.balance ? BigInt(chainAccount.balance) : undefined,
    nonce: chainAccount.nonce ? BigInt(chainAccount.nonce) : undefined,
    codeHash: chainAccount.codeHash ? chainAccount.codeHash : undefined,
    stakingBalance: chainAccount.stakingBalance
      ? BigInt(chainAccount.stakingBalance)
      : undefined,
    collateralForStorage: chainAccount.collateralForStorage
      ? BigInt(chainAccount.collateralForStorage)
      : undefined,
    accumulatedInterestReturn: chainAccount.accumulatedInterestReturn
      ? BigInt(chainAccount.accumulatedInterestReturn)
      : undefined,
    admin: chainAccount.admin ? chainAccount.admin : undefined,
  } as ChainAccount;

  return result;
}
