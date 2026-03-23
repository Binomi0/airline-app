import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import LoginView from 'routes/Login'
import { userState } from 'store/user.atom'

const Login = () => {
  const user = useRecoilValue(userState)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (!user.onboarded) {
        router.push('/onboarding')
      } else {
        router.push('/')
      }
    }
  }, [user, router])

  return !user ? <LoginView /> : null
}

export default Login
