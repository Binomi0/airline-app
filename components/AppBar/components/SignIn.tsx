import useAccountSigner from 'hooks/useAccountSigner'
import React from 'react'
import { validateEmail } from 'utils'
import EmailInput from './EmailInput'
import axios from 'config/axios'
import { UserActionStatus } from 'components/AppBar'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onInteraction: (value?: UserActionStatus) => void
}

const SignIn = ({ onInteraction }: Props) => {
  const { onSignIn, status } = useAccountSigner()
  const [loading, setLoading] = React.useState(false)

  const handleSignIn = React.useCallback(
    async (email: string) => validateEmail(email) && (await onSignIn(email)),
    [onSignIn]
  )

  const handleAccess = React.useCallback(
    async (value: string) => {
      setLoading(true)
      try {
        const { data: auth } = await axios.post('/api/webauthn/check', { email: value })
        if (auth.success) {
          await handleSignIn(value)
        } else {
          console.debug('Crendential not set, maybe ask for passkey process')
        }

        onInteraction()
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    },
    [handleSignIn, onInteraction]
  )

  return (
    <EmailInput onCancel={() => onInteraction()} onSubmit={handleAccess} loading={status === 'loading' || loading} />
  )
}

export default SignIn
