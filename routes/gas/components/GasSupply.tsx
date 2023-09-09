import { Typography, CircularProgress } from '@mui/material'
import { useTokenProviderContext } from 'context/TokenProvider'
import { memo } from 'react'
import { formatNumber } from 'utils'

const GasSupply = () => {
  const { airl, isLoading } = useTokenProviderContext()
  return (
    <Typography paragraph>
      Available: {isLoading ? <CircularProgress size={14} /> : formatNumber(airl?.div(1e18).toNumber())} Liters
    </Typography>
  )
}

export default memo(GasSupply)
