import React, { memo, useCallback, useState } from 'react'
import { User } from 'types'
// import { filterLEOrigins } from 'utils'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'
import IvaoStatus from './components/IvaoStatus'
import IvaoAtcs from './components/IvaoAtcs'
import useCargo from 'hooks/useCargo'
import { formatNumber, getCallsign } from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useContract, useNFTs } from '@thirdweb-dev/react'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import FlagIcon from '@mui/icons-material/Flag'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import usePilots from 'hooks/usePilots'
import useIvao from 'hooks/useIvao'
import { CircularProgress } from '@mui/material'

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
  const { isLoading, ivaoUser } = useIvao()

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

  React.useEffect(getPilots, [getPilots])

  return (
    <Stack direction='row'>
      <IvaoAtcs onSelect={handleSelectAtc} start={start} end={end} />
      {isLoading ? (
        <CircularProgress size={64} />
      ) : (
        <Box px={2} width='100%'>
          <IvaoStatus user={user} ivaoUser={ivaoUser} />
          <Typography variant='h4' align='center' paragraph>
            Flights can only be selected from active ATC`s
          </Typography>
          <Stack direction='row' justifyContent='space-between' mt={2} spacing={2}>
            {start && (
              <Box textAlign='center'>
                <FlagIcon color='success' fontSize='large' />
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
                <SportsScoreIcon fontSize='large' />
                <Typography variant='h3'>End</Typography>
                <Typography>{end}</Typography>
              </Box>
            )}
          </Stack>
          {cargo && (
            <Stack direction='column' width='100%' alignItems='center' justifyContent='center' mt={2}>
              <Typography variant='h6'>{cargo.details.name}</Typography>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Distance:</Typography>
                <Typography align='center' variant='body2'>
                  {formatNumber(cargo.distance)} Km
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Prize:</Typography>
                <Typography align='center' variant='body2'>
                  {formatNumber(cargo.prize)} AIRL
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Rewards: </Typography>
                <Typography align='center' variant='body2'>
                  {cargo.rewards ?? '-'}
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='space-between' minWidth={300}>
                <Typography align='center'>Score: </Typography>
                <Typography align='center' variant='body2'>
                  {cargo.score ?? '-'}
                </Typography>
              </Stack>

              <Typography width={300} align='justify' variant='caption'>
                {cargo.details.description}
              </Typography>
            </Stack>
          )}

          {/* <IvaoPilots /> */}
        </Box>
      )}
    </Stack>
  )
}

export default memo(IvaoView)
