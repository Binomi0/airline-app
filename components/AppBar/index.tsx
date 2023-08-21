import React, { useCallback } from 'react'
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography, useScrollTrigger } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMainProviderContext } from 'context/MainProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import LicenseBar from './components/LicenseBar'
import GasBalanceBar from './components/GasBalanceBar'
import AirBalanceBar from './components/AirBalanceBar'
import useAccountSigner from 'hooks/useAccountSigner'
import { useAlchemyProviderContext } from 'context/AlchemyProvider/AlchemyProvider.context'

const maskAddress = (address?: string) => (address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '')

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()
  const { signUp, signIn, signOut } = useAccountSigner()
  const { smartAccountAddress } = useAlchemyProviderContext()

  const handleSignUp = useCallback(() => {
    signUp()
  }, [signUp])

  const handleSignIn = useCallback(() => {
    signIn()
  }, [signIn])

  const handleSignOut = useCallback(() => {
    signOut()
  }, [signOut])

  const handleAddBackup = useCallback(() => {
    signUp()
  }, [signUp])

  return (
    <AppBar position='sticky' color={trigger ? 'primary' : 'transparent'}>
      <Toolbar>
        <IconButton onClick={toggleSidebar} size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          {matches ? 'Decentralized Virtual Airline' : 'DVA'}
        </Typography>
        <Box mr={2} bgcolor='secondary.main' borderRadius={5} px={2}>
          <Typography fontWeight={600} variant='caption'>{maskAddress(smartAccountAddress)}</Typography>
        </Box>
        <Stack direction='row' alignItems='center' height={50} spacing={1}>
          <LicenseBar />
          {matches && (
            <>
              <GasBalanceBar />
              <AirBalanceBar />
            </>
          )}
          {!smartAccountAddress ? (
            <>
              <Button variant='contained' color='secondary' onClick={handleSignIn}>
                Connect
              </Button>
              <Button variant='contained' onClick={handleSignUp}>
                Create
              </Button>
            </>
          ) : (
            <>
              <Button variant='contained' color='error' onClick={handleSignOut}>
                Log Out
              </Button>
              <Button variant='contained' color='success' onClick={handleAddBackup}>
                Add Backup
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
