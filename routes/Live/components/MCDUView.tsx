import React, { useRef } from 'react'
import { IvaoPilot } from 'types'
import image from '../../../public/img/cockpit_view.jpg'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
// import MiniMap from './MiniMap'

interface Props {
  pilot: IvaoPilot
  onDisconnect: () => void
}
const MCDUView = ({ pilot, onDisconnect }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null)

  if (!pilot) return <LinearProgress />

  return (
    <Box ref={boxRef}>
      {/* <MiniMap pilot={pilot} /> */}
      <Image src={image} fill objectFit='none' alt='flight' style={{ opacity: 0.4, filter: 'blur(0.2rem)' }} />
      <Stack direction='row' justifyContent='center' sx={{ fontFamily: 'B612 Mono', zIndex: 10 }}>
        <Stack justifyContent='space-between' sx={{ zIndex: 1 }}>
          <Box width={640} height={480} bgcolor='secondary.dark' p={2} sx={{ boxShadow: '0 0 100px inset #000' }}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography paragraph sx={{ fontFamily: 'B612 Mono' }}>
                Connected, tracking... {pilot.callsign}
              </Typography>
              <Typography fontSize={28} paragraph sx={{ fontFamily: 'B612 Mono', fontWeight: 500 }}>
                {pilot.flightPlan.departureId}/{pilot.flightPlan.arrivalId}
              </Typography>
            </Stack>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              {pilot.lastTrack.onGround ? 'En tierra' : 'En el aire'}
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Estado ({pilot.lastTrack.state})</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Speed ({pilot.lastTrack.groundSpeed}) kt/h</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>Rating ({pilot.rating})</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>People On Board {pilot.flightPlan.peopleOnBoard}</Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              To arrival distance {Math.floor(pilot.lastTrack.arrivalDistance || 0)} miles
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              From departure distance {Math.floor(pilot.lastTrack.departureDistance || 0)} miles
            </Typography>
            <Typography sx={{ fontFamily: 'B612 Mono' }}>
              SQUACK{' '}
              {Number(pilot.lastTrack.transponder) < 1000
                ? `0${pilot.lastTrack.transponder}`
                : pilot.lastTrack.transponder}
            </Typography>
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
