import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'
import { useCallback, useState } from 'react'
import contract from './contract'

const CONFLUX_FANS_COIN = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
export default function App() {
  const [tokenName, setTokenName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [totalSupply, setTotalSupply] = useState(0n)
  const [decimal, setDecimal] = useState(0)
  const [balance, setBalance] = useState(0n)

  const handleGetTokenName = useCallback(async () => {
    const name = await client.readContract({
      address: CONFLUX_FANS_COIN,
      abi: contract.abi,
      functionName: 'name',
    })

    setTokenName(name)
  }, [])

  const handleGetTokenSymbol = useCallback(async () => {
    const symbol = await client.readContract({
      address: CONFLUX_FANS_COIN,
      abi: contract.abi,
      functionName: 'symbol',
    })
    setSymbol(symbol)
  }, [])

  const handleGetTokenTotalSupply = useCallback(async () => {
    const totalSupply = await client.readContract({
      address: CONFLUX_FANS_COIN,
      abi: contract.abi,
      functionName: 'totalSupply',
    })
    setTotalSupply(totalSupply)
  }, [])

  const handleGetTokenDecimal = useCallback(async () => {
    const decimal = await client.readContract({
      address: CONFLUX_FANS_COIN,
      abi: contract.abi,
      functionName: 'decimals',
    })
    setDecimal(decimal)
  }, [])

  const handleGetBalance = useCallback(async () => {
    const balance = await client.readContract({
      address: CONFLUX_FANS_COIN,
      abi: contract.abi,
      functionName: 'balanceOf',
      args: [CONFLUX_FANS_COIN],
    })
    setBalance(balance)
  }, [])
  return (
    <div className="box">
      <div className="column">
        <div className="is-flex is-align-items-center">
          <button className="button" onClick={handleGetTokenName}>
            Read Token Name
          </button>
          <span className="is-size-5">Name: {tokenName}</span>
        </div>
      </div>

      <div className="column">
        <div className="is-flex is-align-items-center">
          <button className="button" onClick={handleGetTokenSymbol}>
            Read Token Symbol
          </button>
          <span className="is-size-5">Symbol: {symbol}</span>
        </div>
      </div>

      <div className="column">
        <div className="is-flex is-align-items-center">
          <button className="button" onClick={handleGetTokenTotalSupply}>
            Read Token Symbol
          </button>
          <span className="is-size-5">TotalSupply: {`${totalSupply}`}</span>
        </div>
      </div>

      <div className="column">
        <div className="is-flex is-align-items-center">
          <button className="button" onClick={handleGetTokenDecimal}>
            Read Token decimal
          </button>
          <span className="is-size-5">Decimal: {`${decimal}`}</span>
        </div>
      </div>
      <div className="column">
        <div className="is-flex is-align-items-center">
          <button className="button" onClick={handleGetBalance}>
            Read Token balance
          </button>
          <span className="is-size-5">Balance: {`${balance}`}</span>
        </div>
      </div>
    </div>
  )
}
