import React, { useEffect, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  IconButton,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMainProviderContext } from 'context/MainProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import LicenseBar from './components/LicenseBar'
import GasBalanceBar from './components/GasBalanceBar'
import AirBalanceBar from './components/AirBalanceBar'
import useAccountSigner from 'hooks/useAccountSigner'
import { useAlchemyProviderContext } from 'context/AlchemyProvider/AlchemyProvider.context'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { useAuthProviderContext } from 'context/AuthProvider'
import { AppBarSnack, UserActionStatus } from 'components/AppBar'

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()
  const { status, } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { user } = useAuthProviderContext()
  const [userActionStarted, setUserActionStarted] = useState<UserActionStatus>()
  const [snack, setSnack] = useState<AppBarSnack>(initialSnackState)

  useEffect(() => {
    setSnack({ open: status === 'missingKey', message: 'Missing Key', status: 'error' })
    setSnack({ open: status === 'error', message: 'An error has occoured', status: 'error' })
    if (status === 'error') {
      setUserActionStarted(undefined)
    }
  }, [status])

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
      <AppBar position='sticky' color={trigger ? 'primary' : 'transparent'}>
        <Toolbar>
          <IconButton
            onClick={() => toggleSidebar('left')}
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {matches ? 'Decentralized Virtual Airline' : 'DVA'}
          </Typography>
          {user && smartAccountAddress && (
            <Box mr={2} bgcolor='secondary.main' borderRadius={5} px={2}>
              <Typography fontWeight={600} variant='caption'>
                {maskAddress(smartAccountAddress)}
              </Typography>
            </Box>
          )}
          <Stack direction='row' alignItems='center' height={50} spacing={1}>
            {!user ? (
              <>
                {userActionStarted !== 'signUp' && <SignIn onInteraction={setUserActionStarted} />}
                {userActionStarted !== 'signIn' && <SignUp onInteraction={setUserActionStarted} />}
              </>
            ) : (
              <>
                <LicenseBar />
                {matches && smartAccountAddress && (
                  <>
                    <GasBalanceBar />
                    <AirBalanceBar />
                  </>
                )}
              </>
            )}
            <IconButton
              onClick={() => toggleSidebar('right')}
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default CustomAppBar
