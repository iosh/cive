import { FeeValue } from "../../types/fee.js";
import { RpcFeeValue } from "../../types/rpc.js";
import { ExactPartial } from "../../types/utils.js";

export function formatFee(fee: ExactPartial<RpcFeeValue>): FeeValue {
  const result = {
    ...fee,
    gasLimit: fee.gasLimit ? BigInt(fee.gasLimit) : undefined,
    gasUsed: fee.gasUsed ? BigInt(fee.gasUsed) : undefined,
    storageCollateralized: fee.storageCollateralized
      ? BigInt(fee.storageCollateralized)
      : undefined,
  } as FeeValue;
  return result;
}
