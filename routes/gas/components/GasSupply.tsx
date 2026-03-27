import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useReadContract } from 'thirdweb/react'
import { memo } from 'react'
import { formatNumber } from 'utils'
import { useAppContracts } from 'hooks/useAppContracts'
import Box from '@mui/material/Box'

const GasSupply = () => {
  const { stakingContract } = useAppContracts()

  const { data, isLoading } = useReadContract({
    contract: stakingContract!,
    method: 'function getRewardTokenBalance() view returns (uint256)',
    params: []
  })

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='body2' sx={{ fontWeight: 700, opacity: 0.7 }}>
        Capacidad Total de la Estación:
      </Typography>
      <Typography variant='body1' sx={{ fontWeight: 800, color: 'primary.main' }}>
        {isLoading ? <CircularProgress size={14} /> : formatNumber(Number(data?.toString()) / 1e18)} Liters
      </Typography>
    </Box>
  )
}

export default memo(GasSupply)
