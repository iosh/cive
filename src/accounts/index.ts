import { generateMnemonic, generatePrivateKey } from "viem/accounts";
import type {
  PrivateKeyToAccountErrorType,
  GeneratePrivateKeyErrorType,
} from "viem/accounts";

export { HDKey } from "@scure/bip32";
export { wordlist as czech } from "@scure/bip39/wordlists/czech";
export { wordlist as english } from "@scure/bip39/wordlists/english";
export { wordlist as french } from "@scure/bip39/wordlists/french";
export { wordlist as italian } from "@scure/bip39/wordlists/italian";
export { wordlist as japanese } from "@scure/bip39/wordlists/japanese";
export { wordlist as korean } from "@scure/bip39/wordlists/korean";
export { wordlist as simplifiedChinese } from "@scure/bip39/wordlists/simplified-chinese";
export { wordlist as spanish } from "@scure/bip39/wordlists/spanish";
export { wordlist as traditionalChinese } from "@scure/bip39/wordlists/traditional-chinese";

export { generateMnemonic, type GeneratePrivateKeyErrorType };

export { generatePrivateKey, type PrivateKeyToAccountErrorType };