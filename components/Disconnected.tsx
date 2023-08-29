import { Box, Typography } from '@mui/material'
import GppGoodIcon from '@mui/icons-material/GppGood'

const Disconnected = () => (
  <Box mt={10} textAlign='center'>
    <GppGoodIcon sx={{ fontSize: 72 }} color='primary' />
    <Typography variant='h2' paragraph>
      Sign in
    </Typography>
    <Typography variant='h4' paragraph>
      Sign in with your wallet to checkout available flights.
    </Typography>
  </Box>
)

export default Disconnected
