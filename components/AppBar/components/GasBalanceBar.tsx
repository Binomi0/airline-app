import { Stack, Typography } from '@mui/material'
import React from 'react'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { useTokenProviderContext } from 'context/TokenProvider'

interface Props {
  show: boolean
  smartAccountAddress?: string
}

const GasBalanceBar = ({ show, smartAccountAddress }: Props) => {
  const { airg } = useTokenProviderContext()

  return show && smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <LocalGasStationIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(airg?.toNumber() || 0)}{' '}
        AIRG
      </Typography>
    </Stack>
  ) : null
}

export default GasBalanceBar
