import React, { memo } from 'react'
import GasAvailable from './GasAvailable'
import GasDeposited from './GasDeposited'
import GasFarmed from './GasFarmed'
import GasSupply from './components/GasSupply'
import BigNumber from 'bignumber.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

interface Props {
  airl?: Readonly<BigNumber>
  staking: any
  getAirlBalance: () => void
  getStakingInfo: () => void
  getAirgBalance: () => void
}

const GasStationView = ({ airl, staking, getAirlBalance, getAirgBalance, getStakingInfo }: Props) => {
  return (
    <Box my={5}>
      <Typography variant='h5' gutterBottom>
        Before Start Checklist, deposit AIRL Token in staking and start earning gasoline.
      </Typography>
      <GasSupply />
      <Grid container spacing={2}>
        <GasAvailable airl={airl} getAirlBalance={getAirlBalance} getStakingInfo={getStakingInfo} />
        <GasDeposited staking={staking} getStakingInfo={getStakingInfo} getAirlBalance={getAirlBalance} />
        <GasFarmed getAirgBalance={getAirgBalance} />
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
}

export default memo(GasStationView)
