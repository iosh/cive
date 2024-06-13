import {
  TransactionNotFoundError,
  type Hash,
  type NumberToHexErrorType,
  type Transport,
} from "viem";
import type { Client } from "../../clients/createClient.js";
import type { Prettify } from "../../types/utils.js";
import {
  formatTransaction,
  type FormattedTransaction,
} from "../../utils/formatters/transaction.js";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils.js";
import { Chain } from "../../types/chain.js";

export type GetTransactionParameters = {
  hash: Hash;
};

export type GetTransactionReturnType<TChain extends Chain | undefined> =
  Prettify<FormattedTransaction<TChain>>;

export type GetTransactionErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

export async function getTransaction<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { hash }: GetTransactionParameters
): Promise<GetTransactionReturnType<TChain>> {
  const transaction = await client.request({
    method: "cfx_getTransactionByHash",
    params: [hash],
  });

  if (!transaction) {
    throw new TransactionNotFoundError({
      hash,
    });
  }

  const format =
    client.chain?.formatters?.transaction?.format || formatTransaction;

  return format(transaction);
}
