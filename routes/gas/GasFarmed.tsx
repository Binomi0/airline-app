import React, { useCallback, useEffect } from 'react'
import { getContract } from 'thirdweb'
import { useReadContract } from 'thirdweb/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore, walletStore } from 'store/wallet.atom'
import useStaking from 'hooks/useStaking'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { stakingClaimRewardsSwal, stakingInsufficientRewardsSwal, stakingRewardsClaimedSwal } from 'lib/swal'
import styles from 'styles/Gas.module.css'

const MIN_REWARDS_CLAIM = '100000000000000000000'

interface Props {
  getAirgBalance: () => void
}

const GasFarmed = ({ getAirgBalance }: Props) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { twClient, twChain } = useRecoilValue(walletStore)

  const contract =
    twClient && twChain
      ? getContract({
          client: twClient,
          chain: twChain,
          address: stakingAddress
        })
      : undefined

  const { data: stakeInfo, refetch: getStakeInfo } = useReadContract({
    contract: contract!,
    method: 'function getStakeInfo(address _staker) view returns (uint256 _tokensStaked, uint256 _rewards)',
    params: [smartAccountAddress!]
  })

  const { claimRewards, isLoading: isClaiming } = useStaking()

  const canClaimMin = stakeInfo && stakeInfo[1] >= BigInt(MIN_REWARDS_CLAIM)

  const handleClaimRewards = useCallback(async () => {
    if (canClaimMin) {
      const { isConfirmed } = await stakingClaimRewardsSwal(Number(stakeInfo?.[1] || 0))
      if (isConfirmed) {
        await claimRewards(Number(stakeInfo?.[1] || 0).toString())
        stakingRewardsClaimedSwal()
        getStakeInfo()
        getAirgBalance()
      }
    } else {
      stakingInsufficientRewardsSwal()
    }
  }, [canClaimMin, stakeInfo, claimRewards, getStakeInfo, getAirgBalance])

  useEffect(() => {
    const timer = setInterval(getStakeInfo, 30000)
    return () => clearInterval(timer)
  }, [getStakeInfo])

  return (
    <Grid item xs={12} md={4}>
      <Box className={styles.glassCard}>
        <Typography variant='subtitle1' fontWeight={700} sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Combustible Generado (AIRG)
        </Typography>
        <Typography variant='caption' sx={{ opacity: 0.8, mb: 1 }}>
          Gana <b>100 Litros/día</b> por cada AIRL stakeado
        </Typography>

        <Typography variant='h3' fontWeight={800} sx={{ my: 2, color: '#6366f1' }}>
          {formatNumber(Number(stakeInfo?.[1] || 0) / 1e18)} <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>Liters</span>
        </Typography>

        <Stack>
          <Button
            className={styles.premiumButton}
            disabled={isClaiming || !canClaimMin}
            variant='contained'
            onClick={handleClaimRewards}
            fullWidth
          >
            Recolectar Combustible
          </Button>
        </Stack>
      </Box>
    </Grid>
  )
}

export default GasFarmed
