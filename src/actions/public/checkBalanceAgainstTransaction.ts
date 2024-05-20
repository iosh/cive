import type { Address } from "abitype";
import type { EpochTag } from "../../types/block";
import type { NumberToHexErrorType, RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";
import type { Client } from "../../clients/createClient";
import { numberToHex, type Chain, type Transport } from "viem";
export type CheckBalanceAgainstTransactionParameters = {
  accountAddress: Address;
  contractAddress: Address;
  gasLimit: number;
  gasPrice: number;
  storageLimit: number;
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

export type CheckBalanceAgainstTransactionReturnType = {
  isBalanceEnough: boolean;
  willPayCollateral: boolean;
  willPayTxFee: boolean;
};

export type CheckBalanceAgainstTransactionErrorType =
  | RequestErrorType
  | NumberToHexErrorType
  | ErrorType;

export async function checkBalanceAgainstTransaction<
  TChain extends Chain | undefined
>(
  client: Client<Transport, TChain>,
  {
    accountAddress,
    contractAddress,
    gasLimit,
    gasPrice,
    storageLimit,
    epochTag = "latest_state",
    epochNumber,
  }: CheckBalanceAgainstTransactionParameters
): Promise<CheckBalanceAgainstTransactionReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;
  const result = await client.request({
    method: "cfx_checkBalanceAgainstTransaction",
    params: [
      accountAddress,
      contractAddress,
      numberToHex(gasLimit),
      numberToHex(gasPrice),
      numberToHex(storageLimit),
      _epochNumber || epochTag,
    ],
  });

  return result;
}
