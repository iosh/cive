import type {
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from '../types/abitype.js'

import type { Prettify } from './utils.js'

export type TypedDataDefinition<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'CIP23Domain' = keyof typedData,
  ///
  primaryTypes = typedData extends TypedData ? keyof typedData : string,
> = primaryType extends 'CIP23Domain'
  ? CIP23DomainDefinition<typedData, primaryType>
  : MessageDefinition<typedData, primaryType, primaryTypes>

type MessageDefinition<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData = keyof typedData,
  ///
  primaryTypes = typedData extends TypedData ? keyof typedData : string,
  schema extends Record<string, unknown> = typedData extends TypedData
    ? TypedDataToPrimitiveTypes<typedData>
    : Record<string, unknown>,
  message = schema[primaryType extends keyof schema
    ? primaryType
    : keyof schema],
> = {
  types: typedData
} & {
  primaryType:
    | primaryTypes // show all values
    | (primaryType extends primaryTypes ? primaryType : never) // infer value
  domain?:
    | (schema extends { CIP23Domain: infer domain }
        ? domain
        : Prettify<TypedDataDomain>)
    | undefined
  message: { [_: string]: any } extends message // Check if message was inferred
    ? Record<string, unknown>
    : message
}

type CIP23DomainDefinition<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends 'CIP23Domain' = 'CIP23Domain',
  ///
  schema extends Record<string, unknown> = typedData extends TypedData
    ? TypedDataToPrimitiveTypes<typedData>
    : Record<string, unknown>,
> = {
  types?: typedData | undefined
} & {
  primaryType: 'CIP23Domain' | primaryType
  domain: schema extends { CIP23Domain: infer domain }
    ? domain
    : Prettify<TypedDataDomain>
  message?: undefined
}
