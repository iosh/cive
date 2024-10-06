import { http, createPublicClient } from 'cive'
import { testnet } from 'cive/chains'
import { useCallback, useState } from 'react'
import contract from './contract'
const CONTRACT_ADDRESS = 'cfxtest:acfrcwu7yn4ysjybux326my6a743zw2zwjps5had1g'

const client = createPublicClient({
  chain: testnet,
  transport: http(),
})

const clientBatch = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: testnet,
  transport: http(),
})

export default function App() {
  const [multicallResult, setMulticallResult] =
    useState<
      Record<
        string,
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
        | {
            error?: undefined
            result: string | bigint
            status: 'success'
          }
      >
    >()
  const [batchResult, setBatchResult] =
    useState<Record<string, string | BigInt>>()

  const handleMulticallAction = useCallback(async () => {
    const block = await client.getBlock()
    const [name, symbol, totalSupply, balance] = await client.multicall({
      epochNumber: block.epochNumber,
      contracts: [
        {
          address: CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'name',
        },
        {
          address: CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'symbol',
        },
        {
          address: CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'totalSupply',
        },
        {
          address: CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'balanceOf',
          args: [CONTRACT_ADDRESS],
        },
      ],
    })
    setMulticallResult({
      name,
      symbol,
      totalSupply,
      balance,
    })
  }, [])

  const handleMulticallClientCall = useCallback(async () => {
    const [name, symbol, totalSupply, balance] = await Promise.all([
      clientBatch.readContract({
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'name',
      }),
      clientBatch.readContract({
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'symbol',
      }),
      clientBatch.readContract({
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'totalSupply',
      }),
      clientBatch.readContract({
        address: CONTRACT_ADDRESS,
        abi: contract.abi,
        functionName: 'balanceOf',
        args: [CONTRACT_ADDRESS],
      }),
    ])

    setBatchResult({
      name,
      symbol,
      totalSupply,
      balance,
    })
  }, [])

  return (
    <div className="box">
      <div className="columns is-3 ">
        <div className="column">
          <button className="button" onClick={handleMulticallAction}>
            multicall action
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>key</th>
                <th>status</th>
                <th>result</th>
              </tr>
            </thead>
            <tbody>
              {multicallResult &&
                Object.entries(multicallResult).map(([key, value], idx) => (
                  <tr key={key}>
                    <td>{idx}</td>
                    <td>{key}</td>
                    <td>{value.status}</td>
                    <td>{value.result?.toString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="column">
          <button className="button" onClick={handleMulticallClientCall}>
            multicall client (batch)
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>key</th>
                <th>result</th>
              </tr>
            </thead>
            <tbody>
              {batchResult &&
                Object.entries(batchResult).map(([key, value], idx) => (
                  <tr key={key}>
                    <td>{idx}</td>
                    <td>{key}</td>

                    <td>{value.toString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
