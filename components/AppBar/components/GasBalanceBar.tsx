import { Stack, Typography } from '@mui/material'
import { rewardTokenAddress } from 'contracts/address'
import React from 'react'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import useTokenBalance from 'hooks/useTokenBalance'

const GasBalanceBar = () => {
  const { balance, refetch } = useTokenBalance(rewardTokenAddress)

  React.useEffect(() => {
    const timer = setInterval(refetch, 15000)
    return () => clearInterval(timer)
  }, [refetch])

  return (
    <Stack direction='row' alignItems='center' mx={2} spacing={1}>
      <LocalGasStationIcon color='inherit' fontSize='medium' />
      <Typography variant='h6'>
        {Intl.NumberFormat('en', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(balance.toNumber())}{' '}
        AIRG
      </Typography>
    </Stack>
  )
}

export default GasBalanceBar
