import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'
import React, { useCallback, useState } from 'react'

export default function App() {
  const [epochNumber, setEpochNumber] = useState('')

  const handleClick = useCallback(async () => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    })

    const epochNumber = await client.getEpochNumber()
    setEpochNumber(`${epochNumber}`)
  }, [])

  return (
    <div className="block">
      <button className="button" onClick={handleClick}>
        Get current epoch number
      </button>
      <span className="is-size-5">{epochNumber}</span>
    </div>
  )
}
