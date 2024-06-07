import { confluxCoreSpace, confluxCoreSpaceTest } from "../../chains/index.js";

export type mainNetworkIdType = typeof MAIN_NETWORK_ID;
export type testNetworkIdType = typeof TEST_NETWORK_ID;

export const MAIN_NETWORK_ID = confluxCoreSpace.id;
export const TEST_NETWORK_ID = confluxCoreSpaceTest.id;
