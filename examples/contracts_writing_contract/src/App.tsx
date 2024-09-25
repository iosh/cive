import {
  http,
  createPublicClient,
  createWalletClient,
  custom,
  Address,
  Hash,
  WaitForTransactionReceiptReturnType,
  WaitForTransactionReceiptErrorType,
  SimulateContractErrorType,
} from 'cive'
import { mainnet, testnet } from 'cive/chains'
import { useCallback, useState } from 'react'
import 'cive/window'
import contract from './contract'

const CONTRACT_ADDRESS = 'cfxtest:acfrcwu7yn4ysjybux326my6a743zw2zwjps5had1g'

const client = createPublicClient({
  chain: testnet,
  transport: http(),
})
const walletClient = createWalletClient({
  chain: testnet,
  transport: custom(window.fluent!),
})
export default function App() {
  const [account, setAccount] = useState<Address>()
  const [hash, setHash] = useState<Hash>()
  const [receipt, setReceipt] = useState<WaitForTransactionReceiptReturnType>()
  const [error, setError] = useState<string>()

  const connect = useCallback(async () => {
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
  }, [])

  const mint = useCallback(async () => {
    setError('')
    if (!account) return
    try {
      const { request } = await client.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'mint',
        args: [account, 1n * 10n ** 18n],
      })
      // writeContract before simulateContract first
      const hash = await walletClient.writeContract(request)
      setHash(hash)

      client
        .waitForTransactionReceipt({ hash, retryCount: 11 })
        .then((receipt) => {
          setReceipt(receipt)
        })
    } catch (e: unknown) {
      const err = e as
        | WaitForTransactionReceiptErrorType
        | SimulateContractErrorType

      setError(err.name)
    }
  }, [account])

  return (
    <div className="box">
      <div className="column">
        {account ? (
          <div className="columns is-3 is-flex-direction-column">
            <span>Account: {account}</span>
            <div className="column">
              <div className="is-flex is-align-items-center">
                <button className="button" onClick={mint}>
                  Mint to self
                </button>
                <span className="is-size-5">result: </span>
              </div>
            </div>
            <div className="column">
              <div className="is-flex is-align-items-center">
                <span className="is-size-5">
                  {hash ? `transaction hash : ${hash}` : ''}
                </span>
              </div>
            </div>

            {hash && (
              <div className="column">
                <div className="is-flex is-align-items-center">
                  <span className="is-size-5">
                    wait for transaction receipt
                  </span>
                </div>
              </div>
            )}

            {receipt && (
              <div>
                <p className="is-size-5">Transaction receipt:</p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Key</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt &&
                      Object.entries(receipt).map(([key, value], idx) => (
                        <tr key={key}>
                          <td>{idx}</td>
                          <td>{key}</td>
                          <td>{`${value}`}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {error && (
              <div className="column">
                <p>Error: {error}</p>
              </div>
            )}
          </div>
        ) : (
          <button className="button" onClick={connect}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  )
}
