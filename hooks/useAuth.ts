import { useCallback, useState } from 'react'
import useAccountSigner from './useAccountSigner'
import { deleteCookie } from 'cookies-next'
import { loginSuccessSwal } from 'lib/swal'
import { useRouter } from 'next/router'
import { AccountSignerStatus } from 'types'
import { useSetRecoilState } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { userState } from 'store/user.atom'
import { authStore } from 'store/auth.atom'

interface UseAuthReturnType {
  // eslint-disable-next-line no-unused-vars
  handleSignIn: (email: string) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  handleSignUp: (email: string) => Promise<void>
  handleSignOut: () => void
  status: AccountSignerStatus
}

const useAuth = (): UseAuthReturnType => {
  const { verifyCredential, createCredential } = useAccountSigner()
  const [status, setStatus] = useState<AccountSignerStatus>()
  const router = useRouter()
  const setWallet = useSetRecoilState(walletStore)
  const setUser = useSetRecoilState(userState)
  const setToken = useSetRecoilState(authStore)

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

        setToken(token)
        loginSuccessSwal()
      } catch (err) {
        const error = err as Error
        console.error('err =>', error)
        setStatus(error.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [setToken, verifyCredential]
  )

  const handleSignUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified, token } = await createCredential(email)
        if (verified) {
          setToken(token)
          loginSuccessSwal()
        }
      } catch (err) {
        console.error('[handleSignUp] Error =>', err)
        setStatus('error')
      }
    },
    [createCredential, setToken]
  )

  const handleSignOut = useCallback(() => {
    setWallet({
      baseSigner: undefined,
      paymasterSigner: undefined,
      smartSigner: undefined,
      smartAccountAddress: '',
      isLoaded: false
    })
    deleteCookie('token')
    setUser(undefined)
    setToken(undefined)
    router.asPath !== '/signin' && router.push('/signin')
  }, [router, setToken, setUser, setWallet])

  return { handleSignIn, handleSignUp, handleSignOut, status }
}

export default useAuth
