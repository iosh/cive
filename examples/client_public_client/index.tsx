import React from 'react'
import App from './src/App'
import 'bulma/css/bulma.css'

// /**
//  * Websocket
//  */

// const webSocketClient = createPublicClient({
//   chain: testnet,
//   transport: webSocket('wss://test.confluxrpc.org/ws'),
// })

// async function wsGetEpochNumber() {
//   await render('#wsGetEpochNumber', '#wsEpochNumber', async () => {
//     // you can set the epochTag , if you don't want to use cache you can set cacheTime to 0, the default cacheTime is `client.cacheTime`
//     return await webSocketClient.getEpochNumber({
//       epochTag: 'latest_mined',
//       cacheTime: 0,
//     })
//   })
// }
// const wsEpochNumberButton =
//   document.querySelector<HTMLButtonElement>('#wsGetEpochNumber')!
// wsEpochNumberButton.addEventListener('click', wsGetEpochNumber)

// /**
//  * Fallback
//  */

// const fallbackClient = createPublicClient({
//   chain: testnet,
//   transport: fallback([
//     // The client will try to use http first and fallback to next.
//     http('http://fake.example.com'),
//     http('https://test.confluxrpc.com'),
//   ]),
// })

// async function fallbackGetEpochNumber() {
//   await render('#fallbackGetEpochNumber', '#fallbackEpochNumber', async () => {
//     // you can set the epochTag , if you don't want to use cache you can set cacheTime to 0, the default cacheTime is `client.cacheTime`
//     return await fallbackClient.getEpochNumber({
//       epochTag: 'latest_mined',
//       cacheTime: 0,
//     })
//   })
// }
// const fallbackEpochNumberButton = document.querySelector<HTMLButtonElement>(
//   '#fallbackGetEpochNumber',
// )!
// fallbackEpochNumberButton.addEventListener('click', fallbackGetEpochNumber)

import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
