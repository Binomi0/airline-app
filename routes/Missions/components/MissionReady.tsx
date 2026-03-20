import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import React from 'react'
import MissionAircraft from 'routes/Missions/components/MissionAircraft'
import { Mission } from 'types'

const MissionReady: React.FC<{
  mission?: Mission
  onCancel: () => void
}> = ({ mission, onCancel }) => {
  const address = useRecoilValue(smartAccountAddressStore)

  return (
    <Fade in={!!mission && !!address} unmountOnExit>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h2'>{mission?.origin}</Typography>
            </Box>
            <Box
              sx={{
                height: 24,
                background: 'white',
                p: 0,
                mx: 2,
                flex: 1,
                textAlign: 'center',
                borderRadius: 10
              }}
            >
              <Typography color='common.black' fontWeight={700} letterSpacing={2}>
                {Intl.NumberFormat('es', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(mission?.distance || 0)}{' '}
                NM
              </Typography>
            </Box>
            <Box>
              <Typography variant='h2'>{mission?.destination}</Typography>
            </Box>
          </Stack>
          <Box my={4}>
            <Alert severity='info'>
              <AlertTitle>
                Misión ({mission?.type}): {mission?.details?.name}
              </AlertTitle>
              <Typography variant='subtitle2'>{mission?.details?.description}</Typography>
            </Alert>
          </Box>

          <Box my={4}>
            <MissionAircraft mission={mission} onCancel={onCancel} />
          </Box>
        </Grid>
      </Grid>
    </Fade>
  )
}

export default MissionReady
