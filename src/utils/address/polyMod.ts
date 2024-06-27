const BIGINT_0 = 0n // BigInt(0);
const BIGINT_1 = 1n //BigInt(1);
const BIGINT_5 = 5n //BigInt(5);
const BIGINT_35 = 35n //BigInt(35);
const BIGINT_0B00001 = 1n //BigInt(1);
const BIGINT_0B00010 = 2n // BigInt(2);
const BIGINT_0B00100 = 4n // BigInt(4);
const BIGINT_0B01000 = 8n // BigInt(8);
const BIGINT_0B10000 = 16n // BigInt(16);
const BIGINT_0X07FFFFFFFF = 34359738367n // BigInt(0x07ffffffff);
const BIGINT_0X98F2BC8E61 = 656907472481n // BigInt(0x98f2bc8e61)
const BIGINT_0X79B76D99E2 = 522768456162n // BigInt(0x79b76d99e2);
const BIGINT_0XF33E5FB3C4 = 1044723512260n // BigInt(0xf33e5fb3c4);
const BIGINT_0XAE2EABE2A8 = 748107326120n // BigInt(0xae2eabe2a8);
const BIGINT_0X1E4F43E470 = 130178868336n // BigInt(0x1e4f43e470);

export function polyMod(buffer: Uint8Array) {
  let checksumBigInt = BIGINT_1

  for (const byte of buffer) {
    // c0 = c >> 35;
    const high = checksumBigInt >> BIGINT_35

    // c = ((c & 0x07ffffffff) << 5) ^ d;
    checksumBigInt = (checksumBigInt & BIGINT_0X07FFFFFFFF) << BIGINT_5
    checksumBigInt = byte ? checksumBigInt ^ BigInt(byte) : checksumBigInt // bit ^ 0 = bit

    if ((high & BIGINT_0B00001) !== BIGINT_0) {
      checksumBigInt = checksumBigInt ^ BIGINT_0X98F2BC8E61
    }

    if ((high & BIGINT_0B00010) !== BIGINT_0) {
      checksumBigInt = checksumBigInt ^ BIGINT_0X79B76D99E2
    }

    if ((high & BIGINT_0B00100) !== BIGINT_0) {
      checksumBigInt = checksumBigInt ^ BIGINT_0XF33E5FB3C4
    }

    if ((high & BIGINT_0B01000) !== BIGINT_0) {
      checksumBigInt = checksumBigInt ^ BIGINT_0XAE2EABE2A8
    }

    if ((high & BIGINT_0B10000) !== BIGINT_0) {
      checksumBigInt = checksumBigInt ^ BIGINT_0X1E4F43E470
    }
  }

  return checksumBigInt ^ BIGINT_1
}
