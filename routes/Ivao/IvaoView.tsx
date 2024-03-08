import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import React, { memo, useCallback, useState } from 'react'
import { User } from 'types'
// import { filterLEOrigins } from 'utils'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'
import IvaoStatus from './components/IvaoStatus'
import IvaoAtcs from './components/IvaoAtcs'
import useCargo from 'hooks/useCargo'
import { getCallsign } from 'utils'
import { nftAircraftTokenAddress } from 'contracts/address'
import { useContract, useNFTs } from '@thirdweb-dev/react'
// import IvaoPilots from './components/IvaoPilots'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import FlagIcon from '@mui/icons-material/Flag'

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
  const { data: aircrafts = [], isLoading, isFetched, refetch: refetchAircrafts } = useNFTs(contract)

  const handleSelectAtc = useCallback((callsign: string, side: 'start' | 'end') => {
    if (side === 'start') {
      if (end === callsign) return
      setStart(callsign)
    } else if (side === 'end') {
      if (start === callsign) return
      setEnd(callsign)
    } else {
      throw new Error('side should be one of `start` or `end`')
    }
  }, [])

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

  return (
    <Stack direction='row'>
      <IvaoAtcs onSelect={handleSelectAtc} start={start} end={end} />
      <Box px={2} width='100%'>
        <IvaoStatus user={user} />
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
          <Stack direction='column' width='100%' alignItems='center' justifyContent='center'>
            <Typography align='center'>Distance: {cargo.distance}</Typography>
            <Typography align='center'>Prize: {cargo.prize}</Typography>
            <Typography align='center'>Name: {cargo.details.name}</Typography>
            <Typography width={300} align='justify'>
              Description: {cargo.details.description}
            </Typography>
            <Typography align='center'>Rewards: {cargo.rewards}</Typography>
            <Typography align='center'>Score: {cargo.score}</Typography>
          </Stack>
        )}
        {/* <IvaoPilots /> */}
      </Box>
    </Stack>
  )
}

export default memo(IvaoView)
