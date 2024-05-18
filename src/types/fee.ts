
export type FeeValueLegacy<TQuantity = bigint> = {
    gasLimit: TQuantity
    gasUsed: TQuantity
    storageCollateralized: TQuantity
}