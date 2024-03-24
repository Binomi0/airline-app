import React, { memo, useCallback, useState } from 'react'
import { User } from 'types'
// import { filterLEOrigins } from 'utils'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'
import IvaoStatus from './components/IvaoConnection'
import IvaoAtcs from './components/IvaoAtcs'
import useCargo from 'hooks/useCargo'
import { formatNumber, getCallsign } from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useContract, useNFTs } from '@thirdweb-dev/react'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import usePilots from 'hooks/usePilots'
import useIvao from 'hooks/useIvao'
import { CircularProgress } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { ivaoUserStore } from 'store/ivao-user.atom'
import IvaoLogin from './components/IvaoLogin'
import Cargo from './components/Cargo'

interface Props {
  user: User
}

const IvaoView = ({ user }: Props) => {
  const router = useRouter()
  const { live } = useLiveFlightProviderContext()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const { cargo, newCargo, setCargo } = useCargo()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { isLoading } = useIvao()
  const ivaoUser = useRecoilValue(ivaoUserStore)

  const {
    data: aircrafts = []
    //  isLoading,
    //   isFetched,
    //    refetch: refetchAircrafts
  } = useNFTs(contract)
  const { getPilots } = usePilots()

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

  React.useEffect(() => {
    if (start && end && aircrafts) {
      newCargo({ origin: start, destination: end }, aircrafts[0], getCallsign(), false)
    } else {
      setCargo()
    }
  }, [end, newCargo, setCargo, aircrafts, start])

  React.useEffect(() => {
    if (live) {
      router.push('/live')
    }
  }, [live, router])

  React.useEffect(() => {
    if (!ivaoUser) return
    getPilots()
  }, [getPilots, ivaoUser])

  React.useEffect(() => {
    window.addEventListener('online', () => {
      console.log('ONLINE!!!')
    })
    window.addEventListener('offline', () => {
      console.log('...OFFLINE')
    })

    return () => {
      window.removeEventListener('online', () => {
        console.log('OFF ONLINE')
      })
      window.removeEventListener('offline', () => {
        console.log('OFF OFFLINE')
      })
    }
  }, [])

  return (
    <Stack direction='row'>
      <IvaoAtcs onSelect={handleSelectAtc} start={start} end={end} />
      {isLoading ? (
        <CircularProgress size={64} />
      ) : (
        <Box px={2} width='100%'>
          <IvaoLogin user={user} />
          {ivaoUser && (
            <Stack direction='row' justifyContent='space-between' mt={2} spacing={2}>
              {start && (
                <Box textAlign='center'>
                  <Box width='100%' height={60} fontSize={50}>
                    <FlightTakeoffIcon color='success' fontSize='inherit' />
                  </Box>
                  <Typography variant='h3'>Start</Typography>
                  <Typography>{start}</Typography>
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
                  <Typography>{end}</Typography>
                </Box>
              )}
            </Stack>
          )}
          <Box mt={4}>{cargo && <Cargo cargo={cargo} aircrafts={aircrafts} />}</Box>

          {/* <IvaoPilots /> */}
        </Box>
      )}
    </Stack>
  )
}

export default memo(IvaoView)
