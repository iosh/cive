import { bench } from "vitest";
import { hexAddressToBase32 } from "./hexAddressToBase32.js";
import { mainNetworkId } from "../../constants/networkId.js";
import { encode } from "@conflux-dev/conflux-address-js";

bench("hexAddressToBase32", () => {
  const hexAddress = "1a2f80341409639ea6a35bbcab8299066109aa55";
  hexAddressToBase32({
    hexAddress: `0x${hexAddress}`,
    networkId: mainNetworkId,
  });
});
bench("conflux-address-js encode", () => {
  const hexAddress = "1a2f80341409639ea6a35bbcab8299066109aa55";
  const hexBuffer = Buffer.from(hexAddress, "hex");
  encode(hexBuffer, mainNetworkId);
});
