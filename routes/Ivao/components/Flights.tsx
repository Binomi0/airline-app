import { Grid, Card, useTheme } from '@mui/material'
import React from 'react'
import type { Cargo, FRoute, IvaoPilot } from 'types'
import { useRouter } from 'next/router'
import { NFT } from '@thirdweb-dev/react'
import Swal from 'sweetalert2'
import axios from 'config/axios'
import FlightDetailsHeader from './FlightDetailsHeader'
import FlightDetailsCargo from './FlightDetailsCargo'
import FlightDetails from './FlightDetails'

interface Props {
  onRemove: () => void
  aircraft?: NFT
  pilot: IvaoPilot
  onSelect: () => void
  index: number
  selected: boolean
  cargo?: Cargo
  newCargo: (route: FRoute, aircraft: NFT, callsign: string, remote: boolean) => Promise<void>
}

const Flights = ({ pilot, onSelect, onRemove, index, aircraft, selected, newCargo, cargo }: Props) => {
  const router = useRouter()
  const { palette } = useTheme()

  const handleSelectFlight = React.useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Callsign ${pilot.callsign}`,
      text: 'Are you ready for this flight? Confirm to start.',
      icon: 'question',
      showCancelButton: true
    })
    if (isConfirmed) {
      const { data } = await axios.post('/api/cargo/new', { ...cargo })
      await axios.post('/api/live/new', { cargo: data })
      router.push('/live')
    }
  }, [pilot.callsign, cargo, router])

  const handleNewCargo = React.useCallback(async () => {
    if (!aircraft) return
    await newCargo(
      { origin: pilot.flightPlan.departureId, destination: pilot.flightPlan.arrivalId },
      aircraft,
      pilot.callsign,
      true
    )
  }, [aircraft, newCargo, pilot.callsign, pilot.flightPlan.arrivalId, pilot.flightPlan.departureId])

  const handleClickPilot = React.useCallback(async () => {
    await handleNewCargo()
    onSelect()
  }, [handleNewCargo, onSelect])

  const handleUnSelectPilot = React.useCallback(() => {
    onRemove()
  }, [onRemove])

  return (
    <Grid item xs={selected ? 12 : 6} key={pilot.id}>
      <Card
        sx={{
          boxSizing: 'border-box',
          backgroundColor: index === 0 && selected ? palette.secondary.light : palette.common.white,
          boxShadow: index === 0 && selected ? `0 0 50px ${palette.primary.dark}` : 'none'
        }}
      >
        <FlightDetailsHeader
          selected={selected}
          pilot={pilot}
          onClickPilot={handleClickPilot}
          onUnSelectPilot={handleUnSelectPilot}
        />
        <FlightDetails selected={selected} pilot={pilot} />
        {selected && cargo && <FlightDetailsCargo cargo={cargo} pilot={pilot} onSelectFlight={handleSelectFlight} />}
      </Card>
    </Grid>
  )
}

export default Flights
