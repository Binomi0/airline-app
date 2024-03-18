import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import BigNumber from 'bignumber.js'
import router from 'next/router'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { tokenBalanceStore } from 'store/balance.atom'
import { Cargo, IvaoPilot } from 'types'
import { getFuelForFlight } from 'utils'

const DIGITS = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

interface Props {
  cargo: Cargo
  pilot: IvaoPilot
  onSelectFlight: () => void
}

const FlightDetailsCargo = ({ cargo, pilot, onSelectFlight }: Props) => {
  const balance = useRecoilValue(tokenBalanceStore)

  const requiredGas = React.useMemo(() => {
    const { arrivalDistance, departureDistance } = pilot.lastTrack

    return getFuelForFlight(new BigNumber(arrivalDistance).plus(departureDistance), pilot.flightPlan.aircraft.icaoCode)
  }, [pilot.flightPlan.aircraft.icaoCode, pilot.lastTrack])

  const finalGas = React.useMemo(() => {
    if (!cargo) return 0

    return requiredGas.toNumber()
  }, [cargo, requiredGas])

  const handleSelectFlight = React.useCallback(() => {
    if (balance.airg?.isGreaterThanOrEqualTo(finalGas)) onSelectFlight()
  }, [balance.airg, finalGas, onSelectFlight])

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
        {balance.airg?.isLessThan(requiredGas) ? (
          <Button size='large' variant='contained' onClick={() => router.push('/gas')}>
            Go to Gas Station
          </Button>
        ) : (
          <Button
            disabled={balance.airg?.isLessThan(finalGas)}
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
