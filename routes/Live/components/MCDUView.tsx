import { Box, Button, Stack, Typography } from '@mui/material'
import React from 'react'
import { IvaoPilot } from 'types'
import image from '../../../public/img/cockpit_view.jpg'
import Image from 'next/image'

interface Props {
  pilot?: IvaoPilot
  onDisconnect: () => void
}
const MCDUView = ({ pilot, onDisconnect }: Props) => {
  return (
    <Box>
      <Image src={image} fill objectFit='none' alt='flight' style={{ opacity: 0.4, filter: 'blur(0.2rem)' }} />
      <Stack direction='row' justifyContent='center' sx={{ fontFamily: 'B612 Mono', zIndex: -1 }}>
        <Stack justifyContent='space-between' sx={{ zIndex: 1 }}>
          <Box width={640} height={480} bgcolor='secondary.dark' p={2} sx={{ boxShadow: '0 0 100px inset #000' }}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography paragraph sx={{ fontFamily: 'B612 Mono' }}>
                Already connected, tracking...
              </Typography>
              <Typography fontSize={28} paragraph sx={{ fontFamily: 'B612 Mono', fontWeight: 500 }}>
                {pilot?.flightPlan.departureId}/{pilot?.flightPlan.arrivalId}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              {pilot?.lastTrack.onGround ? 'En tierra' : 'En el aire'}
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Estado ({pilot?.lastTrack.state})</Typography>
          </Box>
          <Button variant='text' color='secondary' onClick={onDisconnect}>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Disconnect</Typography>
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default MCDUView
