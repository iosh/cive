import { keccak256, parseEther, parseGwei } from "viem";
import { describe, expect, test } from "vitest";
import { TransactionSerializableBase } from "../../types/transaction.js";
import { serializeTransaction } from "./serializeTransaction.js";
import { Transaction, format } from "js-conflux-sdk";
import { sign } from "../../accounts/utils/sign.js";

const base = {
  to: "cfxtest:aak39z1fdm02v71y33znvaxwthh99skcp2s48zasbp",
  nonce: 785,
  value: parseEther("0"),
  storageLimit: 100,
  epochHeight: 100,
  gas: 21000,
} satisfies TransactionSerializableBase;

describe("legacy", () => {
  const baseLegacy = {
    ...base,
    gasPrice: parseGwei("2"),
    chainId: 1,
    data: "0x",
  } as const;
  test("default", () => {
    const tx = new Transaction({
      ...baseLegacy,
      gasPrice: baseLegacy.gasPrice.toString(),
      value: baseLegacy.value.toString(),
    });
    const encodeData = tx.encode(false);

    const serialized = serializeTransaction(baseLegacy);

    expect(serialized).toEqual(`${format.hex(encodeData)}`);
  });
  test("signed", async () => {
    const signature = await sign({
      hash: keccak256(serializeTransaction(baseLegacy)),
      privateKey:
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    });
    const serialized = serializeTransaction(baseLegacy, signature);
    const tx = new Transaction({
      ...baseLegacy,
      gasPrice: baseLegacy.gasPrice.toString(),
      value: baseLegacy.value.toString(),
      data: "0x",
    });
    tx.sign(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      1
    );
    const encodeData = tx.encode(true);

    expect(serialized).toEqual(format.hex(encodeData));
  });
});
