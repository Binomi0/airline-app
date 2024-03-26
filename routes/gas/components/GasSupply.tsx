import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import { memo } from 'react'
import { formatNumber } from 'utils'

const GasSupply = () => {
  const { contract } = useContract(stakingAddress)
  const { data, isLoading } = useContractRead(contract, 'getRewardTokenBalance')

  return (
    <Typography paragraph>
      Available: {isLoading ? <CircularProgress size={14} /> : formatNumber(Number(data?.toString()) / 1e18)} Liters
    </Typography>
  )
}

export default memo(GasSupply)
