import React from 'react'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { Stack, Typography } from '@mui/material'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import { useTokenProviderContext } from 'context/TokenProvider'

const AirBalanceBar = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { airl } = useTokenProviderContext()

  return smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <AirplaneTicketIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(airl?.toNumber() || 0)}{' '}
        AIRL
      </Typography>
    </Stack>
  ) : null
}

export default AirBalanceBar
