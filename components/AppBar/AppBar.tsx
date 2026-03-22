import React, { useEffect, useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import useScrollTrigger from '@mui/material/useScrollTrigger'

import useMediaQuery from '@mui/material/useMediaQuery'
import Snackbar from '@mui/material/Snackbar'
import { useMainProviderContext } from 'context/MainProvider'
import useAccountSigner from 'hooks/useAccountSigner'
import { AppBarSnack, UserActionStatus } from 'components/AppBar'
import AppBarAuth from './components/AppBarAuth'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import { smartAccountAddressStore } from 'store/wallet.atom'
import { themeStore } from 'store/theme.atom'
import { useTokenProviderContext } from 'context/TokenProvider'
import styles from './appbar.module.css'
import { AlertTitle, Container, Box, Button } from '@mui/material'
import Link from 'next/link'

function base64URLEncode(str: string) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const verifier = 'user.id'
const challengeMethod = 'plain' // S256
const challenge = base64URLEncode(verifier)
const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

const CustomAppBar = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const { getBalances } = useTokenProviderContext()
  const trigger = useScrollTrigger()
  const { status } = useAccountSigner()
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const user = useRecoilValue(userState)
  const theme = useRecoilValue(themeStore)
  const [userActionStarted, setUserActionStarted] = useState<UserActionStatus>()
  const [snack, setSnack] = useState<AppBarSnack>(initialSnackState)



  useEffect(() => {
    setSnack({ open: status === 'missingKey', message: 'Missing Key', status: 'error' })
    if (status === 'error') {
      setSnack({ open: status === 'error', message: 'An error has occoured', status: 'error' })
      setUserActionStarted(undefined)
    }
  }, [status])

  useEffect(() => {
    getBalances()
  }, [getBalances])

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(initialSnackState)}
      >
        <Alert onClose={() => setSnack(initialSnackState)} severity={snack.status} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
      <AppBar
        position='sticky'
        elevation={trigger ? 4 : 0}
        sx={{
          background: (t) => (t.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'),
          backdropFilter: 'blur(12px)',
          color: (t) => t.palette.text.primary,
          backgroundImage: 'none',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ m: 0, p: 0 }}>
          <IconButton
            onClick={() => toggleSidebar('left')}
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Link href='/'>
            <img src={theme === 'dark' ? '/logo64x64-white.png' : '/logo64x64.png'} alt='logo' width={32} height={32} />
          </Link>
          {matches ? (
            <Typography ml={2} variant='h6' component='div' sx={{ flexGrow: 1 }}>
              WeiFly (Testnet)
            </Typography>
          ) : (
            <Typography ml={2} variant='h6' component='div' sx={{ flexGrow: 1 }}>
              {' '}
            </Typography>
          )}
          {user && (
            <Box mr={2}>
              <Link href='/download'>
                <Button color='inherit' size='small' variant='outlined' sx={{ borderRadius: 3 }}>
                  Descargar App
                </Button>
              </Link>
            </Box>
          )}
          {matches && smartAccountAddress && (
            <Stack onClick={() => navigator.clipboard.writeText(smartAccountAddress)} className={styles.card}>
              <img className={styles.cardImage} width={8} src='/logos/eth-diamond-purple.png' alt='Ethereum logo' />
              <Typography fontWeight={700} fontFamily='Sora' variant='caption'>
                {maskAddress(smartAccountAddress)}
              </Typography>
            </Stack>
          )}
          <AppBarAuth
            toggleSidebar={toggleSidebar}
            setUserActionStarted={setUserActionStarted}
            userActionStarted={userActionStarted}
            user={user}
          />
        </Toolbar>
      </AppBar>
      {user && !user?.vaUser && (
        <Container>
          <Alert
            severity='warning'
            action={
              <Typography
                color='primary.contrastText'
                variant='button'
                component='a'
                href={`https://sso.ivao.aero/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_IVAO_ID}&state=${user?.id}&scope=openid profile flight_plans:read bookings:read tracker email&code_challenge_method=${challengeMethod}&code_challenge=${challenge}`}
              >
                Log In with IVAO
              </Typography>
            }
          >
            <AlertTitle>Connect your IVAO account</AlertTitle>
          </Alert>
        </Container>
      )}
    </>
  )
}

export default CustomAppBar
