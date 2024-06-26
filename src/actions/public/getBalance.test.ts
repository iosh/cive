import { afterAll, beforeAll, expect, test } from "vitest";
import { accounts } from "~test/src/conflux/accounts.js";
import { devConflux } from "~test/src/conflux/client.js";
import { getBalance } from "./getBalance.js";

const sourceAccount = accounts[0];
const targetAccount = accounts[1];
const client = devConflux.getClient();
beforeAll(async () => {
  await devConflux.start();
});

afterAll(async () => {
  await devConflux.stop();
});

test("gets balance", async () => {
  expect(
    await getBalance(client, { address: sourceAccount.base32Address })
  ).toBe(10000000000000000000000n);
});
