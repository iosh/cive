import {
  http,
  type Address,
  type DeployContractErrorType,
  type Hash,
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptReturnType,
  createPublicClient,
  createWalletClient,
  custom,
} from 'cive'
import { testnet } from 'cive/chains'
import { useCallback, useState } from 'react'
import 'cive/window'
import contract from './contract'

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

  const deployContract = useCallback(async () => {
    if (!account) {
      return
    }
    setError('')
    try {
      const hash = await walletClient.deployContract({
        account,
        abi: contract.abi,
        bytecode: contract.bytecode,
      })
      setHash(hash)
      client
        .waitForTransactionReceipt({ hash, retryCount: 11 })
        .then((receipt) => {
          setReceipt(receipt)
        })
        .catch((e: unknown) => {
          const err = e as WaitForTransactionReceiptErrorType

          setError(err.name)
        })
    } catch (error: unknown) {
      const err = error as DeployContractErrorType
      setError(err.name)
    }
  }, [account])

  return (
    <div className="box">
      {account ? (
        <div className="columns is-3 is-flex-direction-column">
          <div className="column">
            <span className="is-size-5">Account: {account}</span>
          </div>

          <div className="column">
            <button className="button" onClick={deployContract}>
              deployContract
            </button>
          </div>

          {hash && (
            <div className="column">
              <p className="is-size-5">Transaction hash: {hash}</p>
            </div>
          )}
          {hash && !receipt && (
            <div className="column">
              <p className="is-size-5">Waiting for transaction receipt...</p>
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
  )
}
