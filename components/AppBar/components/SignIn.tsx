import useAccountSigner from 'hooks/useAccountSigner'
import React from 'react'
import EmailInput from './EmailInput'
import axios from 'config/axios'
import { UserActionStatus } from 'components/AppBar'
import useAuth from 'hooks/useAuth'

type UserEmail = string
interface Props {
  // eslint-disable-next-line no-unused-vars
  onInteraction: (value?: UserActionStatus) => void
}

const SignIn = ({ onInteraction }: Props) => {
  const { status } = useAccountSigner()
  const { handleSignIn } = useAuth()
  const [loading, setLoading] = React.useState(false)

  const handleAccess = React.useCallback(
    async (email: UserEmail) => {
      setLoading(true)
      try {
        const { data: auth } = await axios.post('/api/webauthn/check', { email })
        if (auth.success) {
          await handleSignIn(email)
          onInteraction()
        } else {
          onInteraction('signUp')
        }

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    },
    [handleSignIn, onInteraction]
  )

  return (
    <EmailInput
      color='secondary'
      onCancel={() => onInteraction()}
      onSubmit={handleAccess}
      loading={status === 'loading' || loading}
    />
  )
}

export default SignIn
