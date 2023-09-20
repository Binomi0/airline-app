import { Box, Button, Grid, LinearProgress } from '@mui/material'
import Flights from 'routes/Ivao/components/Flights'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'
import { useVaProviderContext } from 'context/VaProvider'
import React from 'react'
import { IvaoPilot } from 'types'
// import { filterLEOrigins } from 'utils'

const STEP = 5

const IvaoView = () => {
  const { pilots } = useVaProviderContext()
  const [current, setCurrent] = React.useState<IvaoPilot[]>([])
  const [selected, setSelected] = React.useState('')
  const [page, setPage] = React.useState(0)
  const { ownedAircrafts, isLoading } = useAircraftProviderContext()

  const handleSelect = React.useCallback(
    (callsign: string) => {
      const i = pilots.findIndex((c) => c.callsign === callsign)
      const newCurrent = [pilots[i], ...pilots.filter((c) => c.callsign !== callsign)]
      setCurrent(newCurrent)
      setSelected(callsign)
      window.scrollTo({ top: 100, behavior: 'smooth' })
    },
    [pilots]
  )
  const renderPilots = React.useMemo(
    () =>
      current
        // .filter(filterLEOrigins)
        .filter((pilot) => pilot.flightPlan.arrivalId !== pilot.flightPlan.departureId)
        .filter((pilot) => pilot?.lastTrack?.state === 'Boarding')
        .slice(0, page + STEP)
        .map((pilot, index) => (
          <Flights
            selected={pilot.callsign === selected}
            aircraft={ownedAircrafts[0]}
            session={pilot}
            key={pilot.id}
            index={index}
            onSelect={() => handleSelect(pilot.callsign)}
            onRemove={() => setSelected('')}
          />
        )),
    [current, handleSelect, ownedAircrafts, page, selected]
  )

  React.useEffect(() => {
    setCurrent(pilots)
    if (selected) handleSelect(selected)
  }, [handleSelect, pilots, selected])

  if (!pilots.length || isLoading) {
    return <LinearProgress />
  }

  return (
    <>
      <Grid container spacing={2}>
        {renderPilots}
      </Grid>
      <Box textAlign='center' my={10}>
        <Button variant='contained' onClick={() => setPage((s) => s + STEP)}>
          Load More...
        </Button>
      </Box>
    </>
  )
}

export default IvaoView
