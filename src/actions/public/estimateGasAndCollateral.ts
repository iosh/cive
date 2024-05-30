import { Chain, Transport, numberToHex } from "viem";
import {
  FormattedTransactionRequest,
  formatTransactionRequest,
} from "../../utils/formatters/transactionRequest.js";
import { UnionOmit } from "../../types/utils.js";
import { Address } from "../../accounts/types.js";
import { EpochTag } from "../../types/block.js";
import { FeeValue } from "../../types/fee.js";
import { Client } from "../../clients/createClient.js";
import { parseAccount } from "../../accounts/utils/parseAccount.js";
import { formatFee } from "../../utils/formatters/fee.js";

export type FormattedCall<
  TChain extends Chain | undefined = Chain | undefined
> = FormattedTransactionRequest<TChain>;
export type EstimateGasAndCollateralParameters<
  TChain extends Chain | undefined = Chain | undefined
> = UnionOmit<FormattedCall<TChain>, "from"> & {
  account?: Address | Address | undefined;
  batch?: boolean | undefined;
} & (
    | {
        /**
         * @default 'latest_state'
         */
        epochTag?: EpochTag | undefined;
        epochNumber?: never | undefined;
      }
    | {
        epochTag?: never | undefined;
        epochNumber?: bigint | undefined;
      }
  );

export type EstimateGasAndCollateralReturnType = FeeValue;

export async function estimateGasAndCollateral<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>,
  args: EstimateGasAndCollateralParameters<TChain>
): Promise<EstimateGasAndCollateralReturnType> {
  const {
    account: account_ = client.account,
    batch = Boolean(client.batch?.multicall),
    epochNumber,
    epochTag = "latest_state",
    data,
    gas,
    gasPrice,
    storageLimit,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    ...rest
  } = args;
  const account = account_ ? parseAccount(account_) : undefined;

  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const epoch = _epochNumber || epochTag;

  const chainFormat = client.chain?.formatters?.transactionRequest?.format;
  const format = chainFormat || formatTransactionRequest;

  const request = format({
    ...rest,
    from: account?.address,
    data,
    gas,
    gasPrice,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value,
    storageLimit,
  });

  const result = await client.request({
    method: "cfx_estimateGasAndCollateral",
    params: [request, epoch],
  });

  return formatFee(result);
}
