import { test, expect, describe } from "vitest";

import { encode } from "@conflux-dev/conflux-address-js";
import { hexAddressToBase32 } from "./hexAddressToBase32.js";
import { MAIN_NETWORK_ID, TEST_NETWORK_ID } from "../network/networkId.js";

const addresses = [
  "0xe7c45500C993103B6f55d1f80b98C951EdA35B3c",
  "0x2C18737B0901849d3aDC9dD92AEaBedf9C6EEc25",
  "0x0FDf5E3A8146F4165aBcF949C4713EaC3D4712a5",
  "0x6a0fc446fd645dEe880FB370Eba2d827A419BC04",
  "0xa78f85F6CDc0312Ffc1ac858e934e08ed71303f7",
  "0xF363F107a1348317c126c4D20eaFC19E60F6DE9A",
  "0x2143652f0e4C9df53427330f2d917e459CD12074",
  "0x11Cee6dA09794B73241FaE0ef801EAA4124bdE4b",
  "0x95027Bc93834F3Dc0AEbF308bffA4b6Fe7DB1338",
  "0x514223831c1a0E55Dc04455F14D0424F6C7A8147",
  "0x6c9f5773AFd16A907ca5c664809B972872CA3362",
  "0xE9b3fC5800650941636cf46e6A3A0cF59F885920",
  "0xF4E17e5435C99826CB2D37Bbe0E1bCFdee58e807",
  "0xb4b0eD95b7060242B6968e0C001756a1e53629c9",
] as const;

describe("cover hex address to base32", () => {
  test("user address and main network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const userHexAddress = `1${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(userHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: MAIN_NETWORK_ID,
          addressType: "user",
        })
      ).toEqual(encode(hexBuffer, MAIN_NETWORK_ID));
    }
  });

  test("user address and test network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const userHexAddress = `1${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(userHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: TEST_NETWORK_ID,
          addressType: "user",
        })
      ).toEqual(encode(hexBuffer, TEST_NETWORK_ID));
    }
  });

  test("contract address and main network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const contractHexAddress = `8${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(contractHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: MAIN_NETWORK_ID,
          addressType: "contract",
        })
      ).toEqual(encode(hexBuffer, MAIN_NETWORK_ID));
    }
  });

  test("contract address and test network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const contractHexAddress = `8${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(contractHexAddress, "hex");

      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: TEST_NETWORK_ID,
          addressType: "contract",
        })
      ).toEqual(encode(hexBuffer, TEST_NETWORK_ID));
    }
  });
});

describe("cover hex address to base32 with verbose", () => {
  test("user address and main network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const userHexAddress = `1${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(userHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: MAIN_NETWORK_ID,
          addressType: "user",
          verbose: true,
        })
      ).toEqual(encode(hexBuffer, MAIN_NETWORK_ID, true));
    }
  });

  test("user address and test network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const userHexAddress = `1${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(userHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: TEST_NETWORK_ID,
          addressType: "user",
          verbose: true,
        })
      ).toEqual(encode(hexBuffer, TEST_NETWORK_ID, true));
    }
  });

  test("contract address and main network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const contractHexAddress = `8${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(contractHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: MAIN_NETWORK_ID,
          addressType: "contract",
          verbose: true,
        })
      ).toEqual(encode(hexBuffer, MAIN_NETWORK_ID, true));
    }
  });
  test("contract address and test network", () => {
    for (let index = 0; index < addresses.length; index++) {
      const hexAddress = addresses[index];
      const contractHexAddress = `8${hexAddress.slice(3)}`;
      const hexBuffer = Buffer.from(contractHexAddress, "hex");
      expect(
        hexAddressToBase32({
          hexAddress: hexAddress,
          networkId: TEST_NETWORK_ID,
          addressType: "contract",
          verbose: true,
        })
      ).toEqual(encode(hexBuffer, TEST_NETWORK_ID, true));
    }
  });
});
