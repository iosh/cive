import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'
import { useCallback, useState } from 'react'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
export default function App() {
  const [epochNumber, setEpochNumber] = useState('')

  const handleClick = useCallback(async () => {
    const epochNumber = await client.getEpochNumber()
    setEpochNumber(`${epochNumber}`)
  }, [])

  return (
    <div className="box">
      <div className="columns is-3 ">
        <div className="column">
          <button className="button" onClick={handleClick}>
            Get current epoch number
          </button>
          <span className="is-size-5">{epochNumber}</span>
        </div>
      </div>
    </div>
  )
}
