
export type FeeValue<TQuantity = bigint> = {
    gasLimit: TQuantity
    gasUsed: TQuantity
    storageCollateralized: TQuantity
}