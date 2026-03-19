import React from 'react'
import type { Mission, FRoute, IvaoPilot } from 'types'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import FlightDetailsHeader from './FlightDetailsHeader'
import FlightDetailsMission from './FlightDetailsMission'
import FlightDetails from './FlightDetails'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import GradientCard from 'components/GradientCard'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { postApi } from 'lib/api'
import { INft } from 'models/Nft'

interface Props {
  onRemove: () => void
  aircraft?: INft
  pilot: IvaoPilot
  onSelect: () => void
  selected: boolean
  mission?: Mission
  // eslint-disable-next-line no-unused-vars
  newMission: (route: FRoute, aircraft: INft, callsign: string, remote: boolean) => Promise<void>
}

const Flights = ({ pilot, onSelect, onRemove, aircraft, selected, newMission, mission }: Props) => {
  const router = useRouter()
  const { palette } = useTheme()
  const { setPilot, getLive } = useLiveFlightProviderContext()

  const handleSelectFlight = React.useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Callsign ${pilot.callsign}`,
      text: '¿Estás listo para este vuelo? Confirma para empezar.',
      icon: 'question',
      showCancelButton: true
    })
    if (isConfirmed) {
      const data = await postApi('/api/missions/new', { ...mission })
      await postApi('/api/live/new', { mission: data })
      await getLive()
      setPilot(pilot)
      router.push('/live')
    }
  }, [pilot, mission, getLive, setPilot, router])

  const handleNewMission = React.useCallback(async () => {
    if (!aircraft) return
    const { arrivalId: destination, departureId: origin } = pilot.flightPlan

    if (!origin || !destination) {
      throw new Error('Falló el plan de vuelo: falta origen o destino')
    }

    if (pilot.callsign !== mission?.callsign) {
      await newMission({ origin, destination, distance: 0 }, aircraft, pilot.callsign, true)
    }
  }, [aircraft, mission?.callsign, newMission, pilot.callsign, pilot.flightPlan])

  const handleClickPilot = React.useCallback(async () => {
    handleNewMission().then(onSelect).catch(onRemove)
  }, [handleNewMission, onRemove, onSelect])

  const handleUnSelectPilot = React.useCallback(() => {
    onRemove()
  }, [onRemove])

  return (
    <Grid item xs={selected ? 12 : 6} key={pilot.id}>
      <GradientCard
        angle='45deg'
        from={palette.grey[400]}
        to={palette.primary.dark}
        sx={{
          boxSizing: 'border-box',
          backgroundColor: selected ? palette.secondary.light : palette.common.white,
          boxShadow: selected ? `0 0 50px ${palette.primary.dark}` : 'none'
        }}
      >
        <FlightDetailsHeader
          selected={selected}
          pilot={pilot}
          onClickPilot={handleClickPilot}
          onUnSelectPilot={handleUnSelectPilot}
        />
        <FlightDetails selected={selected} pilot={pilot} />
        {selected && mission && (
          <FlightDetailsMission mission={mission} pilot={pilot} onSelectFlight={handleSelectFlight} />
        )}
      </GradientCard>
    </Grid>
  )
}

export default Flights
