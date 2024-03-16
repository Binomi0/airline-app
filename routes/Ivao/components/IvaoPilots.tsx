import React from 'react'
import Flights from './Flights'
import { useAircraftProviderContext } from 'context/AircraftProvider'
import useCargo from 'hooks/useCargo'
import { useVaProviderContext } from 'context/VaProvider'
import { IvaoPilot } from 'types'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const STEP = 12

const IvaoPilots = () => {
  const [current, setCurrent] = React.useState<Readonly<IvaoPilot[]>>([])
  const [selected, setSelected] = React.useState('')
  const [page, setPage] = React.useState(0)
  const { ownedAircrafts } = useAircraftProviderContext()
  const { cargo, newCargo } = useCargo()
  const { pilots } = useVaProviderContext()

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

export default IvaoPilots
