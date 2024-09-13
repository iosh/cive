import { createPublicClient, fallback, http, testnet, webSocket } from 'cive'

const httpClient = createPublicClient({
  chain: testnet,
  transport: http(),
})

async function render(
  btnId: string,
  viewId: string,
  action: () => Promise<string | number | bigint | Record<string, unknown>>,
) {
  const btn = document.querySelector<HTMLButtonElement>(btnId)!
  const view = document.querySelector<HTMLSpanElement>(viewId)!
  btn.disabled = true
  const data = await action()

  btn.disabled = false

  if (
    typeof data === 'string' ||
    typeof data === 'number' ||
    typeof data === 'boolean' ||
    typeof data === 'bigint'
  ) {
    view.innerText = data.toString()
  } else {
    view.innerHTML = `${Object.entries(data)
      .map(([key, value]) => `<span>${key}</span>: <span>${value}</span>`)
      .join('<br/>')}`
  }
}

/**
 * HTTP
 */
// getEpochNumber doc: https://cive.zyx.ee/docs/actions/public/getEpochNumber

async function getEpochNumber() {
  await render('#getEpochNumber', '#epochNumber', async () => {
    // you can set the epochTag , if you don't want to use cache you can set cacheTime to 0, the default cacheTime is `client.cacheTime`
    return await httpClient.getEpochNumber({
      epochTag: 'latest_mined',
      cacheTime: 0,
    })
  })
}
const epochNumberButton =
  document.querySelector<HTMLButtonElement>('#getEpochNumber')!
epochNumberButton.addEventListener('click', getEpochNumber)

// getBlock doc: https://cive.zyx.ee/docs/actions/public/getBlock
async function getBlock() {
  await render('#getBlock', '#block', async () => {
    // also you can use the blockNumber to get the block
    //   const block = await client.getBlock({ blockNumber: 1 })
    return await httpClient.getBlock({ epochTag: 'latest_state' })
  })
}
const getBlockButton = document.querySelector<HTMLButtonElement>('#getBlock')!
getBlockButton.addEventListener('click', getBlock)

// getClientVersion doc:https://cive.zyx.ee/docs/actions/public/getClientVersion

async function getClientVersion() {
  await render('#getClientVersion', '#clientVersion', async () => {
    return await httpClient.getClientVersion()
  })
}
const getClientVersionButton =
  document.querySelector<HTMLButtonElement>('#getClientVersion')!

getClientVersionButton.addEventListener('click', getClientVersion)

// getGasPrice doc:https://cive.zyx.ee/docs/actions/public/getGasPrice
async function getGasPrice() {
  await render('#getGasPrice', '#gasPrice', async () => {
    return await httpClient.getGasPrice()
  })
}
const getGasPriceButton =
  document.querySelector<HTMLButtonElement>('#getGasPrice')!
getGasPriceButton.addEventListener('click', getGasPrice)

// getSupplyInfo doc:https://cive.zyx.ee/docs/actions/public/getSupplyInfo
async function getSupplyInfo() {
  await render('#getSupplyInfo', '#supplyInfo', async () => {
    return await httpClient.getSupplyInfo()
  })
}
const getSupplyInfoButton =
  document.querySelector<HTMLButtonElement>('#getSupplyInfo')!

getSupplyInfoButton.addEventListener('click', getSupplyInfo)

// getStatus doc:https://cive.zyx.ee/docs/actions/public/getStatus
async function getStatus() {
  await render('#getStatus', '#status', async () => {
    return await httpClient.getStatus()
  })
}
const getStatusButton = document.querySelector<HTMLButtonElement>('#getStatus')!
getStatusButton.addEventListener('click', getStatus)

/**
 * Websocket
 */

const webSocketClient = createPublicClient({
  chain: testnet,
  transport: webSocket('wss://test.confluxrpc.org/ws'),
})

async function wsGetEpochNumber() {
  await render('#wsGetEpochNumber', '#wsEpochNumber', async () => {
    // you can set the epochTag , if you don't want to use cache you can set cacheTime to 0, the default cacheTime is `client.cacheTime`
    return await webSocketClient.getEpochNumber({
      epochTag: 'latest_mined',
      cacheTime: 0,
    })
  })
}
const wsEpochNumberButton =
  document.querySelector<HTMLButtonElement>('#wsGetEpochNumber')!
wsEpochNumberButton.addEventListener('click', wsGetEpochNumber)

/**
 * Fallback
 */

const fallbackClient = createPublicClient({
  chain: testnet,
  transport: fallback([
    // The client will try to use http first and fallback to next.
    http('http://fake.example.com'),
    http('https://test.confluxrpc.com'),
  ]),
})

async function fallbackGetEpochNumber() {
  await render('#fallbackGetEpochNumber', '#fallbackEpochNumber', async () => {
    // you can set the epochTag , if you don't want to use cache you can set cacheTime to 0, the default cacheTime is `client.cacheTime`
    return await fallbackClient.getEpochNumber({
      epochTag: 'latest_mined',
      cacheTime: 0,
    })
  })
}
const fallbackEpochNumberButton =
  document.querySelector<HTMLButtonElement>('#fallbackGetEpochNumber')!
fallbackEpochNumberButton.addEventListener('click', fallbackGetEpochNumber)
