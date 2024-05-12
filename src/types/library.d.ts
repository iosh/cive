import { Address as CoreAddress } from "../accounts/types";
declare module 'abitype' {
  export interface Register {
    AddressType: CoreAddress
  }
}