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
import useAccountSigner from 'hooks/useAccountSigner'

interface Props {
  onCreate: () => void
}

const SignInView: FC<Props> = ({ onCreate }) => {
  const [loading, setLoading] = React.useState(false)
  const { onSignIn } = useAccountSigner()

  const handleAccess = React.useCallback(
    async (email: string) => {
      setLoading(true)
      try {
        await onSignIn(email)

        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error(error)
      }
    },
    [onSignIn]
  )

  console.count('SignInView')
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
        <Typography variant='h4' paragraph>
          Insert your email to join
        </Typography>
        <Box className={classes.form}>
          <EmailInput color='primary' onCancel={() => {}} onSubmit={handleAccess} loading={loading} />
          <Box component={Link} href='/signup'>
            <Typography align='right'>or create a new account here.</Typography>
          </Box>
          <Stack direction='row' alignItems='center' spacing={1} mt={2}>
            <Lock fontSize='small' />
            <Typography variant='caption'>
              By entering you agree with terms and conditions, privacy policy and cookies.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}

export default SignInView
