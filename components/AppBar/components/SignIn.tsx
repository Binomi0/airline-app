import { Button } from '@mui/material'
import useAccountSigner from 'hooks/useAccountSigner'
import React from 'react'
import { validateEmail } from 'utils'
import EmailInput from './EmailInput'
import axios from 'config/axios'
import { UserActionStatus } from '..'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onInteraction: (value?: UserActionStatus) => void
}

const SignIn = ({ onInteraction }: Props) => {
  const { loadAccount, status } = useAccountSigner()
  const [requestEmail, setRequestEmail] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleSignIn = React.useCallback(
    async (email: string) => validateEmail(email) && loadAccount(email),
    [loadAccount]
  )

  const handleAccess = React.useCallback(
    async (value: string) => {
      setLoading(true)
      try {
        const { data: auth } = await axios.post('/api/webauthn/check', { email: value })
        if (auth.success) {
          await handleSignIn(value)
        }
        setRequestEmail(false)
        onInteraction()
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    },
    [handleSignIn, onInteraction]
  )

  return (
    <>
      {!requestEmail && (
        <Button
          disabled={status === 'loading' || loading}
          variant='contained'
          color='secondary'
          onClick={() => {
            setRequestEmail(true)
            onInteraction('signIn')
          }}
        >
          Connect
        </Button>
      )}
      {requestEmail && (
        <EmailInput
          onCancel={() => {
            setRequestEmail(false)
            onInteraction()
          }}
          onSubmit={handleAccess}
          loading={loading}
        />
      )}
    </>
  )
}

export default SignIn
