import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from './useAlchemyWallet'
import { deleteCookie } from 'cookies-next'
import { getSession, useSession } from 'next-auth/react'
import { logInSwal, missingKeySwal, backupDoneSwal } from 'lib/swal'
import { AccountSignerStatus, WebAuthnUri } from 'types'
import useWallet from './useWallet'

const signUpUserCheck = async (email: string): Promise<{ success: boolean; emailVerified?: boolean; id?: string }> => {
  try {
    const response = await axios.post('/api/user/check', { email })
    return response.data
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}

const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner, baseSigner } =
    useAlchemyProviderContext()
  useAlchemyWallet(baseSigner)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const { data: session } = useSession()
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

      console.log('RESPONSE VALIDATION =>', responseValidation)
      const { verified } = responseValidation.data
      setStatus(verified ? 'success' : 'error')

      return { verified }
    } catch (err) {
      console.error(err)
      setStatus('error')
      return { verified: false }
    }
  }, [])

  const signIn = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await verifyCredential(email)
        if (verified) {
          const { id } = await axios.get('/api/user/get').then((r) => r.data)
          const walletId = localStorage.getItem(id)
          if (walletId) {
            const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
            getSession()
            logInSwal()
            return
          } else {
            const { value: file } = await missingKeySwal()
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                if (!e.target?.result) {
                  throw new Error('Missing file')
                }

                const dataUrl = e.target.result as string
                const base64Data = dataUrl.split(',')[1]
                const signer = new Wallet(Buffer.from(base64Data, 'base64').toString())
                localStorage.setItem(id, base64Data)
                setBaseSigner(signer)
                setStatus('success')
                getSession()
                logInSwal()
                return
              }
              reader.readAsDataURL(file)
            } else {
              throw new Error('Missing file')
            }
          }
        } else {
          console.log('ERROR WHITE')
          setStatus('error')
        }
      } catch (err) {
        console.log('err =>', err)
        // @ts-ignore
        setStatus(err?.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [setBaseSigner, verifyCredential]
  )

  const createUser = useCallback(
    async (email: string) => {
      const { data } = await axios.post('/api/user/create', { email })
      await createCredential(email)
      initWallet(data.id)
      setStatus('success')
      getSession()
    },
    [createCredential, initWallet]
  )

  const signUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const data = await signUpUserCheck(email)
        if (data.emailVerified) {
          const { verified } = await verifyCredential(email)
          console.log({ verified })
          if (verified) {
            data.id && initWallet(data.id)
            setStatus('success')
            getSession()
            return true
          }
          return false
        } else if (!data.success) {
          await createUser(email)
          setStatus('success')
          return true
        } else if (!data.emailVerified) {
          await axios.post('/api/user/create', { email })
          setStatus('success')
          return true
        }
      } catch (err) {
        console.error('[signUp] Error =>', err)
        setStatus('error')
      }
    },
    [createUser, initWallet, verifyCredential]
  )

  const signOut = useCallback(() => {
    setBaseSigner(undefined)
    setSmartAccountAddress(undefined)
    setPaymasterSigner(undefined)
    setSmartSigner(undefined)
    deleteCookie('token')
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner])

  const addBackup = useCallback(
    async () => {
      // @ts-ignore
      if (!session?.user?.email || !session?.user?.id) {
        throw new Error('Missing required email')
      }
      try {
        const credential = await createCredential(session.user.email)
        if (credential.verified) {
          // @ts-ignore
          const walletId = localStorage.getItem(session.user.id)
          if (!walletId) {
            const random = Wallet.createRandom()
            // @ts-ignore
            if (!session.user.id) {
              setStatus('missingKey')
              throw new Error('missing Id')
            }

            backupDoneSwal()
            // @ts-ignore
            localStorage.setItem(session.user.id, Buffer.from(random.privateKey).toString('base64'))

            setBaseSigner(random)
            setStatus('missingKey')
            return
          }
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
          setBaseSigner(signer)
          setStatus('success')
        }
      } catch (err) {
        console.log('[signUp] Error =>', err)
        // @ts-ignore
        setStatus(err.message === 'Missing private key' ? 'missingKey' : 'error')
      }
    },
    // @ts-ignore
    [createCredential, session?.user?.email, session?.user?.id, setBaseSigner]
  )

  return {
    addBackup,
    signUp,
    signIn,
    signOut,
    status
  }
}

export default useAccountSigner
