import type { PageProps } from 'types'
import SignInView from 'routes/SignIn'
import LinearProgress from '@mui/material/LinearProgress'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

const SignIn = ({ loading }: PageProps) => {
  const user = useRecoilValue(userState)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (loading) return <LinearProgress />

  return !user ? <SignInView /> : null
}

export default SignIn
