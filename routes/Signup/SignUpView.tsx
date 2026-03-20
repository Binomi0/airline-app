import React, { FC, useCallback } from 'react'
import EmailInput from './components/EmailInput'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import classes from './signup.module.css'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Lock from '@mui/icons-material/Lock'
import useAuth from 'hooks/useAuth'
import CircularProgress from '@mui/material/CircularProgress'
import { validateEmail } from 'utils'
import CodeInput from 'components/AppBar/components/CodeInput'
import { useRouter } from 'next/router'
import { postApi } from 'lib/api'

const SignUpView: FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { handleSignUp } = useAuth()
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [requestCode, setRequestCode] = React.useState(false)

  const handleAccess = React.useCallback(
    async (value: string) => {
      if (!validateEmail(value)) return

      try {
        setLoading(true)
        const user = await postApi<{ success: boolean; emailVerified?: boolean }>('/api/user/check', {
          email: value
        })
        if (user?.success && user?.emailVerified) {
          router.push('/signin')
          return
        }
        // No existe usuario en la DB con este email
        const data = await postApi<{ success: boolean }>('/api/user/create', { email: value })
        if (data?.success) {
          setEmail(value)
          setRequestCode(true)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(error)
      }
    },
    [router]
  )

  const handleValidateCode = useCallback(
    async (code: string) => {
      setLoading(true)
      if (!email) throw new Error('Missing email')

      try {
        await postApi('/api/user/validate', { code, email })
        await handleSignUp(email)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.error('[handleValidateCode] ERROR =>', err)
      }
    },
    [email, handleSignUp]
  )

  return (
    <Container>
      <Stack className={classes.wrapper} justifyContent='center' alignItems='center'>
        <Image
          priority
          sizes='(max-width: 768px) 100vw, 33vw'
          width={256}
          height={256}
          src='/logo-weifly.png'
          alt='weifly logo'
        />
        <Typography align='center' variant='h1'>
          Welcome to WeiFly
        </Typography>
        {loading ? (
          <Stack direction='row' justifyContent='center'>
            <CircularProgress />
          </Stack>
        ) : (
          <Box>
            <Typography variant='h4' paragraph>
              Create new account
            </Typography>

            <Box className={classes.form}>
              <>
                {requestCode ? (
                  <CodeInput
                    onCancel={() => {
                      setRequestCode(false)
                    }}
                    onSubmit={handleValidateCode}
                    loading={false}
                  />
                ) : (
                  <EmailInput
                    color='primary'
                    onCancel={() => {
                      setRequestCode(false)
                    }}
                    onSubmit={handleAccess}
                    loading={false}
                  />
                )}
              </>
              <Stack direction='row' alignItems='center' spacing={1} mt={2}>
                <Lock fontSize='small' />
                <Typography variant='caption'>
                  By entering you agree with terms and conditions, privacy policy and cookies.
                </Typography>
              </Stack>
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  )
}

export default SignUpView
