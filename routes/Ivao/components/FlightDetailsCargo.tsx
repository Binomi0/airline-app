import { Card, CardHeader, CardContent, Typography, CardActions, Button } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useTokenProviderContext } from 'context/TokenProvider'
import router from 'next/router'
import React from 'react'
import { Cargo, IvaoPilot } from 'types'
import { getFuelForFlight } from 'utils'

const DIGITS = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

interface Props {
  cargo: Cargo
  session: IvaoPilot
  onSelectFlight: () => void
}

const FlightDetailsCargo = ({ cargo, session, onSelectFlight }: Props) => {
  const { airg } = useTokenProviderContext()

  const requiredGas = React.useMemo(() => {
    const { arrivalDistance, departureDistance } = session.lastTrack

    return getFuelForFlight(
      new BigNumber(arrivalDistance).plus(departureDistance),
      session.flightPlan.aircraft.icaoCode
    )
  }, [session.flightPlan.aircraft.icaoCode, session.lastTrack])

  const finalGas = React.useMemo(() => {
    if (!cargo) return 0

    return requiredGas.toNumber()
  }, [cargo, requiredGas])

  const handleSelectFlight = React.useCallback(() => {
    if (airg?.isGreaterThanOrEqualTo(finalGas)) onSelectFlight()
  }, [airg, finalGas, onSelectFlight])

  return (
    <Card>
      <CardHeader
        title={`${Intl.NumberFormat('es-EN', DIGITS).format(cargo?.prize || 0)} AIRL`}
        subheader={`${Intl.NumberFormat('es-EN', DIGITS).format(cargo?.weight || 0)} KG - ${cargo?.details?.name}`}
      />
      <CardContent>
        <Typography>Gas consumption: {Intl.NumberFormat('en-US', DIGITS).format(finalGas)} Liters</Typography>
        <Typography>{cargo?.details?.description}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {airg?.isLessThan(requiredGas) ? (
          <Button size='large' variant='contained' onClick={() => router.push('/gas')}>
            Go to Gas Station
          </Button>
        ) : (
          <Button
            disabled={airg?.isLessThan(finalGas)}
            color='success'
            size='large'
            variant='contained'
            onClick={handleSelectFlight}
          >
            Select this flight
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default FlightDetailsCargo