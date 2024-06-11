import { Hex, keccak256 } from "viem";
import { sign } from "./sign.js";
import {
  SerializeTransactionFn,
  serializeTransaction,
} from "../../utils/transaction/serializeTransaction.js";
import {
  TransactionSerializable,
  TransactionSerialized,
} from "../../types/transaction.js";
import { GetTransactionType } from "../../utils/transaction/getTransactionType.js";

export type SignTransactionParameters<
  serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
> = {
  privateKey: Hex;
  transaction: transaction;
  serializer?: serializer | undefined;
};

export type SignTransactionReturnType<
  serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
> = TransactionSerialized<GetTransactionType<transaction>>;

export async function signTransaction<
  serializer extends SerializeTransactionFn<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
>(
  parameters: SignTransactionParameters<serializer, transaction>
): Promise<SignTransactionReturnType<serializer, transaction>> {
  const {
    privateKey,
    transaction,
    serializer = serializeTransaction,
  } = parameters;

  const signature = await sign({
    hash: keccak256(serializer(transaction)),
    privateKey,
  });
  return serializer(transaction, signature) as SignTransactionReturnType<
    serializer,
    transaction
  >;
}
