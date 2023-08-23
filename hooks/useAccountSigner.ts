import axios from 'config/axios'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from './useAlchemyWallet'
import { deleteCookie } from 'cookies-next'

const SERVER_URI = '/api/webauthn'
type AccountSignerStatus = 'loading' | 'error' | 'success' | 'missingKey' | undefined

const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner, baseSigner } =
    useAlchemyProviderContext()
  useAlchemyWallet(baseSigner)
  const [status, setStatus] = useState<AccountSignerStatus>()

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
      console.log('SIGN UP')
      try {
        const response = await axios.post('/api/user', { email })
        console.log({ data: response.data })
        if (response.data.success) {
          const credential = await createCredential(email)
          if (credential.verified) {
            const walletId = localStorage.getItem(response.data.id)
            if (!walletId) {
              const random = Wallet.createRandom()
              if (!response.data.id) {
                throw new Error('missing Id')
              }

              localStorage.setItem(response.data.id, Buffer.from(random.privateKey).toString('base64'))

              setBaseSigner(random)
              setStatus('missingKey')
              throw new Error('Missing private key')
            }
            const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
          }
        } else {
          await axios.post('/api/user/create', { email })
          setStatus('success')
          // const id = uuidv4()
          // localStorage.setItem('wallet-key', id)
        }
      } catch (err) {
        console.log('[signUp] Error =>', err)
        // @ts-ignore
        setStatus(err.message === 'Missing private key' ? 'missingKey' : 'error')
      }
      // const localCredentialId = localStorage.getItem('wallet-id')

      // if (!localCredentialId) {
      //   const isVerified = await createCredential(id, email)
      //   if (isVerified) {
      //     const random = Wallet.createRandom()
      //     localStorage.setItem(id, Buffer.from(random.privateKey).toString('base64'))

      //     setBaseSigner(random)
      //   }
      // } else {
      //   const isVerified = await createCredential(id, email)
      //   if (isVerified) {
      //     const walletId = localStorage.getItem(localCredentialId)
      //     if (!walletId) {
      //       throw new Error('Missing private key')
      //     }
      //     const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
      //     setBaseSigner(signer)
      //   }
      // }
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

        const { verified, id } = responseValidation.data
        if (verified && id) {
          const walletId = localStorage.getItem(id)
          if (walletId) {
            const signer = new Wallet(Buffer.from(id, 'base64').toString())
            setBaseSigner(signer)
            setStatus('success')
            return
          } else {
            throw new Error('Missing wallet key')
          }
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

  return {
    signUp,
    signIn,
    signOut,
    status
  }
}

export default useAccountSigner
