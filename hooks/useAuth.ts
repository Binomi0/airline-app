import { useCallback, useState } from 'react'
import useAccountSigner from './useAccountSigner'
import { deleteCookie } from 'cookies-next'
import { loginSuccessSwal } from 'lib/swal'
import { useRouter } from 'next/router'
import { AccountSignerStatus } from 'types'
import { useSetRecoilState } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { authState } from 'store/auth.atom'

interface UseAuthReturnType {
  // eslint-disable-next-line no-unused-vars
  handleSignIn: (email: string) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  handleSignUp: (email: string) => Promise<void>
  handleSignOut: () => void
  status: AccountSignerStatus
}

const useAuth = (): UseAuthReturnType => {
  const { verifyCredential, createCredential, loadAccount } = useAccountSigner()
  const [status, setStatus] = useState<AccountSignerStatus>()
  const router = useRouter()
  const setWallet = useSetRecoilState(walletStore)
  const setUser = useSetRecoilState(userState)
  const setToken = useSetRecoilState(authState)

  const handleSignIn = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified, token } = await verifyCredential(email)
        if (!verified) {
          // User cancelled challenge or timeout
          setStatus('error')
          throw new Error('while verify user credentials')
        }

        await loadAccount(token)
        loginSuccessSwal()
      } catch (err) {
        const error = err as Error
        console.error('err =>', error)
        setStatus(error.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [loadAccount, verifyCredential]
  )

  const handleSignUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await createCredential(email)
        if (verified) {
          await loadAccount()
        }
      } catch (err) {
        console.error('[handleSignUp] Error =>', err)
        setStatus('error')
      }
    },
    [createCredential, loadAccount]
  )

  const handleSignOut = useCallback(() => {
    setWallet({ baseSigner: undefined, smartSigner: undefined, smartAccountAddress: '', isLoaded: false })
    deleteCookie('token')
    setUser(undefined)
    setToken(undefined)
    router.asPath !== '/signin' && router.push('/signin')
  }, [router, setToken, setUser, setWallet])

  return { handleSignIn, handleSignUp, handleSignOut, status }
}

export default useAuth
