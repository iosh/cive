import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom/client'

import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'




function Example() {
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

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>,
)
