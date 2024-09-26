import {
  http,
  type Address,
  type Hash,
  type SimulateContractErrorType,
  type SimulateContractReturnType,
  type WaitForTransactionReceiptErrorType,
  type WaitForTransactionReceiptReturnType,
  createPublicClient,
  createWalletClient,
  custom,
  parseUnits,
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
  const [mint, setMint] =
    useState<
      SimulateContractReturnType<
        (typeof contract)['abi'],
        'mint',
        [Address, bigint]
      >
    >()
  const [approve, setApprove] =
    useState<
      SimulateContractReturnType<
        (typeof contract)['abi'],
        'approve',
        [Address, bigint]
      >
    >()
  const [error, setError] = useState<string>()

  const connect = useCallback(async () => {
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
  }, [])

  const handleSimulateMint = useCallback(async () => {
    setError('')
    if (!account) return
    try {
      const result = await client.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'mint',
        args: [account, parseUnits('1', 18)],
      })
      setMint(result)
    } catch (e: unknown) {
      const err = e as SimulateContractErrorType

      setError(err.name)
    }
  }, [account])

  const handleSimulateApprove = useCallback(async () => {
    setError('')
    if (!account) return
    try {
      const result = await client.simulateContract({
        account,
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'approve',
        args: [account, parseUnits('1', 18)],
      })
      setApprove(result)
    } catch (e: unknown) {
      const err = e as SimulateContractErrorType
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
              <div className="is-flex is-flex-direction-column is-align-items-center">
                <button className="button" onClick={handleSimulateMint}>
                  Simulate Mint
                </button>
                <span className="is-size-5">Result: {`${mint?.result}`}</span>

                {mint?.request && (
                  <div>
                    <p className="is-size-5">Simulate Mint request:</p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Key</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mint?.request &&
                          Object.entries(mint?.request).map(
                            ([key, value], idx) => (
                              <tr key={key}>
                                <td>{idx}</td>
                                <td>{key}</td>
                                <td>{`${value}`}</td>
                              </tr>
                            ),
                          )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="column">
              <div className="is-flex is-flex-direction-column is-align-items-center">
                <button className="button" onClick={handleSimulateApprove}>
                  Simulate Approve
                </button>

                <span className="is-size-5">
                  Result: {`${approve?.result}`}
                </span>
                <p className="is-size-5">
                  you can use the simulateContract to get the contract's return
                  value
                </p>

                {approve?.request && (
                  <div>
                    <p className="is-size-5">Simulate Approve request:</p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Key</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approve?.request &&
                          Object.entries(approve?.request).map(
                            ([key, value], idx) => (
                              <tr key={key}>
                                <td>{idx}</td>
                                <td>{key}</td>
                                <td>{`${value}`}</td>
                              </tr>
                            ),
                          )}
                      </tbody>
                    </table>
                    <p className="is-size-5">
                      you can use the request to call writeContract function
                    </p>
                  </div>
                )}
              </div>
            </div>

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
