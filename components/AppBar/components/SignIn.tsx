import useAccountSigner from 'hooks/useAccountSigner'
import React from 'react'
import { validateEmail } from 'utils'
import EmailInput from './EmailInput'
import axios from 'config/axios'
import { UserActionStatus } from 'components/AppBar'
import useAuth from 'hooks/useAuth'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onInteraction: (value?: UserActionStatus) => void
}

const SignIn = ({ onInteraction }: Props) => {
  const { status } = useAccountSigner()
  const { handleSignIn, handleSignUp } = useAuth()
  const [loading, setLoading] = React.useState(false)

  const handleAccess = React.useCallback(
    async (value: string) => {
      setLoading(true)
      try {
        if (validateEmail(value)) {
          const { data: auth } = await axios.post('/api/webauthn/check', { email: value })
          if (auth.success) {
            await handleSignIn(value)
          } else {
            await handleSignUp(value)
            console.debug('Crendential not set, maybe ask for passkey process')
          }

          onInteraction()
          setLoading(false)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [handleSignIn, handleSignUp, onInteraction]
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
