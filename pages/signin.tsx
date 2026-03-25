import SignInView from 'routes/SignIn'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

const SignIn = () => {
  const user = useRecoilValue(userState)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return !user ? <SignInView /> : null
}

export default SignIn
