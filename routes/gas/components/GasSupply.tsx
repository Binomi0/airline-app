import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { getContract } from 'thirdweb'
import { useReadContract } from 'thirdweb/react'
import { stakingAddress } from 'contracts/address'
import { memo } from 'react'
import { formatNumber } from 'utils'
import { useRecoilValue } from 'recoil'
import { walletStore } from 'store/wallet.atom'

const GasSupply = () => {
  const { twClient, twChain } = useRecoilValue(walletStore)

  const contract = (twClient && twChain) ? getContract({
    client: twClient,
    chain: twChain,
    address: stakingAddress
  }) : undefined

  const { data, isLoading } = useReadContract({
    contract: contract as any,
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
