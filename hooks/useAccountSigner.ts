import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { backupDoneSwal } from 'lib/swal'
import { AccountSignerStatus, User, WebAuthnUri } from 'types'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { userState } from 'store/user.atom'
import { authState } from 'store/auth.atom'
import { walletStore } from 'store/wallet.atom'
import useWallet from './useWallet'

interface UseAccountSignerReturnType {
  addBackup: () => Promise<void>
  // eslint-disable-next-line no-unused-vars
  loadAccount: (token?: string) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  createCredential: (email: string) => Promise<{ verified: boolean }>
  // eslint-disable-next-line no-unused-vars
  verifyCredential: (email: string) => Promise<{ verified: boolean; token?: string }>
  status: AccountSignerStatus
}

const useAccountSigner = (): UseAccountSignerReturnType => {
  const [user, setUser] = useRecoilState(userState)
  const setToken = useSetRecoilState(authState)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const [wallet, setWallet] = useRecoilState(walletStore)
  const { initWallet } = useWallet()

  const createCredential = useCallback(async (email: string) => {
    try {
      const responseChallenge = await axios.post(WebAuthnUri.REQUEST_REGISTER, { email })
      const request = await startRegistration(responseChallenge.data)
      const responseValidation = await axios.post<{ verified: boolean }>(WebAuthnUri.REGISTER, {
        data: request,
        email
      })
      const { verified } = responseValidation.data
      setStatus(verified ? 'success' : 'error')

      return { verified }
    } catch (err) {
      console.error(err)
      setStatus('error')
      return { verified: false }
    }
  }, [])

  const verifyCredential = useCallback(async (email: string) => {
    try {
      const responseChallenge = await axios.post(WebAuthnUri.LOGIN, { email })
      const request = await startAuthentication(responseChallenge.data)
      const responseValidation = await axios.post(WebAuthnUri.LOGIN_CHALLENGE, { data: request, email })

      const { verified, token } = responseValidation.data
      setStatus(verified ? 'success' : 'error')

      return { verified, token }
    } catch (err) {
      console.error(err)
      setStatus('error')
      return { verified: false }
    }
  }, [])

  const loadAccount = useCallback(
    async (token?: string) => {
      if (!wallet.isLoaded) {
        try {
          const { data } = await axios.get<User>('/api/user/get')

          console.log('load account')
          await initWallet(data)
          setUser(data)
          setToken(token)
          setStatus('success')
        } catch (err) {
          setStatus('error')
          setUser(undefined)
          setToken(undefined)
          throw new Error('While loading account')
        }
      }
    },
    [initWallet, setToken, setUser, wallet.isLoaded]
  )

  const addBackup = useCallback(async () => {
    if (!user?.email || !user?.id) {
      if (!user?.id) {
        setStatus('missingKey')
        throw new Error('missing Id')
      }
      throw new Error('Missing required params email or id')
    }
    try {
      // Validate again user?
      const credential = await createCredential(user?.email)
      if (credential.verified) {
        const walletId = localStorage.getItem(user.id)
        if (!walletId) {
          console.log('ARE WE SURE THAT WE SHOULD CREATE A NEW WALLET FOR THE USER AT THIS TIME?')
          // Create a new random one if he already has an account but not a wallet in this device
          const random = Wallet.createRandom()

          backupDoneSwal()
          localStorage.setItem(user.id, Buffer.from(random.privateKey).toString('base64'))

          setWallet({ baseSigner: random })
          setStatus('missingKey')
          return
        }
        const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
        setWallet({ baseSigner: signer })
        setStatus('success')
      }
    } catch (err) {
      const error = err as Error
      console.error('[handleSignUp] Error =>', err)
      setStatus(error.message === 'Missing private key' ? 'missingKey' : 'error')
    }
  }, [createCredential, setWallet, user?.email, user?.id])

  return {
    addBackup,
    loadAccount,
    createCredential,
    verifyCredential,
    status
  }
}

export default useAccountSigner
