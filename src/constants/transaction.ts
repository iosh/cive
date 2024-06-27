import { concatHex, stringToHex } from 'viem'

export const legacyTransactionTypes = stringToHex('cfx')

/**
 * toRLP(concatHex([transaction2930Type, .....]))
 */
export const rlpTransaction2930Type = concatHex([stringToHex('cfx'), '0x01'])
/**
 * toRLP(concatHex([transaction1559Type, .....]))
 */
export const rlpTransaction1559Type = concatHex([stringToHex('cfx'), '0x02'])

/**
 * The gas for to user transaction
 */
export const transactionGas = 21000n

/**
 * The storage limit for to user transaction
 */
export const transactionStorageLimit = 0n
