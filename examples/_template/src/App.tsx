import React, { useCallback, useState } from 'react'
import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'

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
    <div>
      <button onClick={handleClick}>get current epoch number</button>
      <span>{epochNumber}</span>
    </div>
  )
}
