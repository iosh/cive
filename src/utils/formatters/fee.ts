import type { GasAndCollateral } from '../../types/fee.js'
import type { RpcGasAndCollateral } from '../../types/rpc.js'
import type { ExactPartial } from '../../types/utils.js'

export function formatFee(
  fee: ExactPartial<RpcGasAndCollateral>,
): GasAndCollateral {
  const result = {
    ...fee,
    gasLimit: fee.gasLimit ? BigInt(fee.gasLimit) : undefined,
    gasUsed: fee.gasUsed ? BigInt(fee.gasUsed) : undefined,
    storageCollateralized: fee.storageCollateralized
      ? BigInt(fee.storageCollateralized)
      : undefined,
  } as GasAndCollateral
  return result
}
