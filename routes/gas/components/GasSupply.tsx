import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useReadContract } from 'thirdweb/react'
import { memo } from 'react'
import { formatNumber } from 'utils'
import { useAppContracts } from 'hooks/useAppContracts'

const GasSupply = () => {
  const { stakingContract } = useAppContracts()

  const { data, isLoading } = useReadContract({
    contract: stakingContract!,
    method: 'function getRewardTokenBalance() view returns (uint256)',
    params: []
  })

  return (
    <Typography paragraph>
      Available: {isLoading ? <CircularProgress size={14} /> : formatNumber(Number(data?.toString()) / 1e18)} Liters
    </Typography>
  )
}

export default memo(GasSupply)
