import React from 'react'
import type { Cargo, FRoute, IvaoPilot } from 'types'
import { useRouter } from 'next/router'
import { NFT } from '@thirdweb-dev/react'
import Swal from 'sweetalert2'
import FlightDetailsHeader from './FlightDetailsHeader'
import FlightDetailsCargo from './FlightDetailsCargo'
import FlightDetails from './FlightDetails'
import { useLiveFlightProviderContext } from 'context/LiveFlightProvider'
import GradientCard from 'components/GradientCard'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { postApi } from 'lib/api'

interface Props {
  onRemove: () => void
  aircraft?: NFT
  pilot: IvaoPilot
  onSelect: () => void
  selected: boolean
  cargo?: Cargo
  // eslint-disable-next-line no-unused-vars
  newCargo: (route: FRoute, aircraft: NFT, callsign: string, remote: boolean) => Promise<void>
}

const Flights = ({ pilot, onSelect, onRemove, aircraft, selected, newCargo, cargo }: Props) => {
  const router = useRouter()
  const { palette } = useTheme()
  const { setPilot, getLive } = useLiveFlightProviderContext()

  const handleSelectFlight = React.useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Callsign ${pilot.callsign}`,
      text: 'Are you ready for this flight? Confirm to start.',
      icon: 'question',
      showCancelButton: true
    })
    if (isConfirmed) {
      const data = await postApi('/api/cargo/new', { ...cargo })
      await postApi('/api/live/new', { cargo: data })
      await getLive()
      setPilot(pilot)
      router.push('/live')
    }
  }, [pilot, cargo, getLive, setPilot, router])

  const handleNewCargo = React.useCallback(async () => {
    if (!aircraft) return
    const { arrivalId: destination, departureId: origin } = pilot.flightPlan

    if (!origin || !destination) {
      throw new Error('Missing origin or destination')
    }

    if (pilot.callsign !== cargo?.callsign) {
      await newCargo({ origin, destination }, aircraft, pilot.callsign, true)
    }
  }, [aircraft, cargo?.callsign, newCargo, pilot.callsign, pilot.flightPlan])

  const handleClickPilot = React.useCallback(async () => {
    handleNewCargo().then(onSelect).catch(onRemove)
  }, [handleNewCargo, onRemove, onSelect])

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
        {selected && cargo && <FlightDetailsCargo cargo={cargo} pilot={pilot} onSelectFlight={handleSelectFlight} />}
      </GradientCard>
    </Grid>
  )
}

export default Flights
