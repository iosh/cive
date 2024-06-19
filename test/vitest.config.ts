import { join } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "@": join(__dirname, "../src"),
    },
    setupFiles: [join(__dirname, './setup.ts')],
  },
});
