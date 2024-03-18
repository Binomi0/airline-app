import type { PageProps } from 'types'
import SignInView from 'routes/SignIn'
import LinearProgress from '@mui/material/LinearProgress'

const SignIn = ({ loading }: PageProps) => {
  if (loading) return <LinearProgress />

  return <SignInView onCreate={() => {}} />
}

export default SignIn
