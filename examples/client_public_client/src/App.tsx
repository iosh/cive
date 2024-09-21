import { useCallback, useMemo, useState } from 'react'
import {
  type Chain,
  createPublicClient,
  custom,
  fallback,
  type GetBlockReturnType,
  GetStatusReturnType,
  GetSupplyInfoReturnType,
  http,
  testnet,
  webSocket,
} from 'cive'
import 'cive/window'
export default function App() {
  const [epochNumber, setEpochNumber] = useState('')
  const [block, setBlock] = useState<null | GetBlockReturnType>(null)
  const [version, setVersion] = useState('')
  const [gasPrice, setGasPrice] = useState('')
  const [supplyInfo, setSupplyInfo] = useState<null | GetSupplyInfoReturnType>(
    null,
  )
  const [status, setStatus] = useState<null | GetStatusReturnType>()

  const [currentClient, setCurrentClient] = useState<
    'http' | 'websocket' | 'fallback' | 'custom'
  >('http')

  const handleChangeClient = useCallback(
    (client: 'http' | 'websocket' | 'fallback' | 'custom') => {
      setCurrentClient(client)
    },
    [],
  )
  const httpClient = useMemo(
    () =>
      createPublicClient({
        chain: testnet,
        transport: http(),
      }),
    [],
  )

  const webSocketClient = useMemo(
    () =>
      createPublicClient({
        chain: testnet,
        transport: webSocket(),
      }),
    [],
  )

  const fallbackClient = useMemo(
    () =>
      createPublicClient({
        chain: testnet,
        transport: fallback([
          // the first transport is fake so will fallback to the second
          http('http://fake.example.com'),
          http('https://test.confluxrpc.org'),
          webSocket(),
        ]),
      }),
    [],
  )

  const customClient = useMemo(
    () =>
      createPublicClient({
        chain: testnet,
        transport: custom(window.fluent!),
      }),
    [],
  )

  const client = useMemo(() => {
    if (currentClient === 'websocket') {
      return webSocketClient
    }
    if (currentClient === 'fallback') {
      return fallbackClient
    }
    if (currentClient === 'custom') {
      return customClient
    }
    return httpClient
  }, [currentClient, customClient, fallbackClient, httpClient, webSocketClient])

  // getEpochNumber doc: https://cive.zyx.ee/docs/actions/public/getEpochNumber
  const handleGetEpochNumber = useCallback(async () => {
    const epochNumber = await client.getEpochNumber({
      epochTag: 'latest_mined',
      cacheTime: 0,
    })
    setEpochNumber(`${epochNumber}`)
  }, [client])

  // getBlock doc: https://cive.zyx.ee/docs/actions/public/getBlock
  const handleGetBlock = useCallback(async () => {
    const block = await client.getBlock({
      epochTag: 'latest_state',
    })
    setBlock(block)
  }, [client])

  // getClientVersion doc:https://cive.zyx.ee/docs/actions/public/getClientVersion

  const handleGetVersion = useCallback(async () => {
    const version = await client.getClientVersion()
    setVersion(version)
  }, [client])

  // getGasPrice doc:https://cive.zyx.ee/docs/actions/public/getGasPrice

  const handleGetGasPrice = useCallback(async () => {
    const gasPrice = await client.getGasPrice()
    setGasPrice(gasPrice.toString())
  }, [client])

  // getSupplyInfo doc:https://cive.zyx.ee/docs/actions/public/getSupplyInfo

  const handleGetSupplyInfo = useCallback(async () => {
    const supplyInfo = await client.getSupplyInfo()
    setSupplyInfo(supplyInfo)
  }, [client])

  // getStatus doc:https://cive.zyx.ee/docs/actions/public/getStatus

  const handleGetStatus = useCallback(async () => {
    const status = await client.getStatus()
    setStatus(status)
  }, [client])

  return (
    <div>
      <div className="box ">
        <div className="columns is-3 ">
          <button
            className="column button"
            onClick={() => handleChangeClient('http')}
          >
            HTTP Client
          </button>
          <button
            className="column button"
            onClick={() => handleChangeClient('websocket')}
          >
            WebSocket Client
          </button>
          <button
            className="column button"
            onClick={() => handleChangeClient('fallback')}
          >
            Fallback Client
          </button>
          <button
            className="column button"
            onClick={() => handleChangeClient('custom')}
          >
            Custom Client
          </button>
        </div>

        <p className="title is-4">
          <span className="is-uppercase is-underlined">{currentClient}</span>{' '}
          Transport
        </p>
        <div className="columns is-3 is-flex-direction-column">
          <div className="column">
            <div className="is-flex is-align-items-center">
              <button className="button" onClick={handleGetEpochNumber}>
                Get current epoch number
              </button>
              <span className="is-size-5">{epochNumber}</span>
            </div>
          </div>

          <div className="column">
            <button className="button" onClick={handleGetBlock}>
              Get block
            </button>
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
                      <td>{value.toString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="column">
            <div className="is-flex is-align-items-center">
              <button className="button" onClick={handleGetVersion}>
                Get version
              </button>
              <span className="is-size-5">{version}</span>
            </div>
          </div>

          <div className="column">
            <div className="is-flex is-align-items-center">
              <button className="button" onClick={handleGetGasPrice}>
                Get gasPrice
              </button>
              <span className="is-size-5">{gasPrice}</span>
            </div>
          </div>

          <div className="column">
            <button className="button" onClick={handleGetSupplyInfo}>
              Get supplyInfo
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {supplyInfo &&
                  Object.entries(supplyInfo).map(([key, value], idx) => (
                    <tr key={key}>
                      <td>{idx}</td>
                      <td>{key}</td>
                      <td>{value.toString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="column">
            <button className="button" onClick={handleGetStatus}>
              Get status
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {status &&
                  Object.entries(status).map(([key, value], idx) => (
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
    </div>
  )
}
