import {
  http,
  type Address,
  type Hex,
  type SignMessageErrorType,
  createPublicClient,
  createWalletClient,
  custom,
} from 'cive'
import { testnet } from 'cive/chains'
import { useCallback, useState } from 'react'
import 'cive/window'
import { verifyMessage } from 'cive/utils'

const walletClient = createWalletClient({
  chain: testnet,
  transport: custom(window.fluent!),
})
const publicClient = createPublicClient({
  chain: testnet,
  transport: http(),
})

export default function App() {
  const [account, setAccount] = useState<Address>()
  const [message, setMessage] = useState('')
  const [signResult, setSignResult] = useState<Hex>()
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isValidWithAction, setIsValidWithAction] = useState<boolean | null>()

  const connect = useCallback(async () => {
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
  }, [])

  const handleSignMessage = useCallback(async () => {
    if (account) {
      try {
        const signature = await walletClient.signMessage({
          account,
          message,
        })

        setSignResult(signature)
      } catch (error: unknown) {
        const err = error as SignMessageErrorType
        console.error(err)
      }
    }
  }, [message, account])

  const handleVerifyMessage = useCallback(async () => {
    if (account && signResult) {
      const isValid = await verifyMessage({
        address: account,
        message,
        signature: signResult,
      })
      setIsValid(isValid)
    }
  }, [message, account, signResult])

  const handleVerifyMessageWithAction = useCallback(async () => {
    if (account && signResult) {
      const isValid = await publicClient.verifyMessage({
        address: account,
        message,
        signature: signResult,
      })
      setIsValidWithAction(isValid)
    }
  }, [message, account, signResult])

  return (
    <div className="box">
      {account ? (
        <div className="columns is-3 is-flex-direction-column">
          <span>Account: {account}</span>
          <div className="column">
            <input
              className="input"
              type="text"
              placeholder="message"
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="is-flex is-align-items-center">
              <button
                className="button"
                onClick={handleSignMessage}
                disabled={!message}
              >
                Sign Message
              </button>
              <span className="is-size-5" style={{ wordBreak: 'break-all' }}>
                result: {signResult}
              </span>
            </div>
          </div>

          {signResult && (
            <div>
              <div className="column">
                <div className="is-flex is-align-items-center">
                  <button className="button" onClick={handleVerifyMessage}>
                    Verify message
                  </button>
                </div>
                <p>
                  {isValid === null ? '...' : `message is valid: ${isValid}`}
                </p>
              </div>
              <div className="column">
                <div className="is-flex is-align-items-center">
                  <button
                    className="button"
                    onClick={handleVerifyMessageWithAction}
                  >
                    Verify message with public action
                  </button>
                </div>
                <p>
                  {isValidWithAction === null
                    ? '...'
                    : `message is valid: ${isValidWithAction}`}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className="button" onClick={connect}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}
