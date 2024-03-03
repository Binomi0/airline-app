import { Grid, Box, Typography, Stack, Button } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useStaking from 'hooks/useStaking'
import Swal from 'sweetalert2'
import { useTokenProviderContext } from 'context/TokenProvider'
import GradientCard from 'components/GradientCard'

const MIN_REWARDS_CLAIM = '100000000000000000000'

const GasFarmed = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(stakingAddress)
  const { data: stakeInfo, refetch: getStakeInfo } = useContractRead(contract, 'getStakeInfo', [smartAccountAddress])
  const { claimRewards, isLoading: isClaiming } = useStaking(contract)
  const { getAirgBalance } = useTokenProviderContext()

  const handleClaimRewards = useCallback(async () => {
    if (stakeInfo._rewards.gte(MIN_REWARDS_CLAIM)) {
      await claimRewards(Number(stakeInfo?._rewards || 0).toString())
      Swal.fire({
        title: 'Claimed Rewards!',
        text: 'Gas already collected',
        icon: 'success'
      })
      getStakeInfo()
      getAirgBalance()
    } else {
      Swal.fire({
        title: 'Unsufficient Rewards',
        text: 'You need to collect at least 100L in order to claim gas',
        icon: 'warning'
      })
      return
    }
  }, [claimRewards, getStakeInfo, stakeInfo, getAirgBalance])

  useEffect(() => {
    const timer = setInterval(getStakeInfo, 30000)
    return () => clearInterval(timer)
  }, [getStakeInfo])

  return (
    <Grid item xs={12} md={4}>
      <GradientCard>
        <Box p={1}>
          <Typography variant='subtitle1'>Farmed Gasoline (AIRG)</Typography>
          <Typography variant='caption'>
            Get <b>100 Liters/day</b> for each AIRL token staked
          </Typography>

          <Typography variant='h3' paragraph>
            {formatNumber(Number(stakeInfo?._rewards || 0) / 1e18)} Liters
          </Typography>

          <Stack>
            <Button color='info' disabled={isClaiming} size='small' variant='contained' onClick={handleClaimRewards}>
              Get Gas
            </Button>
          </Stack>
        </Box>
      </GradientCard>
    </Grid>
  )
}

export default GasFarmed
