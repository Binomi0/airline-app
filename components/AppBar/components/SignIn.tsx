import useAccountSigner from 'hooks/useAccountSigner'
import React from 'react'
import EmailInput from './EmailInput'
import { UserActionStatus } from 'components/AppBar'
import useAuth from 'hooks/useAuth'
import { postApi } from 'lib/api'

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
        const auth = await postApi<{ success: boolean }>('/api/webauthn/check', { email })
        if (auth?.success) {
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
