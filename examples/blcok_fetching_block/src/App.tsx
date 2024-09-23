import {
  http,
  type Chain,
  type GetBlockReturnType,
  createPublicClient,
} from 'cive'
import { mainnet } from 'cive/chains'
import React, { useCallback, useMemo, useState } from 'react'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export default function App() {
  const [block, setBlock] =
    useState<
      GetBlockReturnType<
        Chain,
        false,
        | 'latest_mined'
        | 'latest_state'
        | 'latest_confirmed'
        | 'latest_checkpoint'
        | 'earliest'
      >
    >()
  const [type, setType] = useState<string>()

  const handleGetBlockByHash = useCallback(async () => {
    const block = await client.getBlock({
      blockHash:
        '0xf6cec5af1ee95f56038fc30589bcfeb4b960075c3c76b8a0eaa6d36e8e623b50',
    })
    setBlock(block)
    setType(
      'Get block by hash: 0xf6cec5af1ee95f56038fc30589bcfeb4b960075c3c76b8a0eaa6d36e8e623b50',
    )
  }, [])

  const handleGetBlockByEpochTag = useCallback(
    async (
      epochTag:
        | 'latest_mined'
        | 'latest_state'
        | 'latest_confirmed'
        | 'latest_checkpoint'
        | 'earliest',
    ) => {
      const block = await client.getBlock({
        epochTag: epochTag,
      })
      setBlock(block)
      setType(`Get block by ${epochTag}`)
    },
    [],
  )

  const handleGetBlockByBlockNumber = useCallback(async () => {
    const block = await client.getBlock({
      blockNumber: 100n,
    })
    setBlock(block)
    setType('Get block by block number: 100')
  }, [])

  const handleGetBlockByEpochNumber = useCallback(async () => {
    const block = await client.getBlock({
      epochNumber: 10n,
    })
    setBlock(block)
    setType('Get block by epoch number: 10')
  }, [])

  return (
    <div className="box">
      <div className="columns is-3 is-flex-direction-column">
        <div className="column">
          <button className="button" onClick={handleGetBlockByHash}>
            Get Block by Hash
            (0xf6cec5af1ee95f56038fc30589bcfeb4b960075c3c76b8a0eaa6d36e8e623b50)
          </button>
        </div>

        <div className="column">
          <div className="fixed-grid">
            <div className="grid">
              <button
                className="button call"
                onClick={() => handleGetBlockByEpochTag('latest_mined')}
              >
                Get Block by epoch tag : latest_mined
              </button>

              <button
                className="button call"
                onClick={() => handleGetBlockByEpochTag('earliest')}
              >
                Get Block by epoch tag : earliest
              </button>

              <button
                className="button call"
                onClick={() => handleGetBlockByEpochTag('latest_checkpoint')}
              >
                Get Block by epoch tag : latest_checkpoint
              </button>

              <button
                className="button call"
                onClick={() => handleGetBlockByEpochTag('latest_confirmed')}
              >
                Get Block by epoch tag : latest_confirmed
              </button>

              <button
                className="button call"
                onClick={() => handleGetBlockByEpochTag('latest_state')}
              >
                Get Block by epoch tag : latest_state
              </button>
            </div>
          </div>
        </div>

        <p className="column is-size-5">
          Block number and epoch number is different in conflux core space
        </p>
        <div className="column">
          <button className="button" onClick={handleGetBlockByBlockNumber}>
            Get Block by block number (100)
          </button>
        </div>

        <div className="column">
          <button className="button" onClick={handleGetBlockByEpochNumber}>
            Get Block by epoch number (10)
          </button>
        </div>
        <div className="column">
          {block && (
            <div className="block">
              <p className="is-size-5">{type}</p>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {block &&
                    Object.entries(block).map(([key, value], idx) => (
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
        </div>
      </div>
    </div>
  )
}
