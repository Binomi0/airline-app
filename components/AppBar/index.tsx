import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Button,
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
import { accountBackupSwal, askExportKeySwal, missingExportKeySwal, signedOutSwal } from 'lib/swal'
import { downloadFile } from 'utils'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { useAuthProviderContext } from 'context/AuthProvider'

export type UserActionStatus = 'signIn' | 'signUp' | undefined
type AppBarSnackStatus = 'success' | 'error' | 'warning' | 'info'
interface AppBarSnack {
  open: boolean
  message: string
  status: AppBarSnackStatus
}

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()
  const { addBackup, status, handleSignOut } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { user } = useAuthProviderContext()
  const [userActionStarted, setUserActionStarted] = useState<UserActionStatus>()
  const [snack, setSnack] = useState<AppBarSnack>(initialSnackState)

  const handleAddBackup = useCallback(async () => {
    const confirm = await accountBackupSwal()
    if (confirm.isConfirmed) addBackup()
  }, [addBackup])

  const handleExportKey = useCallback(async () => {
    if (!user?.id || !user?.address) throw new Error('Missing params')

    const base64Key = localStorage.getItem(user.id)
    if (!base64Key) return missingExportKeySwal()

    const {isConfirmed} = await askExportKeySwal()
    if (isConfirmed) downloadFile(base64Key, String(user.address))
  }, [user?.address, user?.id])

  const onSignOut = React.useCallback(async () => {
    const confirm = await signedOutSwal()
    if (confirm.isConfirmed) handleSignOut()
  }, [handleSignOut])

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
            onClick={toggleSidebar}
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
          <Box mr={2} bgcolor='secondary.main' borderRadius={5} px={2}>
            <Typography fontWeight={600} variant='caption'>
              {maskAddress(smartAccountAddress)}
            </Typography>
          </Box>
          <Stack direction='row' alignItems='center' height={50} spacing={1}>
            <LicenseBar />
            {matches && smartAccountAddress && (
              <>
                <GasBalanceBar />
                <AirBalanceBar />
              </>
            )}
            {!user ? (
              <>
                {(!userActionStarted || userActionStarted === 'signIn') && (
                  <SignIn onInteraction={setUserActionStarted} />
                )}
                {(!userActionStarted || userActionStarted === 'signUp') && (
                  <SignUp onInteraction={setUserActionStarted} />
                )}
              </>
            ) : (
              <>
                <Button disabled={status === 'loading'} variant='contained' color='success' onClick={handleAddBackup}>
                  Add Account Backup
                </Button>
                <Button disabled={status === 'loading'} variant='contained' color='warning' onClick={handleExportKey}>
                  Export Wallet
                </Button>
                <Button disabled={status === 'loading'} variant='contained' color='error' onClick={onSignOut}>
                  Log Out
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default CustomAppBar
