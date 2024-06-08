import { bench } from "vitest";
import { hexAddressToBase32 } from "./hexAddressToBase32.js";
import { MAIN_NETWORK_ID } from "../network/networkId.js";
import { encode } from "@conflux-dev/conflux-address-js";

bench("hexAddressToBase32", () => {
  const hexAddress = "1a2f80341409639ea6a35bbcab8299066109aa55";
  hexAddressToBase32({
    hexAddress: `0x${hexAddress}`,
    networkId: MAIN_NETWORK_ID,
  });
});
bench("conflux-address-js", () => {
  const hexAddress = "1a2f80341409639ea6a35bbcab8299066109aa55";
  const hexBuffer = Buffer.from(hexAddress, "hex");
  encode(hexBuffer, MAIN_NETWORK_ID);
});
