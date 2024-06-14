import { Hash, Transport } from "viem";
import { Client } from "../../clients/createClient.js";
import { Chain } from "../../types/chain.js";
import { TransactionSerializedGeneric } from "../../types/transaction.js";
import { RequestErrorType } from "viem/utils";
import { ErrorType } from "../../errors/utils.js";

export type SendRawTransactionParameters = {
  /** The signed serialized tranasction. */
  serializedTransaction: TransactionSerializedGeneric;
};

export type SendRawTransactionReturnType = Hash;

export type SendRawTransactionErrorType = RequestErrorType | ErrorType;

export async function sendRawTransaction<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { serializedTransaction }: SendRawTransactionParameters
): Promise<SendRawTransactionReturnType> {
  return client.request(
    {
      method: "cfx_sendRawTransaction",
      params: [serializedTransaction],
    },
    { retryCount: 0 }
  );
}
