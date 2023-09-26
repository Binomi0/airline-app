import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material'
import Flights from 'routes/Ivao/components/Flights'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'
import { useVaProviderContext } from 'context/VaProvider'
import React, { memo } from 'react'
import { IvaoPilot, LastTrackStateEnum } from 'types'
// import { filterLEOrigins } from 'utils'
import useCargo from 'hooks/useCargo'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import { useRouter } from 'next/router'

const STEP = 12

const IvaoView = () => {
  const router = useRouter()
  const { cargo, newCargo } = useCargo()
  const { pilots } = useVaProviderContext()
  const { ownedAircrafts } = useAircraftProviderContext()
  const {live} = useLiveFlightProviderContext()
  const [current, setCurrent] = React.useState<Readonly<IvaoPilot[]>>([])
  const [selected, setSelected] = React.useState('')
  const [page, setPage] = React.useState(0)

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
        .slice(0, page + STEP)
        .map((pilot, index) => (
          <Flights
            cargo={cargo}
            newCargo={newCargo}
            selected={pilot.callsign === selected && index === 0}
            aircraft={ownedAircrafts[0]}
            pilot={pilot}
            key={pilot.id}
            onSelect={() => setSelected(pilot.callsign)}
            onRemove={() => setSelected('')}
          />
        )),
    [cargo, current, newCargo, ownedAircrafts, page, selected]
  )

  React.useEffect(() => {
    setCurrent(pilots)
    if (selected) {
      handleSelect(selected)
    }
  }, [handleSelect, pilots, selected])

  React.useEffect(() => {
    if (live) {
      router.push('/live')
    }
  }, [live, router])

  if (!pilots.length) {
    return <LinearProgress />
  }

  return ownedAircrafts ? (
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
  ) : (
    <Box>
      <Typography>You need an aircraft to select a flight</Typography>
    </Box>
  )
}

export default memo(IvaoView)
