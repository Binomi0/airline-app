import { Stack, Typography } from '@mui/material'
import GppBadIcon from '@mui/icons-material/GppBad'

const Disconnected = () => (
  <Stack mt={10} justifyContent='center' spacing={10} alignItems='center'>
    <GppBadIcon sx={{ fontSize: 120 }} color='error' />
    <Typography fontWeight={600} variant='h2' paragraph fontFamily='B612 Mono' textTransform='uppercase'>
      Restricted Area
    </Typography>
    <Typography variant='h4' paragraph fontFamily='B612 Mono'>
      You need clearance to enter here
    </Typography>
  </Stack>
)

export default Disconnected
