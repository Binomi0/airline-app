import { Box, Grid, LinearProgress, Typography } from '@mui/material'
import FlightDetails from 'components/FlightDetails'
import { useVaProviderContext } from 'context/VaProvider'
import React from 'react'
import { IvaoPilot } from 'types'
import { filterLEOrigins } from 'utils'

const IvaoView = () => {
  const { pilots } = useVaProviderContext()
  const [current, setCurrent] = React.useState<IvaoPilot[]>([])

  const handleSelect = React.useCallback(
    (callsign: string) => {
      const i = pilots.findIndex((c) => c.callsign === callsign)
      const newCurrent = [pilots[i], ...pilots.filter((c) => c.callsign !== callsign)]
      setCurrent(newCurrent)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [pilots]
  )

  React.useEffect(() => {
    setCurrent(pilots || [])
  }, [pilots])

  if (!pilots.length) {
    return <LinearProgress />
  }

  return (
    <>
      <Box textAlign='center'>
        <Typography fontSize={64} fontFamily='B612 Mono' textTransform='uppercase'>
          Current Pilots
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {current
          // .filter(filterLEOrigins)
          .filter((pilot) => pilot?.lastTrack?.state === 'Boarding')
          .slice(0, 20)
          .map((session, index) => (
            <FlightDetails session={session} key={session.id} index={index} onSelect={handleSelect} />
          ))}
      </Grid>
    </>
  )
}

export default IvaoView
