import React, { memo } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import GasAvailable from './GasAvailable'
import GasDeposited from './GasDeposited'
import GasFarmed from './GasFarmed'
import GasSupply from './components/GasSupply'

const GasStationView = () => (
  <Box my={5}>
    <Typography variant='h5' gutterBottom>
      Before Start Checklist, deposit AIRL Token in staking and start earning gasoline.
    </Typography>
    <GasSupply />
    <Grid container spacing={2}>
      <GasAvailable />
      <GasDeposited />
      <GasFarmed />
    </Grid>
  </Box>
)

export default memo(GasStationView)
