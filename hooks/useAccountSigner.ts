import { Wallet } from 'ethers'
import { useCallback, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { backupDoneSwal } from 'lib/swal'
import { AccountSignerStatus, User, WebAuthnUri } from 'types'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { walletStore } from 'store/wallet.atom'
import useWallet from './useWallet'
import { postApi } from 'lib/api'
import {
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON
} from '@simplewebauthn/typescript-types'

interface UseAccountSignerReturnType {
  addBackup: () => Promise<void>
  // eslint-disable-next-line no-unused-vars
  loadAccount: (user: User) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  createCredential: (email: string) => Promise<{ verified: boolean; token?: string }>
  // eslint-disable-next-line no-unused-vars
  verifyCredential: (email: string) => Promise<{ verified: boolean; token?: string }>
  status: AccountSignerStatus
}

const useAccountSigner = (): UseAccountSignerReturnType => {
  const user = useRecoilValue(userState)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const [wallet, setWallet] = useRecoilState(walletStore)
  const { initWallet } = useWallet()

  const createCredential = useCallback(async (email: string) => {
    try {
      const challenge = await postApi<PublicKeyCredentialCreationOptionsJSON>(WebAuthnUri.REQUEST_REGISTER, {
        email
      })
      if (!challenge) return { verified: false }
      const request = await startRegistration(challenge)
      const validation = await postApi<{ verified: boolean; token?: string }>(WebAuthnUri.REGISTER, {
        data: request,
        email
      })
      setStatus(validation?.verified ? 'success' : 'error')

      return { verified: Boolean(validation?.verified), token: validation?.token }
    } catch (err) {
      console.error(err)
      setStatus('error')
      return { verified: false }
    }
  }, [])

  const verifyCredential = useCallback(async (email: string) => {
    try {
      const challenge = await postApi<PublicKeyCredentialRequestOptionsJSON>(WebAuthnUri.LOGIN, { email })
      if (!challenge) return { verified: false }
      const request = await startAuthentication(challenge)
      const validation = await postApi<{ verified: boolean; token?: string }>(WebAuthnUri.LOGIN_CHALLENGE, {
        data: request,
        email
      })

      setStatus(validation?.verified ? 'success' : 'error')

      return { verified: Boolean(validation?.verified), token: validation?.token }
    } catch (err) {
      console.error(err)
      setStatus('error')
      return { verified: false }
    }
  }, [])

  const loadAccount = useCallback(
    async (_user: User) => {
      if (wallet.isLoaded) return

      try {
        await initWallet(_user)
        setStatus('success')
      } catch (err) {
        setStatus('error')
        throw new Error('While loading account')
      }
    },
    [initWallet, wallet.isLoaded]
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
