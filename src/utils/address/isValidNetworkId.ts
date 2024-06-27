export const NET_ID_LIMIT = 0xffffffff

export function isValidNetworkId(networkId: string | number) {
  if (typeof networkId === 'string') {
    return /^([1-9]\d*)$/.test(networkId) && Number(networkId) <= NET_ID_LIMIT
  }
  return networkId > 0 && networkId < NET_ID_LIMIT
}
