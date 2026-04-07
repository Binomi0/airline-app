import { useCallback, useState } from 'react'
import useAccountSigner from './useAccountSigner'
import { deleteCookie } from 'cookies-next'
import { notificationSwal } from 'lib/swal'
import { useRouter } from 'next/router'
import { AccountSignerStatus, User } from 'types'
import { useSetRecoilState } from 'recoil'
import { walletStore } from 'store/wallet.atom'
import { authStore } from 'store/auth.atom'
import { userState } from 'store/user.atom'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'
import { ivaoUserStore } from 'store/ivao-user.atom'
import { tokenBalanceStore } from 'store/balance.atom'
import { missionStore } from 'store/mission.atom'
import { ownedNftStore } from 'store/ownedNft.atom'
import { aircraftStore } from 'store/aircraft.atom'
import { pilotStore } from 'store/pilot.atom'
import axios from 'config/axios'
import useWallet from 'hooks/useWallet'

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
  const { initWallet } = useWallet()
  const [status, setStatus] = useState<AccountSignerStatus>()
  const router = useRouter()
  const setWallet = useSetRecoilState(walletStore)
  const setAuthToken = useSetRecoilState(authStore)
  const setUser = useSetRecoilState(userState)
  const setIvaoAuth = useSetRecoilState(ivaoUserAuthStore)
  const setIvaoUser = useSetRecoilState(ivaoUserStore)
  const setBalance = useSetRecoilState(tokenBalanceStore)
  const setMission = useSetRecoilState(missionStore)
  const setOwnedNft = useSetRecoilState(ownedNftStore)
  const setAircraft = useSetRecoilState(aircraftStore)
  const setPilot = useSetRecoilState(pilotStore)

  const handleSignIn = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await verifyCredential(email)
        if (!verified) {
          setStatus('error')
          return
        }

        const { data } = await axios.get<User>('/api/user/get')
        setAuthToken('session_active')
        setUser(data)
        initWallet(data)
        notificationSwal('Connected!', 'You are now logged in')
      } catch (err) {
        const error = err as Error
        console.error('err =>', error)
        setStatus(error.message === 'Missing wallet key' ? 'missingKey' : 'error')
      }
    },
    [setAuthToken, setUser, verifyCredential, initWallet]
  )

  const handleSignUp = useCallback(
    async (email: string) => {
      setStatus('loading')
      try {
        const { verified } = await createCredential(email)
        if (verified) {
          const { data } = await axios.get<User>('/api/user/get')
          setAuthToken('session_active')
          setUser(data)
          initWallet(data)
          notificationSwal('Connected!', 'You are now logged in')
        }
      } catch (err) {
        console.error('[handleSignUp] Error =>', err)
        setStatus('error')
      }
    },
    [createCredential, setAuthToken, setUser, initWallet]
  )

  const handleSignOut = useCallback(() => {
    setWallet((curr) => ({
      ...curr,
      baseSigner: undefined,
      smartSigner: null,
      smartAccountAddress: undefined,
      isLoaded: false,
      isLocked: true,
      isCloudSynced: false
    }))
    deleteCookie('token')
    deleteCookie('isLoggedIn')
    setUser(undefined)
    setAuthToken(undefined)
    setIvaoAuth(undefined)
    setIvaoUser(undefined)
    setBalance({ airl: undefined, airg: undefined })
    setMission(undefined)
    setOwnedNft([])
    setAircraft(undefined)
    setPilot([])
    if (router.asPath !== '/login') router.push('/login')
  }, [
    router,
    setAircraft,
    setAuthToken,
    setBalance,
    setIvaoAuth,
    setIvaoUser,
    setMission,
    setOwnedNft,
    setPilot,
    setUser,
    setWallet
  ])

  return { handleSignIn, handleSignUp, handleSignOut, status }
}

export default useAuth
