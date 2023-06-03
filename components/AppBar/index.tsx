import React from 'react'
import { AppBar, IconButton, Stack, Toolbar, Typography, useScrollTrigger } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { ConnectWallet } from '@thirdweb-dev/react'
import { useMainProviderContext } from 'context/MainProvider'
import useMediaQuery from '@mui/material/useMediaQuery'
import LicenseBar from './components/LicenseBar'
import GasBalanceBar from './components/GasBalanceBar'
import AirBalanceBar from './components/AirBalanceBar'

const CustomAppBar: React.FC = () => {
  const matches = useMediaQuery('(min-width:768px)')
  const { toggleSidebar } = useMainProviderContext()
  const trigger = useScrollTrigger()

  return (
    <AppBar position='sticky' color={trigger ? 'primary' : 'transparent'}>
      <Toolbar>
        <IconButton onClick={toggleSidebar} size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          {matches ? 'Decentralized Virtual Airline' : 'DVA'}
        </Typography>
        <Stack direction='row' alignItems='center' height={50} spacing={1}>
          <LicenseBar />
          {matches && (
            <>
              <GasBalanceBar />
              <AirBalanceBar />
            </>
          )}
          <ConnectWallet style={{ height: '50px' }} />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
