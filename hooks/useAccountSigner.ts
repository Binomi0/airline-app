import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from './useAlchemyWallet'
import { deleteCookie } from 'cookies-next'
// import { useSession } from 'next-auth/react'

const SERVER_URI = '/api/webauthn'

const useAccountSigner = () => {
  const { setBaseSigner, setSmartAccountAddress, setPaymasterSigner, setSmartSigner, baseSigner } =
    useAlchemyProviderContext()
  useAlchemyWallet(baseSigner)

  const createCredential = useCallback(async (id: string, email: string) => {
    try {
      const responseChallenge = await axios.post(`${SERVER_URI}/request-register`, {
        _id: id,
        email
      })
      const request = await startRegistration(responseChallenge.data)
      const responseValidation = await axios.post<{ verified: boolean }>(`${SERVER_URI}/register`, {
        data: request,
        email
      })

      return responseValidation.data.verified
    } catch (err) {
      console.error(err)
      return false
    }
  }, [])

  const signUp = useCallback(
    async (email: string) => {
      const id = uuidv4()
      localStorage.setItem('wallet-key', id)
      const localCredentialId = localStorage.getItem('wallet-id')

      if (!localCredentialId) {
        const isVerified = await createCredential(id, email)
        if (isVerified) {
          const random = Wallet.createRandom()
          localStorage.setItem(id, Buffer.from(random.privateKey).toString('base64'))

          setBaseSigner(random)
        }
      } else {
        const isVerified = await createCredential(id, email)
        if (isVerified) {
          const walletId = localStorage.getItem(localCredentialId)
          if (!walletId) {
            throw new Error('Missing private key')
          }
          const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
          setBaseSigner(signer)
        }
      }
    },
    [createCredential, setBaseSigner]
  )

  const signIn = useCallback(
    async (email: string) => {
      const localCredentialId = localStorage.getItem('wallet-key')
      if (!localCredentialId) {
        if (email) {
          signUp(email)
        }
        return
      }

      const responseChallenge = await axios.post(`${SERVER_URI}/login`, { email })
      const request = await startAuthentication(responseChallenge.data)
      const responseValidation = await axios.post(`${SERVER_URI}/login-challenge`, {
        data: request,
        email
      })

      if (responseValidation.data.verified) {
        const walletId = localStorage.getItem(localCredentialId)
        if (!walletId) {
          // At this point user would want to import private key
          throw new Error('Missing walletId')
        }

        const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
        setBaseSigner(signer)
      }
    },
    [setBaseSigner, signUp]
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
    signOut
  }
}

export default useAccountSigner
