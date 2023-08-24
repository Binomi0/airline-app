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

type CreatingState = 'signIn' | 'signUp' | 'validate' | undefined
type AppBarSnackStatus = 'success' | 'error' | 'warning' | 'info'
interface AppBarSnack {
  open: boolean
  message: string
  status: AppBarSnackStatus
}

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')
const validateEmail = (email: string) => {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return expression.test(email)
}

const initialSnackState: AppBarSnack = { open: false, message: '', status: 'success' }

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()
  const { signUp, signIn, signOut, addBackup,  status } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [creating, setCreating] = useState<CreatingState>()
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const [snack, setSnack] = useState<AppBarSnack>(initialSnackState)

  const handleSignUp = useCallback((email: string) => validateEmail(email) && signUp(email), [signUp])
  const handleSignIn = useCallback((email: string) => validateEmail(email) && signIn(email), [signIn])

  const handleValidateCode = useCallback(async () => {
    const code = codeRef.current?.value

    if (!email || !code) return

    try {
      await axios.post('/api/user/validate', { code, email })
      handleSignUp(email)
      setSnack({ open: true, message: 'Validation code is OK!', status: 'success' })
    } catch (err) {
      setSnack({ open: true, message: 'Validation code wrong :(', status: 'warning' })
      console.error('[handleValidateCode] ERROR =>', err)
    }

    setCreating(undefined)
  }, [email, handleSignUp])

  const handleAccess = useCallback(async () => {
    if (!inputRef.current?.value) {
      throw new Error('Missing email')
    }
    const email = inputRef.current.value

    if (creating === 'signIn') {
      handleSignIn(email)
      setCreating(undefined)
      setSnack({ open: true, message: 'Wellcome back!', status: 'success' })
    } else if (creating === 'signUp') {
      try {
        const user = await axios.post('/api/user', { email }).then((r) => r.data)
        if (user.success) {
          handleSignUp(email)
          setCreating(undefined)
          setSnack({ open: true, message: 'Account Created!', status: 'success' })
        } else {
          const response = await axios.post('/api/user/create', { email })
          if (response.data.success) {
            setEmail(email)
            setCreating('validate')
            setSnack({
              open: true,
              message: 'Review your mail inbox, a validation code has been sent!',
              status: 'info'
            })
          } else {
            setCreating(undefined)
          }
        }
      } catch (err) {
        setCreating(undefined)
        console.error('[handleAccess] ERROR =>', err)
      }
    }
  }, [creating, handleSignIn, handleSignUp])

  const handleSignOut = useCallback(async () => {
    const confirm = await Swal.fire({
      title: 'Sign Out',
      text: 'Are you leaving?',
      showCancelButton: true,
      showConfirmButton: true,
    })
    if (confirm) {
      signOut()
      setSnack({ open: true, message: 'See you soon!', status: 'info' })
    }
  }, [signOut])

  const handleAddBackup = useCallback(async () => {
    if (!session?.user?.email) {
      throw new Error('Missing user session')
    }
    console.log('[handleAddBackup] user =>', session?.user?.email)
    const confirm = await Swal.fire({
      title: 'Account Login Backup',
      text: 'Add another device to log in this site',
      showCancelButton: true,
      showConfirmButton: true,
      icon: 'question'
    })
    if (confirm) {
      addBackup()
    }
  }, [session, addBackup])

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
            {matches && !creating && (
              <>
                <GasBalanceBar />
                <AirBalanceBar />
              </>
            )}
            {!smartAccountAddress ? (
              <>
                {(creating === 'signUp' || creating === 'signIn') && (
                  <Stack direction='row' spacing={2}>
                    <TextField
                      inputProps={{
                        style: { color: 'white' }
                      }}
                      autoFocus
                      variant='outlined'
                      size='small'
                      label='EMAIL'
                      placeholder='Insert your email'
                      inputRef={inputRef}
                    />
                    <Button disabled={status === 'loading'} variant='contained' onClick={handleAccess}>
                      SEND
                    </Button>
                  </Stack>
                )}
                {creating === 'validate' && (
                  <Stack direction='row' spacing={2}>
                    <TextField
                      inputProps={{
                        style: { color: 'white' }
                      }}
                      autoFocus
                      variant='outlined'
                      size='small'
                      label='CODE'
                      placeholder='Insert code'
                      inputRef={codeRef}
                    />
                    <Button variant='contained' onClick={handleValidateCode}>
                      SEND
                    </Button>
                  </Stack>
                )}
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
                  Add Backup
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
