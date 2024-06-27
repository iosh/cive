import type {
  AccountPending,
  AccountPendingTransaction,
} from '../../types/account.js'
import type {
  RpcAccountPending,
  RpcAccountPendingTransaction,
} from '../../types/rpc.js'
import type { ExactPartial } from '../../types/utils.js'
import { formatTransaction } from './transaction.js'

export function formatAccountPending(
  accountPending: ExactPartial<RpcAccountPending>,
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
  } as AccountPending

  return result
}

export function formatAccountPendingTransaction(
  accountPendingTransaction: ExactPartial<RpcAccountPendingTransaction>,
): AccountPendingTransaction {
  const result = {
    ...accountPendingTransaction,
    pendingCount: accountPendingTransaction.pendingCount
      ? BigInt(accountPendingTransaction.pendingCount)
      : undefined,
    pendingTransactions: accountPendingTransaction.pendingTransactions
      ? accountPendingTransaction.pendingTransactions.map(formatTransaction)
      : undefined,
  } as AccountPendingTransaction

  return result
}
