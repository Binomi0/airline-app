import React, { memo, useCallback, useState } from 'react'
import { User } from 'types'
// import { filterLEOrigins } from 'utils'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'
import IvaoAtcs from './components/IvaoAtcs'
// import useCargo from 'hooks/useCargo'
// import { getCallsign } from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useContract, useNFTs } from '@thirdweb-dev/react'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import usePilots from 'hooks/usePilots'
import { CircularProgress, Container, Paper } from '@mui/material'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import IvaoLogin from './components/IvaoLogin'
import Cargo from './components/Cargo'
import { useVaProviderContext } from 'context/VaProvider'
import { ivaoAuthStore } from 'store/ivaoAuth.atom'
import { bookingStore } from 'store/booking.atom'
import { authStore } from 'store/auth.atom'
import customProtocolCheck from 'custom-protocol-check'
import { appInstalledStore } from 'store/appInstalled.atom'
import Destinations from './components/Destinations'
import Swal from 'sweetalert2'
import { postApi } from 'lib/api'
import { cargoStore } from 'store/cargo.atom'

interface Props {
  user: User
  isLoading: boolean
}

const IvaoView = ({ user, isLoading }: Props) => {
  const { isLoading: loading } = useVaProviderContext()
  const router = useRouter()
  const { live } = useLiveFlightProviderContext()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const { contract } = useContract(nftAircraftTokenAddress)
  const ivaoUser = useRecoilValue(ivaoUserStore)
  const ivaoToken = useRecoilValue(ivaoAuthStore)
  const authToken = useRecoilValue(authStore)
  const [booking, setBooking] = useRecoilState(bookingStore)
  const [hasApp, setHasApp] = useRecoilState(appInstalledStore)
  const { getPilots } = usePilots()
  const cargo = useRecoilValue(cargoStore)

  const {
    data: aircrafts = []
    //  isLoading,
    //   isFetched,
    //    refetch: refetchAircrafts
  } = useNFTs(contract)

  const handleSelectAtc = useCallback(
    (callsign: string, side: 'start' | 'end') => {
      if (side === 'start') {
        if (end === callsign) return
        setStart(callsign)
      } else if (side === 'end') {
        if (start === callsign) return
        setEnd(callsign)
      } else {
        throw new Error('side should be one of `start` or `end`')
      }
    },
    [end, start]
  )

  const handleRequestFlight = useCallback(async () => {
    if (!cargo) return
    try {
      const { aircraft: _, ...newCargo } = cargo

      const { isConfirmed } = await Swal.fire({
        title: `Callsign ${newCargo.callsign}`,
        text: 'Are you ready for this flight? Remember to set required callsign before start',
        icon: 'question',
        showCancelButton: true
      })
      if (isConfirmed) {
        const cargo = await postApi('/api/cargo/new', newCargo)
        if (!cargo) return
        await postApi('/api/live/new', { cargo })
        router.push('/live')
      }
    } catch (err) {
      console.error(err)
    }
  }, [cargo, router])

  const handleBooking = useCallback(
    (hasFuel: boolean) => {
      if (!ivaoToken) return
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
    [ivaoToken, setBooking, authToken, handleRequestFlight]
  )

  React.useEffect(() => {
    if (live) {
      router.push('/live')
    }
  }, [live, router])

  React.useEffect(() => {
    if (!ivaoUser) return
    getPilots()
  }, [getPilots, ivaoUser])

  return (
    <Stack direction='row'>
      {(isLoading || loading) && <LinearProgress />}

      <IvaoAtcs onSelect={handleSelectAtc} start={start} end={end} />

      <Container>
        <Box px={2} width='100%' maxHeight='100vh'>
          <IvaoLogin user={user} />
          {ivaoUser && (
            <Stack direction='row' justifyContent='space-between' mt={2} spacing={2}>
              {start && (
                <Box textAlign='center'>
                  <Box width='100%' height={60} fontSize={50}>
                    <FlightTakeoffIcon color='success' fontSize='inherit' />
                  </Box>
                  <Typography variant='h3'>Start</Typography>
                  <Paper>
                    <Box p={1} bgcolor='success.main' borderRadius={1}>
                      <Typography>{start}</Typography>
                    </Box>
                  </Paper>
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
                  <Typography variant='h3'>End</Typography>
                  <Paper>
                    <Box p={1} bgcolor='info.dark' borderRadius={1}>
                      <Typography>{end}</Typography>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Stack>
          )}

          <Box mt={4}>
            <Cargo aircrafts={aircrafts} origin={start} destination={end} onBooking={handleBooking} />
          </Box>

          {booking && (
            <Box>
              <Typography>Connect sim and start your flight</Typography>
            </Box>
          )}

          <Destinations onSelect={(c) => handleSelectAtc(c, 'end')} selected={end} />

          {/* <IvaoPilots /> */}
        </Box>
      </Container>
    </Stack>
  )
}

export default memo(IvaoView)
