import React, { useCallback, useRef, useState } from 'react'
import { AppBar, Box, Button, IconButton, Stack, TextField, Toolbar, Typography, useScrollTrigger } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMainProviderContext } from 'context/MainProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import LicenseBar from './components/LicenseBar'
import GasBalanceBar from './components/GasBalanceBar'
import AirBalanceBar from './components/AirBalanceBar'
import useAccountSigner from 'hooks/useAccountSigner'
import { useAlchemyProviderContext } from 'context/AlchemyProvider/AlchemyProvider.context'
import { useAuthProviderContext } from 'context/AuthProvider'
import axios from 'axios'

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
  const { signUp, signIn, signOut } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()
  const [creating, setCreating] = useState<CreatingState>()
  const [email, setEmail] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthProviderContext()

  const handleSignUp = useCallback((email: string) => validateEmail(email) && signUp(email), [signUp])
  const handleSignIn = useCallback((email: string) => validateEmail(email) && signIn(email), [signIn])

  const handleValidateCode = useCallback(async () => {
    const code = codeRef.current?.value
    console.log('email: %s, code: %s', email, code)
    if (!email || !code) return
    try {
      await axios.post('/api/user/validate', { code, email })
      handleSignUp(email)
    } catch (err) {
      console.log('ERROR =>', err)
    }
    setCreating(undefined)
  }, [email, handleSignUp])

  const handleAccess = useCallback(async () => {
    if (!inputRef.current?.value) return
    const email = inputRef.current.value

    if (creating === 'signIn') handleSignIn(email)
    else if (creating === 'signUp') {
      const user = await axios.post('/api/user', { email }).then((r) => r.data)
      console.log({ user })
      if (user.emailVerified) {
        handleSignUp(email)
      } else {
        setEmail(email)
        setCreating('validate')
      }
    }
  }, [creating, handleSignIn, handleSignUp])

  const handleSignOut = useCallback(() => {
    signOut()
  }, [signOut])

  const handleAddBackup = useCallback(() => {
    if (user?.email) signUp(user?.email)
  }, [signUp, user?.email])

  console.log({ creating })
  return (
    <>
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
