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
    <Box mt={2}>
      <Typography variant='h2'>How it Works</Typography>
      <Typography>
        To be able to fill your tanks and fly with required gasoline just add AIRL tokens into the Gas Station, this
        mecanish will provide some constant flow of gasoline by minute, once at least 100 liters are ready to collect
        CLAIM button will be unlocked and after pressing it, all farmed gasoline will go to your wallet and will be
        ready for your aircrafts to refuel.
      </Typography>
      <Typography variant='h2'>How many will I get back?</Typography>
      <Typography>
        Rate is 100 Liters by each 1 AIRL token staked during 24 hours (locked in gas station). 100 AIRG (1 AIRL/24h)
      </Typography>
    </Box>
  </Box>
)

export default memo(GasStationView)
