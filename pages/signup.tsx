import type { PageProps } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import SignUpView from 'routes/Signup'

const SignUp = ({ loading }: PageProps) => {
  if (loading) return <LinearProgress />

  return <SignUpView onCreate={() => {}} />
}

export default SignUp
