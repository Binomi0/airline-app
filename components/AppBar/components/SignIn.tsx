import { Button } from '@mui/material'
import useAccountSigner from 'hooks/useAccountSigner'
import { signedOutSwal } from 'lib/swal'
import React from 'react'
import { validateEmail } from 'utils'
import EmailInput from './EmailInput'
import axios from 'config/axios'
import { UserActionStatus } from '..'
import { useAuthProviderContext } from 'context/AuthProvider'

interface Props {
  onInteraction: (value?: UserActionStatus) => void
}

const SignIn = ({ onInteraction }: Props) => {
  const { loadAccount, status, handleSignOut } = useAccountSigner()
  const [requestEmail, setRequestEmail] = React.useState(false)
  const { user } = useAuthProviderContext()

  const handleSignIn = React.useCallback(
    async (email: string) => validateEmail(email) && loadAccount(email),
    [loadAccount]
  )

  const onSignOut = React.useCallback(async () => {
    const confirm = await signedOutSwal()
    if (confirm) {
      handleSignOut()
    }
  }, [handleSignOut])

  const handleAccess = React.useCallback(
    async (value: string) => {
      const { data: auth } = await axios.post('/api/webauthn/check', { email: value })
      if (auth.success) {
        handleSignIn(value)
        setRequestEmail(false)
        onInteraction()
      }
    },
    [handleSignIn, onInteraction]
  )

  return (
    <>
      {user ? (
        <Button disabled={status === 'loading'} variant='contained' color='error' onClick={onSignOut}>
          Log Out
        </Button>
      ) : (
        <>
          {!requestEmail && (
            <Button
              disabled={status === 'loading'}
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
          {requestEmail && <EmailInput onCancel={() => setRequestEmail(false)} onSubmit={handleAccess} />}
        </>
      )}
    </>
  )
}

export default SignIn
