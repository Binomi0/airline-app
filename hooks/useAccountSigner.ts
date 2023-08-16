import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

const EMAIL = 'adolfo@onrubia.es'

const useAccountSigner = () => {
  const [signer, setSigner] = useState<Wallet>()

  const signUp = useCallback(async () => {
    const localCredentialId = localStorage.getItem('wallet-key')
    // What if user already exists?
    if (localCredentialId) return

    const id = uuidv4()
    localStorage.setItem('wallet-key', id)
    const responseChallenge = await axios.post('https://192.168.1.130:3000/request-register', {
      _id: id,
      email: EMAIL
    })
    const request = await startRegistration(responseChallenge.data)
    const responseValidation = await axios.post('https://192.168.1.130:3000/register', { data: request, email: EMAIL })

    if (responseValidation.data.verified) {
      const random = Wallet.createRandom()
      localStorage.setItem('wallet-id', Buffer.from(random.privateKey).toString('base64'))

      setSigner(random)
    }
  }, [])

  const signIn = useCallback(async () => {
    const localCredentialId = localStorage.getItem('wallet-key')
    if (!localCredentialId) return signUp()

    const responseChallenge = await axios.post('https://192.168.1.130:3000/login', { email: EMAIL })
    const request = await startAuthentication(responseChallenge.data)
    const responseValidation = await axios.post('https://192.168.1.130:3000/login-challenge', {
      data: request,
      email: EMAIL
    })

    if (responseValidation.data.verified) {
      const walletId = localStorage.getItem('wallet-id')
      if (!walletId) {
        throw new Error('Missing walletId')
      }

      const signer = new Wallet(Buffer.from(walletId, 'base64').toString())
      setSigner(signer)
    }
  }, [signUp])

  const signOut = useCallback(() => {
    setSigner(undefined)
  }, [])

  return {
    signUp,
    signIn,
    signOut,
    signer
  }
}

export default useAccountSigner
