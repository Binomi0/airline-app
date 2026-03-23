import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React from 'react'
import { User } from 'types'
import Security from './components/AccountSettings'
import VirtualAirlines from './components/VirtualAirlines'
import WalletSettings from './components/WalletSettings'

interface Props {
  hasBackup: boolean
  user: User
}

const SettingsView = ({ hasBackup, user }: Props) => {
  console.log('SettingsView =>', hasBackup)
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Security hasBackup={hasBackup} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WalletSettings user={user} />
        </Grid>
        <Grid item xs={12} md={12}>
          <VirtualAirlines user={user} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default SettingsView
