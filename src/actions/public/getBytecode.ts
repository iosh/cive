import type { EpochTag } from "../../types/block";
import {
  numberToHex,
  type Chain,
  type Hex,
  type NumberToHexErrorType,
  type Transport,
} from "viem";
import type { RequestErrorType } from "viem/utils";
import type { ErrorType } from "../../errors/utils";
import type { Client } from "../../clients/createClient";
import type { Address } from "../../accounts/types";

export type GetBytecodeParameters = {
  address: Address;
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

export type GetBytecodeReturnType = Hex | undefined;

export type GetBytecodeErrorType =
  | NumberToHexErrorType
  | RequestErrorType
  | ErrorType;

export async function getBytecode<TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { address, epochNumber, epochTag = "latest_state" }: GetBytecodeParameters
): Promise<GetBytecodeReturnType> {
  const _epochNumber = epochNumber ? numberToHex(epochNumber) : undefined;

  const hex = await client.request({
    method: "cfx_getCode",
    params: [address, _epochNumber || epochTag],
  });
  if (hex === "0x") return undefined;
  return hex;
}
