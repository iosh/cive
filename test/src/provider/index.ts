import type {
  EIP1193Provider,
  EIP1193RequestFn,
  EIP1474Methods,
} from '~cive/types/eip1193.js'
import { accounts } from '../constants.js'

const request: EIP1193RequestFn<EIP1474Methods> = async ({
  method,
  params,
}) => {
  if (method === 'cfx_accounts' || method === 'cfx_requestAccounts') {
    return accounts.map(({ base32Address }) => base32Address)
  }

  return undefined as any
}

export const provider: EIP1193Provider = {
  request,
  on() {
    return () => {}
  },
  removeListener: () => {},
}
