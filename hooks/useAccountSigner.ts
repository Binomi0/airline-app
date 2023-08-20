import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from 'ethers'
import { useCallback } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useAlchemyWallet from './useAlchemyWallet'

const EMAIL = 'adolfo@onrubia.es'
// const SERVER_URI = 'https://192.168.1.130:3000'
const SERVER_URI = '/api/webauthn'

const useAccountSigner = () => {
  const { setBaseSigner, baseSigner } = useAlchemyProviderContext()
  useAlchemyWallet(baseSigner)

  const createCredential = useCallback(async (id: string) => {
    try {
      const responseChallenge = await axios.post(`${SERVER_URI}/request-register`, {
        _id: id,
        email: EMAIL
      })
      const request = await startRegistration(responseChallenge.data)
      const responseValidation = await axios.post<{ verified: boolean }>(`${SERVER_URI}/register`, {
        data: request,
        email: EMAIL
      })

      return responseValidation.data.verified
    } catch (err) {
      console.error(err)
      return false
    }
  }, [])

  const signUp = useCallback(async () => {
    const localCredentialId = localStorage.getItem('wallet-key')

    if (!localCredentialId) {
      const id = uuidv4()
      localStorage.setItem('wallet-key', id)

      const isVerified = await createCredential(id)
      if (isVerified) {
        const random = Wallet.createRandom()
        localStorage.setItem('wallet-id', Buffer.from(random.privateKey).toString('base64'))

        setBaseSigner(random)
      }
    } else {
      const isVerified = await createCredential(localCredentialId)
      if (isVerified) {
        const walletId = localStorage.getItem('wallet-id')
        if (!walletId) {
          throw new Error('Missing private key')
        }
        const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
        setBaseSigner(signer)
      }
    }
  }, [createCredential, setBaseSigner])

  const signIn = useCallback(async () => {
    const localCredentialId = localStorage.getItem('wallet-key')
    if (!localCredentialId) return signUp()

    const responseChallenge = await axios.post(`${SERVER_URI}/login`, { email: EMAIL })
    const request = await startAuthentication(responseChallenge.data)
    const responseValidation = await axios.post(`${SERVER_URI}/login-challenge`, {
      data: request,
      email: EMAIL
    })

    if (responseValidation.data.verified) {
      const walletId = localStorage.getItem('wallet-id')
      if (!walletId) {
        throw new Error('Missing walletId')
      }

      const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
      setBaseSigner(signer)
    }
  }, [setBaseSigner, signUp])

  const signOut = useCallback(() => {
    setBaseSigner(undefined)
  }, [setBaseSigner])

  return {
    signUp,
    signIn,
    signOut
  }
}

export default useAccountSigner
