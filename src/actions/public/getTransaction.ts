import {
  TransactionNotFoundError,
  formatTransaction,
  type Chain,
  type Hash,
  type Transport,
} from "viem";
import type { Client } from "../../clients/createClient";
import type { Prettify } from "../../types/utils";
import type { FormattedTransaction } from "../../utils/formatters/transaction";

export type GetTransactionParameters = {
  hash: Hash;
};

export type GetTransactionReturnType<
  TChain extends Chain | undefined = undefined
> = Prettify<FormattedTransaction<TChain>>;

export async function getTransaction<TChain extends Chain>(
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
