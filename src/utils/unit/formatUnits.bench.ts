import { bench, describe } from "vitest";

import { formatUnits } from "./formatUnits.js";

describe("Format Unit", () => {
  bench("viem: `formatUnits`", () => {
    formatUnits(40000000000000000000n, 18);
  });
});
