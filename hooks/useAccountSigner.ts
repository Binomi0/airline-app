import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { deleteCookie } from 'cookies-next'
import { backupDoneSwal, loginSuccessSwal } from 'lib/swal'
import { AccountSignerStatus, User, WebAuthnUri } from 'types'
import useWallet from './useWallet'
import { useAuthProviderContext } from 'context/AuthProvider'
import { useRouter } from 'next/router'

const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setSmartSigner } = useAlchemyProviderContext()
  const { signIn, signOut, user } = useAuthProviderContext()
  const [status, setStatus] = useState<AccountSignerStatus>()
  const { initWallet } = useWallet()
  const router = useRouter()

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
      try {
        const { data } = await axios.get<{ user: User }>('/api/user/get')

        await initWallet(data.user)
        signIn({ user: data.user, ...(token ? { token } : {}) })
        setStatus('success')
      } catch (err) {
        setStatus('error')
        signOut()
        throw new Error('While loading account')
      }
    },
    [initWallet, signIn, signOut]
  )

  const handleSignIn = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified, token } = await verifyCredential(email)
        if (!verified) {
          // User cancelled challenge or timeout
          setStatus('error')
          throw new Error('while verify user credentials')
        }

        await loadAccount(token)
        loginSuccessSwal()
      } catch (err) {
        const error = err as Error
        console.error('err =>', error)
        setStatus(error.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [loadAccount, verifyCredential]
  )

  const handleSignUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await createCredential(email)
        if (verified) {
          await loadAccount()
        }
      } catch (err) {
        console.error('[handleSignUp] Error =>', err)
        setStatus('error')
      }
    },
    [createCredential, loadAccount]
  )

  const handleSignOut = useCallback(() => {
    setBaseSigner(undefined)
    setSmartAccountAddress(undefined)
    setSmartSigner(undefined)
    deleteCookie('token')
    signOut()
    router.asPath !== '/' && router.push('/')
  }, [router, setBaseSigner, setSmartAccountAddress, setSmartSigner, signOut])

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
          // Create a new random one if he already has an account but not a wallet in this device
          const random = Wallet.createRandom()

          backupDoneSwal()
          localStorage.setItem(user.id, Buffer.from(random.privateKey).toString('base64'))

          setBaseSigner(random)
          setStatus('missingKey')
          return
        }
        const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
        setBaseSigner(signer)
        setStatus('success')
      }
    } catch (err) {
      const error = err as Error
      console.error('[handleSignUp] Error =>', err)
      setStatus(error.message === 'Missing private key' ? 'missingKey' : 'error')
    }
  }, [createCredential, setBaseSigner, user?.email, user?.id])

  return {
    addBackup,
    handleSignUp,
    loadAccount,
    onSignIn: handleSignIn,
    handleSignOut,
    verifyCredential,
    status
  }
}

export default useAccountSigner
