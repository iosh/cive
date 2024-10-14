import {
  http,
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
} from 'cive'
import { testnet } from 'cive/chains'
import { useCallback, useState } from 'react'
import contract from './contract'

const CONTRACT_ADDRESS = 'cfxtest:acfrcwu7yn4ysjybux326my6a743zw2zwjps5had1g'
const client = createPublicClient({
  chain: testnet,
  transport: http(),
})
export default function App() {
  const [tokenName, setTokenName] = useState('')

  const handleGetTokenName = useCallback(async () => {
    const { data } = await client.call({
      to: CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: contract.abi,
        functionName: 'name',
      }),
    })
    setTokenName(
      data
        ? decodeFunctionResult({
            abi: contract.abi,
            functionName: 'name',
            data,
            networkId: testnet.id,
          })
        : '',
    )
  }, [])

  return (
    <div className="box">
      <div className="columns is-3 ">
        <div className="column">
          <button className="button" onClick={handleGetTokenName}>
            Get token name by call
          </button>
          <span className="is-size-5">{tokenName}</span>
        </div>
      </div>
    </div>
  )
}
