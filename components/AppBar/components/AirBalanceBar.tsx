import React from 'react'
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket'
import { Stack, Typography } from '@mui/material'
import { coinTokenAddress } from 'contracts/address'
import useTokenBalance from 'hooks/useTokenBalance'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'

const AirBalanceBar = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { balance, refetch } = useTokenBalance(coinTokenAddress)

  React.useEffect(() => {
    const timer = setInterval(refetch, 15000)
    return () => clearInterval(timer)
  }, [refetch])

  return smartAccountAddress ? (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <AirplaneTicketIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(balance.toNumber())}{' '}
        AIRL
      </Typography>
    </Stack>
  ) : null
}

export default AirBalanceBar
