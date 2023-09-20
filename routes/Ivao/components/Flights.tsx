import { Grid, Card, useTheme } from '@mui/material'
import React from 'react'
import type { IvaoPilot } from 'types'
import { useRouter } from 'next/router'
import useCargo from 'hooks/useCargo'
import { NFT } from '@thirdweb-dev/react'
import Swal from 'sweetalert2'
import axios from 'config/axios'
import FlightDetailsHeader from './FlightDetailsHeader'
import FlightDetailsCargo from './FlightDetailsCargo'
import FlightDetails from './FlightDetails'

interface Props {
  onRemove: () => void
  aircraft?: NFT
  session: IvaoPilot
  onSelect: () => void
  index: number
  selected: boolean
}

const Flights = ({ session, onSelect, onRemove, index, aircraft, selected }: Props) => {
  const router = useRouter()
  const { palette } = useTheme()
  const { cargo, newCargo } = useCargo()

  const handleSelectFlight = React.useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Callsign ${session.callsign}`,
      text: 'Are you ready for this flight? Confirm to start.',
      icon: 'question',
      showCancelButton: true
    })
    if (isConfirmed) {
      const { data } = await axios.post('/api/cargo/new', { ...cargo })
      await axios.post('/api/live/new', { cargo: data })
      router.push('/live')
    }
  }, [cargo, router, session.callsign])

  const handleNewCargo = React.useCallback(async () => {
    if (!aircraft) return
    await newCargo(
      { origin: session.flightPlan.departureId, destination: session.flightPlan.arrivalId },
      aircraft,
      session.callsign
    )
  }, [aircraft, newCargo, session.callsign, session.flightPlan.arrivalId, session.flightPlan.departureId])

  const handleClickPilot = React.useCallback(async () => {
    await handleNewCargo()
    onSelect()
  }, [handleNewCargo, onSelect])

  const handleUnSelectPilot = React.useCallback(() => {
    onRemove()
  }, [onRemove])

  return (
    <Grid item xs={selected ? 12 : 6} key={session.id}>
      <Card
        sx={{
          boxSizing: 'border-box',
          backgroundColor: index === 0 && selected ? palette.secondary.light : palette.common.white,
          boxShadow: index === 0 && selected ? `0 0 50px ${palette.primary.dark}` : 'none'
        }}
      >
        <FlightDetailsHeader
          selected={selected}
          session={session}
          onClickPilot={handleClickPilot}
          onUnSelectPilot={handleUnSelectPilot}
        />
        <FlightDetails selected={selected} session={session} />
        {selected && cargo && (
          <FlightDetailsCargo cargo={cargo} session={session} onSelectFlight={handleSelectFlight} />
        )}
      </Card>
    </Grid>
  )
}

export default Flights
