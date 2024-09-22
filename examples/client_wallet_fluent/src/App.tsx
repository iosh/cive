import {
  http,
  type Address,
  createPublicClient,
  createWalletClient,
  custom,
  parseCFX,
  SignMessageErrorType,
} from 'cive'
import { mainnet, testnet } from 'cive/chains'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'cive/window'
import type { SendTransactionErrorType } from '../../../src/_types/actions/wallet/sendTransaction'

export default function App() {
  const [account, setAccount] = useState<Address>()
  const [transaction, setTransaction] = useState<string>()
  const [signMessage, setSignMessage] = useState<string>()

  const walletClient = useMemo(
    () =>
      createWalletClient({
        chain: testnet,
        transport: custom(window.fluent!),
      }),
    [],
  )

  const connect = useCallback(async () => {
    const [address] = await walletClient.requestAddresses()
    setAccount(address)
  }, [walletClient])

  const handleSendTransaction = useCallback(async () => {
    if (account) {
      try {
        const hash = await walletClient.sendTransaction({
          account,
          to: account,
          value: parseCFX('0.01'),
        })
        setTransaction(`successful: ${hash}`)
      } catch (error: unknown) {
        const err = error as SendTransactionErrorType
        setTransaction(err.name)
      }
    }
  }, [walletClient, account])

  const handleSignMessage = useCallback(async () => {
    if (account) {
      try {
        const signature = await walletClient.signMessage({
          account,
          message: 'hello world',
        })
        setSignMessage(`successful: ${signature}`)
      } catch (error: unknown) {
        const err = error as SignMessageErrorType

        setSignMessage(err.name)
      }
    }
  }, [walletClient, account])

  const handleSwitchChain = useCallback(async () => {
    if (account) {
      await walletClient.switchChain({ id: testnet.id })
    }
  }, [walletClient, account])
  useEffect(() => {
    window?.fluent?.on('accountsChanged', (accounts: Address[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        setAccount(undefined)
      }
    })
    window?.fluent?.on('disconnect', () => setAccount(undefined))
  }, [])

  return (
    <div className="box">
      <div>
        <div className="column">
          {account ? (
            <div className="columns is-3 is-flex-direction-column">
              <span>Account: {account}</span>
              <div className="column">
                <div className="is-flex is-align-items-center">
                  <button className="button" onClick={handleSendTransaction}>
                    Send Transaction(0.01 CFX to self)
                  </button>
                  <span className="is-size-5">result: {transaction}</span>
                </div>
              </div>

              <div className="column">
                <div className="is-flex is-align-items-center">
                  <button className="button" onClick={handleSwitchChain}>
                    Switch chain
                  </button>
                </div>
              </div>

              <div className="column">
                <div className="is-flex is-align-items-center">
                  <button className="button" onClick={handleSignMessage}>
                    Sign message (hello world)
                  </button>
                  <span className="is-size-5">result: {signMessage}</span>
                </div>
              </div>
            </div>
          ) : (
            <button className="button" onClick={connect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
