export async function signTransaction<
  serializer extends Ser<TransactionSerializable> = SerializeTransactionFn<TransactionSerializable>,
  transaction extends Parameters<serializer>[0] = Parameters<serializer>[0]
>(
  parameters: SignTransactionParameters<serializer, transaction>
): Promise<SignTransactionReturnType<serializer, transaction>> {
  const {
    privateKey,
    transaction,
    serializer = serializeTransaction,
  } = parameters;

  const signableTransaction = (() => {
    // For EIP-4844 Transactions, we want to sign the transaction payload body (tx_payload_body) without the sidecars (ie. without the network wrapper).
    // See: https://github.com/ethereum/EIPs/blob/e00f4daa66bd56e2dbd5f1d36d09fd613811a48b/EIPS/eip-4844.md#networking
    if (transaction.type === "eip4844")
      return {
        ...transaction,
        sidecars: false,
      };
    return transaction;
  })();

  const signature = await sign({
    hash: keccak256(serializer(signableTransaction)),
    privateKey,
  });
  return serializer(transaction, signature) as SignTransactionReturnType<
    serializer,
    transaction
  >;
}
