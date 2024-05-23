import type { AccountPending } from "../../types/account";
import type { RpcAccountPending } from "../../types/rpc";
import type { ExactPartial } from "../../types/utils";

export function formatAccountPending(
  accountPending: ExactPartial<RpcAccountPending>
): AccountPending {
  const result = {
    ...accountPending,
    localNonce: accountPending.localNonce
      ? BigInt(accountPending.localNonce)
      : undefined,
    pendingNonce: accountPending.pendingNonce
      ? BigInt(accountPending.pendingNonce)
      : undefined,
    pendingCount: accountPending.pendingCount
      ? BigInt(accountPending.pendingCount)
      : undefined,
    nextPendingTx: accountPending.nextPendingTx
      ? BigInt(accountPending.nextPendingTx)
      : undefined,
  } as AccountPending;

  return result;
}
