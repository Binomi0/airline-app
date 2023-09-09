import { Stack, Typography } from '@mui/material'
import React from 'react'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useTokenProviderContext } from 'context/TokenProvider'

const GasBalanceBar = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { airg } = useTokenProviderContext()

  return smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <LocalGasStationIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(airg.toNumber())}{' '}
        AIRG
      </Typography>
    </Stack>
  ) : null
}

export default GasBalanceBar
