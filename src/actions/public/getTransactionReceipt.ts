import {
  TransactionReceiptNotFoundError,
  type Chain,
  type ExtractChainFormatterReturnType,
  type Hash,
  type TransactionReceiptNotFoundErrorType,
  type Transport,
} from "viem";
import type { RpcTransactionReceipt } from "../../types/rpc";
import type { TransactionReceipt } from "../../types/transaction";
import type { ExactPartial } from "../../types/utils";
import { formatLog } from "../../utils/formatters/log";
import {
  formatTransactionReceipt,
  type FormattedTransactionReceipt,
} from "../../utils/formatters/transactionReceipt";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";
import type { Client } from "../../clients/createClient";

export type GetTransactionReceiptParameters = {
  hash: Hash;
};

export type GetTransactionReceiptReturnType<
  TChain extends Chain | undefined = undefined
> = FormattedTransactionReceipt<TChain>;

export type GetTransactionReceiptErrorType =
  | RequestErrorType
  | TransactionReceiptNotFoundErrorType
  | ErrorType;

export async function getTransactionReceipt<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { hash }: GetTransactionReceiptParameters
) {
  const receipt = await client.request({
    method: "cfx_getTransactionReceipt",
    params: [hash],
  });

  if (!receipt) throw new TransactionReceiptNotFoundError({ hash });

  const format =
    client.chain?.formatters?.transactionReceipt?.format ||
    formatTransactionReceipt;
  return format(receipt) as GetTransactionReceiptReturnType<TChain>;
}
