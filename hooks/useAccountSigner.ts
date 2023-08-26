import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { deleteCookie } from 'cookies-next'
import { logInSwal, missingKeySwal, backupDoneSwal } from 'lib/swal'
import { AccountSignerStatus, WebAuthnUri } from 'types'
import useWallet from './useWallet'
import { useAuthProviderContext } from 'context/AuthProvider'

const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner } = useAlchemyProviderContext()
  const { signIn, signOut, user } = useAuthProviderContext()
  const [status, setStatus] = useState<AccountSignerStatus>()
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

      const { verified } = responseValidation.data
      setStatus(verified ? 'success' : 'error')

      return { verified }
    } catch (err) {
      console.error(err)
      setStatus('error')
      return { verified: false }
    }
  }, [])

  const loadAccount = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await verifyCredential(email)
        if (verified) {
          const { data } = await axios.get('/api/user/get')
          const walletId = localStorage.getItem(data.user.id)
          if (walletId) {
            const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
            signIn(data.user)
            logInSwal()
            return
          } else {
            const { value: file } = await missingKeySwal()
            if (file) {
              const reader = new FileReader()
              reader.onload = async (e) => {
                if (!e.target?.result) {
                  throw new Error('Missing file')
                }

                const dataUrl = e.target.result as string
                const base64Data = dataUrl.split(',')[1]
                const signer = new Wallet(Buffer.from(base64Data, 'base64').toString())
                localStorage.setItem(data.user.id, base64Data)
                setBaseSigner(signer)
                setStatus('success')
                signIn(data.user)
                logInSwal()
                return
              }
              reader.readAsDataURL(file)
            } else {
              throw new Error('Missing file')
            }
          }
        } else {
          // User cancelled challeng or timeout
          setStatus('error')
        }
      } catch (err) {
        console.error('err =>', err)
        // @ts-ignore
        setStatus(err?.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [setBaseSigner, signIn, verifyCredential]
  )

  const handleSignUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await createCredential(email)
        if (verified) {
          const { data } = await axios.get('/api/user/get')
          if (!data.user.id) {
            throw new Error('Missing user ID while creating wallet')
          }
          initWallet(data.user.id)
          setStatus('success')
          signIn(data.user)
          return true
        }
        return false
      } catch (err) {
        console.error('[handleSignUp] Error =>', err)
        setStatus('error')
      }
    },
    [createCredential, initWallet, signIn]
  )

  const handleSignOut = useCallback(() => {
    setBaseSigner(undefined)
    setSmartAccountAddress(undefined)
    setPaymasterSigner(undefined)
    setSmartSigner(undefined)
    deleteCookie('token')
    signOut()
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner, signOut])

  const addBackup = useCallback(
    async () => {
      // @ts-ignore
      if (!user?.email || !user?.id) {
        throw new Error('Missing required params email or id')
      }
      try {
        const credential = await createCredential(user?.email)
        if (credential.verified) {
          // @ts-ignore
          const walletId = localStorage.getItem(user.id)
          if (!walletId) {
            const random = Wallet.createRandom()
            // @ts-ignore
            if (!user.id) {
              setStatus('missingKey')
              throw new Error('missing Id')
            }

            backupDoneSwal()
            // @ts-ignore
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
        console.error('[handleSignUp] Error =>', err)
        // @ts-ignore
        setStatus(err.message === 'Missing private key' ? 'missingKey' : 'error')
      }
    },
    // @ts-ignore
    [createCredential, setBaseSigner, user?.email, user?.id]
  )

  return {
    addBackup,
    handleSignUp,
    loadAccount,
    handleSignOut,
    verifyCredential,
    status
  }
}

export default useAccountSigner
