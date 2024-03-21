import axios from 'config/axios'
import React, { useCallback } from 'react'
import { validateEmail } from 'utils'
import EmailInput from './EmailInput'
import CodeInput from './CodeInput'
import { UserActionStatus } from 'components/AppBar'
import CircularProgress from '@mui/material/CircularProgress'
import useAuth from 'hooks/useAuth'

interface Props {
  // eslint-disable-next-line no-unused-vars
  onInteraction: (value?: UserActionStatus) => void
}

const SignUp = ({ onInteraction }: Props) => {
  const { handleSignUp } = useAuth()
  const [requestCode, setRequestCode] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleAccess = React.useCallback(
    async (value: string) => {
      if (!validateEmail(value)) return

      try {
        setLoading(true)
        const { data: user } = await axios.post<{ success: boolean; emailVerified?: boolean }>('/api/user/check', {
          email: value
        })
        if (user.success && user.emailVerified) {
          onInteraction('signIn')
          return
        }
        // No existe usuario en la DB con este email
        const { data } = await axios.post<{ success: boolean }>('/api/user/create', { email: value })
        if (data.success) {
          setEmail(value)
          setRequestCode(true)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(error)
      }
    },
    [onInteraction]
  )

  const handleValidateCode = useCallback(
    async (code: string) => {
      setLoading(true)
      if (!email) throw new Error('Missing email')

      try {
        await axios.post('/api/user/validate', { code, email })
        await handleSignUp(email)
        setLoading(false)
        onInteraction()
      } catch (err) {
        setLoading(false)
        console.error('[handleValidateCode] ERROR =>', err)
      }
    },
    [email, handleSignUp, onInteraction]
  )

  return (
    <>
      {loading && <CircularProgress />}
      {requestCode ? (
        <CodeInput
          onCancel={() => {
            setRequestCode(false)
            onInteraction()
          }}
          onSubmit={handleValidateCode}
          loading={loading}
        />
      ) : (
        <EmailInput
          color='primary'
          onCancel={() => {
            setRequestCode(false)
            onInteraction()
          }}
          onSubmit={handleAccess}
          loading={loading}
        />
      )}
    </>
  )
}

export default SignUp
