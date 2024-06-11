import { concatHex, stringToHex } from "viem";

export const legacyTransactionTypes = stringToHex("cfx");

/**
 * toRLP(concatHex([transaction2930Type, .....]))
 */
export const rlpTransaction2930Type = concatHex([stringToHex("cfx"), "0x01"]);
/**
 * toRLP(concatHex([transaction1559Type, .....]))
 */
export const rlpTransaction1559Type = concatHex([stringToHex("cfx"), "0x02"]);
