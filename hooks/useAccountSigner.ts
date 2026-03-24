import { useCallback, useState, useEffect } from 'react'
import {
  startAuthentication,
  startRegistration,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON
} from '@simplewebauthn/browser'
import { backupDoneSwal, backupErrorSwal } from 'lib/swal'
import { AccountSignerStatus, User, WebAuthnUri, Authenticator } from 'types'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { walletStore } from 'store/wallet.atom'
import useWallet from './useWallet'
import { postApi, getApi } from 'lib/api'

interface UseAccountSignerReturnType {
  addBackup: () => Promise<void>
  loadAccount: (user: User) => Promise<void>
  createCredential: (email: string) => Promise<{ verified: boolean; token?: string; error?: string }>
  // eslint-disable-next-line no-unused-vars
  verifyCredential: (email: string) => Promise<{ verified: boolean; token?: string; error?: string }>
  removeBackup: (credentialID: string) => Promise<void>
  fetchBackups: () => Promise<void>
  backups: Authenticator[]
  status: AccountSignerStatus
}

const useAccountSigner = (): UseAccountSignerReturnType => {
  const user = useRecoilValue(userState)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const wallet = useRecoilValue(walletStore)
  const { initWallet } = useWallet()

  const createCredential = useCallback(async (email: string) => {
    try {
      const challenge = await postApi<PublicKeyCredentialCreationOptionsJSON>(WebAuthnUri.REQUEST_REGISTER, {
        email
      })
      if (!challenge) return { verified: false }
      const request = await startRegistration({ optionsJSON: challenge })
      const validation = await postApi<{ success: boolean }>(WebAuthnUri.REGISTER, {
        data: request,
        email
      })
      console.log('validation =>', validation)
      setStatus(validation?.success ? 'success' : 'error')

      return { verified: Boolean(validation?.success) }
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      return { verified: false, error: err.message }
    }
  }, [])

  const verifyCredential = useCallback(async (email: string) => {
    try {
      const challenge = await postApi<PublicKeyCredentialRequestOptionsJSON>(WebAuthnUri.LOGIN, { email })
      if (!challenge) return { verified: false }
      const request = await startAuthentication({ optionsJSON: challenge })
      const validation = await postApi<{ verified: boolean; token?: string }>(WebAuthnUri.LOGIN_CHALLENGE, {
        data: request,
        email
      })

      setStatus(validation?.verified ? 'success' : 'error')

      return { verified: Boolean(validation?.verified), token: validation?.token }
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      return { verified: false, error: err.message }
    }
  }, [])

  const loadAccount = useCallback(
    async (_user: User) => {
      if (wallet.isLoaded) return

      try {
        await initWallet(_user)
        setStatus('success')
      } catch {
        setStatus('error')
        throw new Error('While loading account')
      }
    },
    [initWallet, wallet.isLoaded]
  )

  const [backups, setBackups] = useState<Authenticator[]>([])

  const fetchBackups = useCallback(async () => {
    try {
      const response = await getApi<{ authenticators: Authenticator[] }>('/api/webauthn/get')
      if (response?.authenticators) {
        setBackups(response.authenticators)
      }
    } catch (err) {
      console.error('Error fetching backups:', err)
    }
  }, [])

  const addBackup = useCallback(async () => {
    if (!user?.email || !user?.id) {
      if (!user?.id) {
        setStatus('missingKey')
        throw new Error('missing Id')
      }
      throw new Error('Missing required params email or id')
    }
    try {
      const { verified, error: verifyError } = await verifyCredential(user.email)
      if (!verified) {
        if (verifyError) backupErrorSwal(verifyError)
        return
      }

      const { verified: created, error: createError } = await createCredential(user.email)
      if (created) {
        backupDoneSwal()
        fetchBackups()
      } else {
        backupErrorSwal(createError as string)
      }
    } catch (err) {
      const error = err as Error
      console.error('[addBackup] Error =>', err)
      setStatus(error.message === 'Missing private key' ? 'missingKey' : 'error')
    }
  }, [createCredential, fetchBackups, user?.email, user?.id, verifyCredential])

  const removeBackup = useCallback(
    async (credentialID: string) => {
      try {
        const response = await postApi<{ success: boolean }>('/api/webauthn/remove', { credentialID })
        if (response?.success) {
          fetchBackups()
        }
      } catch (err) {
        console.error('Error removing backup:', err)
      }
    },
    [fetchBackups]
  )

  useEffect(() => {
    if (user?.email) {
      fetchBackups()
    }
  }, [fetchBackups, user?.email])

  return {
    addBackup,
    loadAccount,
    createCredential,
    verifyCredential,
    removeBackup,
    fetchBackups,
    backups,
    status
  }
}

export default useAccountSigner
