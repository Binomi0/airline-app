import { useCallback, useState } from 'react'
import {
  startAuthentication,
  startRegistration,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  base64URLStringToBuffer
} from '@simplewebauthn/browser'
import { backupDoneSwal, backupErrorSwal } from 'lib/swal'
import { AccountSignerStatus, WebAuthnUri, Authenticator, LoginChallengeResponse } from 'types'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { postApi } from 'lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetcher } from 'utils'

interface UseAccountSignerReturnType {
  addBackup: () => Promise<void>
  createCredential: (email: string) => Promise<{ verified: boolean; token?: string; error?: string }>
  // eslint-disable-next-line no-unused-vars
  verifyCredential: (email: string) => Promise<{
    verified: boolean
    token?: string
    error?: string
    prfSecret?: ArrayBuffer
  }>
  removeBackup: (credentialID: string) => Promise<void>
  fetchBackups: () => Promise<void>
  backups: Authenticator[]
  status: AccountSignerStatus
}

const useAccountSigner = (): UseAccountSignerReturnType => {
  const user = useRecoilValue(userState)
  const [status, setStatus] = useState<AccountSignerStatus>()
  const queryClient = useQueryClient()

  const { data: backupsData, refetch: fetchBackups } = useQuery<{ authenticators: Authenticator[] }>({
    queryKey: ['webauthn-backups', user?.email],
    queryFn: () => fetcher('/api/webauthn/get'),
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  const backups = backupsData?.authenticators || []

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
    } catch (err: unknown) {
      console.error(err)
      setStatus('error')
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { verified: false, error: errorMessage }
    }
  }, [])

  const verifyCredential = useCallback(async (email: string) => {
    try {
      const options = await postApi<PublicKeyCredentialRequestOptionsJSON>(WebAuthnUri.LOGIN, { email })
      if (!options) return { verified: false }
      // @ts-expect-error prf is not defined in the type
      if (options.extensions?.prf?.eval?.first) {
        // @ts-expect-error prf is not defined in the type
        options.extensions.prf.eval.first = base64URLStringToBuffer(options.extensions.prf.eval.first)
      }
      const data = await startAuthentication({ optionsJSON: options })
      const validation: LoginChallengeResponse | undefined = await postApi(WebAuthnUri.LOGIN_CHALLENGE, {
        data,
        email
      })

      setStatus(validation?.verified ? 'success' : 'error')

      return {
        verified: Boolean(validation?.verified),
        token: validation?.token,
        // @ts-expect-error prf is not defined in the type
        prfSecret: data.clientExtensionResults.prf.results.first
      }
    } catch (err: unknown) {
      console.error(err)
      setStatus('error')
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      return { verified: false, error: errorMessage }
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
        queryClient.invalidateQueries({ queryKey: ['webauthn-backups', user.email] })
      } else {
        backupErrorSwal(createError as string)
      }
    } catch (err) {
      const error = err as Error
      console.error('[addBackup] Error =>', err)
      setStatus(error.message === 'Missing private key' ? 'missingKey' : 'error')
    }
  }, [createCredential, queryClient, user?.email, user?.id, verifyCredential])

  const removeBackup = useCallback(
    async (credentialID: string) => {
      try {
        const response = await postApi<{ success: boolean }>('/api/webauthn/remove', { credentialID })
        if (response?.success && user?.email) {
          queryClient.invalidateQueries({ queryKey: ['webauthn-backups', user.email] })
        }
      } catch (err) {
        console.error('Error removing backup:', err)
      }
    },
    [queryClient, user?.email]
  )

  return {
    addBackup,
    createCredential,
    verifyCredential,
    removeBackup,
    fetchBackups: async () => {
      await fetchBackups()
    },
    backups,
    status
  }
}

export default useAccountSigner
