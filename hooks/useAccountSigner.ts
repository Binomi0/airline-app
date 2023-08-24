import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from './useAlchemyWallet'
import { deleteCookie } from 'cookies-next'
import Swal from 'sweetalert2'
import { useSession } from 'next-auth/react'

const SERVER_URI = '/api/webauthn'
type AccountSignerStatus = 'loading' | 'error' | 'success' | 'missingKey' | undefined


const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner, baseSigner } =
    useAlchemyProviderContext()
  useAlchemyWallet(baseSigner)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const {data: session} = useSession()

  const createCredential = useCallback(async (email: string) => {
    try {
      const responseChallenge = await axios.post(`${SERVER_URI}/request-register`, { email })
      const request = await startRegistration(responseChallenge.data)
      const responseValidation = await axios.post<{ verified: boolean }>(`${SERVER_URI}/register`, {
        data: request,
        email
      })

      return responseValidation.data
    } catch (err) {
      console.error(err)
      return { verified: false }
    }
  }, [])

  const signUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const response = await axios.post('/api/user', { email })
        if (response.data.success) {
          const credential = await createCredential(email)
          if (credential.verified) {
            const walletId = localStorage.getItem(response.data.id)
            if (!walletId) {
              const random = Wallet.createRandom()
              if (!response.data.id) {
                setStatus('missingKey')
                throw new Error('missing Id')
              }

              localStorage.setItem(response.data.id, Buffer.from(random.privateKey).toString('base64'))

              setBaseSigner(random)
              setStatus('missingKey')
              return
            }
            const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
          }
        } else {
          await axios.post('/api/user/create', { email })
          setStatus('success')
        }
      } catch (err) {
        console.log('[signUp] Error =>', err)
        // @ts-ignore
        setStatus(err.message === 'Missing private key' ? 'missingKey' : 'error')
      }
    },
    [createCredential, setBaseSigner]
  )

  const signIn = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const responseChallenge = await axios.post(`${SERVER_URI}/login`, { email })
        const request = await startAuthentication(responseChallenge.data)
        const responseValidation = await axios.post(`${SERVER_URI}/login-challenge`, {
          data: request,
          email
        })

        const { verified } = responseValidation.data
        if (verified) {
          const data = await axios.get('/api/user/get').then((r) => r.data)
          const walletId = localStorage.getItem(data.id)
          if (walletId) {
            const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
            Swal.fire({
              title: 'Connected!',
              text: 'You are now logged in',
              icon: 'success',
            })
            return
          } else {

            throw new Error('Missing wallet key')
          }
        } else {
          setStatus('error')
        }
      } catch (err) {
        // @ts-ignore
        setStatus(err?.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [setBaseSigner]
  )

  const signOut = useCallback(() => {
    setBaseSigner(undefined)
    setSmartAccountAddress(undefined)
    setPaymasterSigner(undefined)
    setSmartSigner(undefined)
    deleteCookie('token')
  }, [setBaseSigner, setPaymasterSigner, setSmartAccountAddress, setSmartSigner])

  const addBackup = useCallback(async () => {
    if (!session?.user?.email || !session?.user?.id) {
      throw new Error('Missing required email')
    }
    try {
        const credential = await createCredential(session.user.email)
        if (credential.verified) {
          const walletId = localStorage.getItem(session.user.id)
          if (!walletId) {
            const random = Wallet.createRandom()
            if (!session.user.id) {
              setStatus('missingKey')
              throw new Error('missing Id')
            }

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

  }
  , [createCredential, session?.user?.email, session?.user?.id, setBaseSigner])

  return {
    addBackup,
    signUp,
    signIn,
    signOut,
    status
  }
}

export default useAccountSigner
