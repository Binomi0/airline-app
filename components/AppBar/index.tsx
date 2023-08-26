import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  TextField,
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
import axios from 'config/axios'
import { useSession } from 'next-auth/react'
import Swal from 'sweetalert2'
import Close from '@mui/icons-material/Close'
import { accountBackupSwal, missingExportKeySwal } from 'lib/swal'
import { downloadFile } from 'utils'
import LogIn from 'components/LogIn'

type CreatingState = 'signIn' | 'signUp' | 'validate' | undefined
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
  const { signUp, signIn, signOut, addBackup, status } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [creating, setCreating] = useState<CreatingState>()
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const [snack, setSnack] = useState<AppBarSnack>(initialSnackState)

  const handleSignUp = useCallback(async (email: string) => validateEmail(email) && signUp(email), [signUp])

  const handleAccess = useCallback(async () => {
    if (!inputRef.current?.value) {
      throw new Error('Missing email')
    }
    const email = inputRef.current.value

    if (creating === 'signIn') {
      await handleSignIn(email)
      setCreating(undefined)
      setSnack({ open: true, message: 'Wellcome back!', status: 'success' })
    } else if (creating === 'signUp') {
      setEmail(email)
      setCreating((await handleSignUp(email)) ? 'validate' : undefined)
    }
  }, [creating, handleSignIn, handleSignUp])

  const handleAddBackup = useCallback(async () => {
    const confirm = await accountBackupSwal()
    if (confirm.isConfirmed) addBackup()
  }, [addBackup])

  const handleExportKey = useCallback(() => {
    // @ts-ignore
    if (!session?.user?.id || !session?.user?.address) {
      throw new Error('Missing params')
    }
    // @ts-ignore
    const base64Key = localStorage.getItem(session.user.id)
    if (!base64Key) {
      return missingExportKeySwal()
    }

    // @ts-ignore
    downloadFile(base64Key, String(session.user.address))

    // @ts-ignore
  }, [session?.user?.address, session?.user?.id])

  useEffect(() => {
    setSnack({ open: status === 'missingKey', message: 'Missing Key', status: 'error' })
    setSnack({ open: status === 'error', message: 'An error has occoured', status: 'error' })
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
            {!smartAccountAddress ? (
              <>
                <LogIn />

                {!creating && (
                  <>
                    <Button
                      disabled={status === 'loading'}
                      variant='contained'
                      color='secondary'
                      onClick={() => {
                        setCreating('signIn')
                      }}
                    >
                      Connect
                    </Button>
                    <Button
                      disabled={status === 'loading'}
                      variant='contained'
                      onClick={() => {
                        setCreating('signUp')
                      }}
                    >
                      Create
                    </Button>
                  </>
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
                <Button disabled={status === 'loading'} variant='contained' color='error' onClick={handleSignOut}>
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
