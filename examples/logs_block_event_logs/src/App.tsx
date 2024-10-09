import { http, createPublicClient } from 'cive'
import { mainnet } from 'cive/chains'
import { useCallback, useState } from 'react'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})
export default function App() {
  const [logs, setLogs] = useState('')

  const handleClick = useCallback(async () => {
    const epochNumber = await client.getEpochNumber()
    const logs = await client.getLogs({
      fromEpoch: epochNumber - 10n,
      toEpoch: epochNumber,
    })
    setLogs(
      JSON.stringify(
        logs,
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
        2,
      ),
    )
  }, [])

  const handleGetLogsWithEvent = useCallback(async () => {
    const epochNumber = await client.getEpochNumber()
    const logs = await client.getLogs({
      fromEpoch: epochNumber - 50n,
      toEpoch: epochNumber,
      events: [
        {
          inputs: [
            {
              indexed: true,
              name: 'from',
              type: 'address',
            },
            {
              indexed: true,
              name: 'to',
              type: 'address',
            },
            {
              indexed: false,
              name: 'value',
              type: 'uint256',
            },
          ],
          name: 'Transfer',
          type: 'event',
        },
      ] as const,
    })
    setLogs(
      JSON.stringify(
        logs,
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
        2,
      ),
    )
  }, [])

  return (
    <div className="box">
      <div className="columns is-3 ">
        <div className="column">
          <button className="button" onClick={handleClick}>
            Get 10 epoch logs
          </button>

          <button className="button" onClick={handleGetLogsWithEvent}>
            Get Transfer event logs by 50 epoch
          </button>
          <pre className="is-size-5">
            <code>{logs}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
