import React, { memo, useCallback, useState } from 'react'
import { User } from 'types'
// import { filterLEOrigins } from 'utils'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'
import IvaoAtcs from './components/IvaoAtcs'
// import useCargo from 'hooks/useCargo'
// import { getCallsign } from 'utils'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import Mission from './components/Mission/IvaoMission'
import { useVaProviderContext } from 'context/VaProvider'
import { bookingStore } from 'store/booking.atom'
import { authStore } from 'store/auth.atom'
// import customProtocolCheck from 'custom-protocol-check'
// import { appInstalledStore } from 'store/appInstalled.atom'
import Destinations from './components/Destinations'
import Swal from 'sweetalert2'
import { postApi } from 'lib/api'
import { missionStore } from 'store/mission.atom'
import { hasRequirement } from 'utils'
import axios from 'config/axios'
import { ivaoUserAuthStore } from 'store/ivaoUserAuth.atom'
import { aircraftNftStore, ownedAircraftNftStore } from 'store/aircraftNFT.atom'

const getMetar = async (callsign: string, ivaoAuthToken?: string | null) =>
  axios
    .get(`api/ivao/airports/${callsign}/metar`, { headers: { 'x-ivao-auth': `Bearer ${ivaoAuthToken}` } })
    .then((response) => response.data)

function base64URLEncode(str: string) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const verifier = '123456'
const challengeMethod = 'plain' // S256
const challenge = base64URLEncode(verifier)

interface Props {
  user: User
}

const IvaoView = ({ user: _user }: Props) => {
  const { isLoading: _loading, initIvaoAuth, initIvaoData } = useVaProviderContext()
  const router = useRouter()
  const { live, getLive } = useLiveFlightProviderContext()
  const [start, setStart] = useState((router.query.start as string) ?? '')
  const [end, setEnd] = useState((router.query.end as string) ?? '')
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const authToken = useRecoilValue(authStore)
  const ivaoAuthToken = useRecoilValue(ivaoUserAuthStore)
  const [booking, setBooking] = useRecoilState(bookingStore)
  // const [hasApp, setHasApp] = useRecoilState(appInstalledStore)
  // const { getPilots } = usePilots()
  const mission = useRecoilValue(missionStore)
  const [aircraft, setAircraft] = useState<string>('-1')
  const [metar, setMetar] = useState<string>('')
  const ownedAircrafts = useRecoilValue(ownedAircraftNftStore)
  const aircrafts = useRecoilValue(aircraftNftStore)

  const isAllowed = (distance?: number) => hasRequirement(aircrafts ?? [], distance ?? 0, aircraft)

  const handleSelectAtc = useCallback(
    (callsign: string, side: 'start' | 'end') => {
      if (side === 'start') {
        if (end === callsign) return
        setStart(callsign)
        getMetar(callsign.split('_')[0], ivaoAuthToken).then(setMetar)
      } else if (side === 'end') {
        if (start === callsign) return
        setEnd(callsign)
      } else {
        throw new Error('side should be one of `start` or `end`')
      }
    },
    [end, start, ivaoAuthToken]
  )

  const handleRequestFlight = useCallback(async () => {
    if (!mission) return

    try {
      // eslint-disable-next-line no-unused-vars
      const { aircraft: _, ...newMission } = mission

      const { isConfirmed } = await Swal.fire({
        title: `Callsign ${newMission.callsign}`,
        text: '¿Estás listo para este vuelo? Recuerda configurar el callsign antes de empezar.',
        icon: 'question',
        showCancelButton: true
      })
      if (isConfirmed) {
        const missionResult = await postApi('/api/missions/new', newMission)
        if (!missionResult) return
        await postApi('/api/live/new', { mission: missionResult })
        await getLive()
        if (!ivaoUser) {
          const clearance = await Swal.fire({
            title: 'Clearance required',
            text: 'Connect your IVAO account to continue',
            imageUrl: 'https://static.ivao.aero/img/logos/logo.svg',
            confirmButtonText: 'Connect to IVAO'.toUpperCase(),
            cancelButtonText: 'CANCEL',
            showCancelButton: true
          })

          if (clearance.isConfirmed) {
            window.open(
              `https://sso.ivao.aero/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_IVAO_ID}&state=${authToken}&scope=openid profile flight_plans:read bookings:read tracker email&code_challenge_method=${challengeMethod}&code_challenge=${challenge}`,
              '_self'
            )
          }
          router.push('/live')
          return
        }
        router.push('/live')
      }
    } catch (err) {
      console.error(err)
    }
  }, [authToken, mission, getLive, ivaoUser, router])

  const handleBooking = useCallback(
    (hasFuel: boolean) => {
      if (hasFuel) {
        setBooking(true)
        if (!authToken) throw new Error('Missing auth token')
        handleRequestFlight()
        // customProtocolCheck(
        //   `weifly://`,
        //   () => {
        //     console.log('App is not installed in user system')
        //     // TODO: Show popup to download weifly app
        //   },
        //   () => {
        //     setHasApp(true)
        //     console.log('App ready to open in user system')
        //     window.open(`weifly://token=${authToken}`)
        //   },
        //   5000
        // )
      }
    },
    [setBooking, authToken, handleRequestFlight]
  )

  React.useEffect(() => {
    if (live) {
      router.push('/live')
    }
  }, [live, router])

  React.useEffect(() => {
    if (ivaoAuthToken === undefined) {
      initIvaoAuth()
      initIvaoData()
    }
  }, [ivaoAuthToken, initIvaoAuth, initIvaoData])

  React.useEffect(() => {
    if (router.query.start) {
      setStart(router.query.start as string)
    }
    if (router.query.end) {
      setEnd(router.query.end as string)
    }
  }, [router])

  React.useEffect(() => {
    if (ownedAircrafts && ownedAircrafts.length > 0) {
      setAircraft('0')
    }
  }, [ownedAircrafts])

  return (
    <Stack direction='row'>
      <IvaoAtcs onSelect={handleSelectAtc} start={start} end={end} />

      <Container>
        <Box px={2} width='100%' maxHeight='100vh'>
          <Stack direction='row' justifyContent='space-between' mt={2} spacing={2}>
            {start && (
              <Box>
                <Box textAlign='center'>
                  <Box width='100%' height={60} fontSize={50}>
                    <FlightTakeoffIcon color='success' fontSize='inherit' />
                  </Box>
                  <Typography variant='h4' textTransform='uppercase'>
                    Start
                  </Typography>
                  <Paper>
                    <Box p={1} bgcolor='success.main' borderRadius={1}>
                      <Typography fontWeight={600}>{start}</Typography>
                    </Box>
                  </Paper>
                </Box>
                <Stack width='100%' mt={1}>
                  <Typography lineHeight={1.2} variant='caption'>
                    {metar}
                  </Typography>
                </Stack>
              </Box>
            )}
            {start && end && (
              <Stack height={100} width='100%' justifyContent='center'>
                <LinearProgress variant='determinate' value={0} />
              </Stack>
            )}
            {start && end && (
              <Box textAlign='center'>
                <Box width='100%' height={60} fontSize={50}>
                  <FlightLandIcon color='info' fontSize='inherit' />
                </Box>
                <Typography variant='h4' textTransform='uppercase'>
                  End
                </Typography>
                <Paper>
                  <Box p={1} bgcolor='info.dark' borderRadius={1}>
                    <Typography fontWeight={600}>{end}</Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Stack>

          {/* <IvaoLogin /> */}

          <Box mt={4}>
            <Mission
              setAircraft={setAircraft}
              aircraft={aircraft}
              aircrafts={aircrafts ?? []}
              start={start}
              end={end}
              onBooking={handleBooking}
              isAllowed={isAllowed}
            />
          </Box>

          {booking && (
            <Box>
              <Typography>Connect sim and start your flight</Typography>
            </Box>
          )}

          <Destinations
            isAllowed={isAllowed(mission?.distance)}
            onSelect={(c) => handleSelectAtc(c, 'end')}
            selected={end}
            start={start}
            end={end}
          />

          {/* <IvaoPilots /> */}
        </Box>
      </Container>
    </Stack>
  )
}

export default memo(IvaoView)
