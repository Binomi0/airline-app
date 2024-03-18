import React, { FC } from 'react'
import EmailInput from './components/EmailInput/EmailInput'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import classes from './signin.module.css'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Image from 'next/image'
import Lock from '@mui/icons-material/Lock'
import useAuth from 'hooks/useAuth'
import { CircularProgress } from '@mui/material'

const SignInView: FC = () => {
  const [loading, setLoading] = React.useState(false)
  const { handleSignIn } = useAuth()

  const handleAccess = React.useCallback(
    async (email: string) => {
      setLoading(true)
      try {
        await handleSignIn(email)

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    },
    [handleSignIn]
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
        <Box>
          {loading ? (
            <Stack direction='row' justifyContent='center'>
              <CircularProgress />
            </Stack>
          ) : (
            <>
              <Typography variant='h4' align='center' paragraph>
                Insert your email to join
              </Typography>
              <Box className={classes.form}>
                <EmailInput color='primary' onCancel={() => {}} onSubmit={handleAccess} loading={false} />
                <Box component={Link} href='/signup'>
                  <Typography color='primary.light' align='right'>
                    or create a new account here.
                  </Typography>
                </Box>
                <Stack direction='row' alignItems='center' spacing={1} mt={2}>
                  <Lock fontSize='small' />
                  <Typography variant='caption'>
                    By entering you agree with terms and conditions, privacy policy and cookies.
                  </Typography>
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Stack>
    </Container>
  )
}

export default SignInView
