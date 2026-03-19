import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import router from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { Mission, IcaoCode, IvaoPilot } from 'types'
import { getFuelForFlight } from 'utils'

const DIGITS = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

interface Props {
  mission: Mission
  pilot: IvaoPilot
  onSelectFlight: () => void
}

const FlightDetailsMission = ({ mission, pilot, onSelectFlight }: Props) => {
  const balance = useRecoilValue(tokenBalanceStore)

  const requiredGas = React.useMemo(() => {
    const { arrivalDistance, departureDistance } = pilot.lastTrack

    return getFuelForFlight(
      (arrivalDistance ?? 0) + (departureDistance ?? 0),
      pilot.flightPlan.aircraft.icaoCode as IcaoCode
    )
  }, [pilot.flightPlan.aircraft.icaoCode, pilot.lastTrack])

  const finalGas = React.useMemo(() => {
    if (!mission) return 0

    return requiredGas
  }, [mission, requiredGas])

  const handleSelectFlight = React.useCallback(() => {
    const balanceAirgFloat = balance.airg !== undefined ? Number(balance.airg) / 1e18 : 0
    if (balanceAirgFloat >= finalGas) onSelectFlight()
  }, [balance.airg, finalGas, onSelectFlight])

  return (
    <Card>
      <CardHeader
        title={`${Intl.NumberFormat('es-EN', DIGITS).format(mission?.prize || 0)} AIRL`}
        subheader={`${Intl.NumberFormat('es-EN', DIGITS).format(mission?.weight || 0)} KG - ${mission?.details?.name}`}
      />
      <CardContent>
        <Typography>Consumo aproximado: {Intl.NumberFormat('en-US', DIGITS).format(finalGas)} Litros</Typography>
        <Typography>{mission?.details?.description}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {(balance.airg !== undefined ? Number(balance.airg) / 1e18 : 0) < finalGas ? (
          <Button size='large' variant='contained' onClick={() => router.push('/gas')}>
            Ir a la Gasolinera
          </Button>
        ) : (
          <Button
            disabled={(balance.airg !== undefined ? Number(balance.airg) / 1e18 : 0) < finalGas}
            color='success'
            size='large'
            variant='contained'
            onClick={handleSelectFlight}
          >
            Seleccionar este vuelo
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default FlightDetailsMission
