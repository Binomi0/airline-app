import type { PageProps } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import SignUpView from 'routes/Signup'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'

const SignUp = ({ loading }: PageProps) => {
  const user = useRecoilValue(userState)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  if (loading) return <LinearProgress />

  return !user ? <SignUpView /> : null
}

export default SignUp
