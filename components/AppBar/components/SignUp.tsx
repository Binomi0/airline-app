import { Button } from '@mui/material'
import axios from 'axios'
import useAccountSigner from 'hooks/useAccountSigner'
import React, { useCallback } from 'react'
import { validateEmail } from 'utils'
import EmailInput from './EmailInput'
import CodeInput from './CodeInput'
import { UserActionStatus } from '..'
import { useAuthProviderContext } from 'context/AuthProvider'

interface Props {
  onInteraction: (value?: UserActionStatus) => void
}

const SignUp = ({ onInteraction }: Props) => {
  const { handleSignUp, status } = useAccountSigner()
  const { user } = useAuthProviderContext()
  const [requestEmail, setRequestEmail] = React.useState(false)
  const [requestCode, setRequestCode] = React.useState(false)
  const [email, setEmail] = React.useState('')

  const onSignUp = useCallback(async (email: string) => validateEmail(email) && handleSignUp(email), [handleSignUp])

  const handleAccess = React.useCallback(
    async (value: string) => {
      onInteraction('signUp')
      const { data: user } = await axios.post('/api/user/check', { email: value })
      if (user.success) {
        if (!user.emailVerified) {
          await axios.post('/api/user/create', { email: value })
        }
        setEmail(value)
        setRequestEmail(false)
        setRequestCode(!user.emailVerified)
        onInteraction()
      } else {
        const { data } = await axios.post('/api/user/create', { email: value })
        if (data.success) {
          setEmail(value)
          setRequestCode(true)
          setRequestEmail(false)
        }
      }
    },
    [onInteraction]
  )

  const handleValidateCode = useCallback(
    async (code: string) => {
      if (!email) throw new Error('Missing email')

      try {
        await axios.post('/api/user/validate', { code, email })
        await onSignUp(email)
      } catch (err) {
        console.error('[handleValidateCode] ERROR =>', err)
      }
      onInteraction()
    },
    [email, onSignUp, onInteraction]
  )

  return (
    <>
      {!user && (
        <>
          {!requestCode && !requestEmail && (
            <Button
              disabled={status === 'loading'}
              variant='contained'
              onClick={() => {
                setRequestEmail(true)
              }}
            >
              Create Account
            </Button>
          )}
          {requestEmail && <EmailInput onCancel={() => setRequestEmail(false)} onSubmit={handleAccess} />}
          {requestCode && <CodeInput onCancel={() => setRequestCode(false)} onSubmit={handleValidateCode} />}
        </>
      )}
    </>
  )
}

export default SignUp
