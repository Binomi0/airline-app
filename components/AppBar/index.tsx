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
import { useAuthProviderContext } from 'context/AuthProvider'
import axios from 'config/axios'

type CreatingState = 'signIn' | 'signUp' | 'validate' | undefined

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')
const validateEmail = (email: string) => {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return expression.test(email)
}

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()
  const { signUp, signIn, signOut, status } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [creating, setCreating] = useState<CreatingState>()
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthProviderContext()
  const [snackOpen, setSnackOpen] = useState(false)

  const handleSignUp = useCallback((email: string) => validateEmail(email) && signUp(email), [signUp])
  const handleSignIn = useCallback((email: string) => validateEmail(email) && signIn(email), [signIn])

  const handleValidateCode = useCallback(async () => {
    const code = codeRef.current?.value

    if (!email || !code) return

    try {
      await axios.post('/api/user/validate', { code, email })
      handleSignUp(email)
    } catch (err) {
      console.log('[handleValidateCode] ERROR =>', err)
    }

    setCreating(undefined)
  }, [email, handleSignUp])

  const handleAccess = useCallback(async () => {
    if (!inputRef.current?.value) {
      throw new Error('Missing email')
    }
    const email = inputRef.current.value

    if (creating === 'signIn') {
      console.log('Signing in')
      handleSignIn(email)
      setCreating(undefined)
    } else if (creating === 'signUp') {
      console.log('Signing up')
      try {
        const user = await axios.post('/api/user', { email }).then((r) => r.data)
        if (user.success) {
          handleSignUp(email)
          setCreating(undefined)
        } else {
          const response = await axios.post('/api/user/create', { email })
          if (response.data.success) {
            setEmail(email)
            setCreating('validate')
          }
        }
      } catch (err) {
        console.log('[handleAccess] ERROR =>', err)
      }
    }
  }, [creating, handleSignIn, handleSignUp])

  const handleSignOut = useCallback(() => {
    signOut()
  }, [signOut])

  const handleAddBackup = useCallback(() => {
    if (user?.email) signUp(user?.email)
  }, [signUp, user?.email])

  useEffect(() => {
    setSnackOpen(status === 'missingKey')
  }, [status])

  console.log({ status })
  console.log({ snackOpen })

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert onClose={() => setSnackOpen(false)} severity='success' sx={{ width: '100%' }}>
          Missing key
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
                    <Button variant='contained' onClick={handleAccess}>
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
                      variant='contained'
                      color='secondary'
                      onClick={() => {
                        setCreating('signIn')
                      }}
                    >
                      Connect
                    </Button>
                    <Button
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
                <Button variant='contained' color='success' onClick={handleAddBackup}>
                  Add Backup
                </Button>
                <Button variant='contained' color='error' onClick={handleSignOut}>
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
