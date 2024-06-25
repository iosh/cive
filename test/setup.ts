import { recreateNode } from "./src/conflux/docker.js";
import { afterAll, beforeAll, beforeEach, vi } from "vitest";

beforeAll(async () => {
  await recreateNode();
});
