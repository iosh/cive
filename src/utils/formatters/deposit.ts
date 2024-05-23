import type { Deposit } from "../../types/deposit";
import type { RpcDeposit } from "../../types/rpc";
import type { ExactPartial } from "../../types/utils";

export function formatDeposit(deposit: ExactPartial<RpcDeposit>): Deposit {
  const result = {
    ...deposit,
    accumulatedInterestRate: deposit.accumulatedInterestRate
      ? BigInt(deposit.accumulatedInterestRate)
      : undefined,
    amount: deposit.amount ? BigInt(deposit.amount) : undefined,
    depositTime: deposit.depositTime ? Number(deposit.depositTime) : undefined,
  } as Deposit;

  return result;
}
