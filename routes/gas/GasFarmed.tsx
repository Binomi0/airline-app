import React, { useCallback, useEffect } from 'react'
import { useContract, useContractRead } from 'thirdweb/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import useStaking from 'hooks/useStaking'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { stakingClaimRewardsSwal, stakingInsufficientRewardsSwal, stakingRewardsClaimedSwal } from 'lib/swal'

const MIN_REWARDS_CLAIM = '100000000000000000000'

interface Props {
  getAirgBalance: () => void
}

const GasFarmed = ({ getAirgBalance }: Props) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { contract } = useContract(stakingAddress)
  const { data: stakeInfo, refetch: getStakeInfo } = useContractRead(contract, 'getStakeInfo', [smartAccountAddress])
  const { claimRewards, isLoading: isClaiming } = useStaking(contract)

  const canClaimMin = stakeInfo?._rewards.gte(MIN_REWARDS_CLAIM)

  const handleClaimRewards = useCallback(async () => {
    if (canClaimMin) {
      const { isConfirmed } = await stakingClaimRewardsSwal(Number(stakeInfo?._rewards) || 0)
      if (isConfirmed) {
        await claimRewards(Number(stakeInfo?._rewards || 0).toString())
        stakingRewardsClaimedSwal()
        getStakeInfo()
        getAirgBalance()
      }
    } else {
      stakingInsufficientRewardsSwal()
    }
  }, [canClaimMin, stakeInfo?._rewards, claimRewards, getStakeInfo, getAirgBalance])

  useEffect(() => {
    const timer = setInterval(getStakeInfo, 30000)
    return () => clearInterval(timer)
  }, [getStakeInfo])

  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <Box p={1}>
          <Typography variant='subtitle1'>Farmed Gasoline (AIRG)</Typography>
          <Typography variant='caption'>
            Get <b>100 Liters/day</b> for each AIRL token staked
          </Typography>

          <Typography variant='h3' paragraph>
            {formatNumber(Number(stakeInfo?._rewards || 0) / 1e18)} Liters
          </Typography>

          <Stack>
            <Button
              color='info'
              disabled={isClaiming || !canClaimMin}
              size='small'
              variant='contained'
              onClick={handleClaimRewards}
            >
              Get Gas
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Grid>
  )
}

export default GasFarmed
