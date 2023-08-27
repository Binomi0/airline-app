import { Grid, Card, Box, Typography, Stack, Button } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useStaking from 'hooks/useStaking'
import Swal from 'sweetalert2'

const MIN_REWARDS_CLAIM = '100000000000000000000'

const GasFarmed = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(stakingAddress)
  const { data: stakeInfo, refetch: getStakeInfo } = useContractRead(contract, 'getStakeInfo', [smartAccountAddress])
  const { claimRewards, isLoading: isClaiming } = useStaking(contract)

  const handleClaimRewards = useCallback(async () => {
    if (stakeInfo._rewards.gte(MIN_REWARDS_CLAIM)) {
      const receipt = await claimRewards(stakeInfo?._rewards)
      Swal.fire({
        title: 'Claimed Rewards!',
        text: 'Gas already collected',
        icon: 'success'
      })
      console.log('handleClaimRewards', { receipt })
      getStakeInfo()
    } else {
      Swal.fire({
        title: 'Unsufficient Rewards',
        text: 'You need to collect at least 100L in order to claim gas',
        icon: 'warning'
      })
      return
    }
  }, [claimRewards, getStakeInfo, stakeInfo])

  useEffect(() => {
    const timer = setInterval(getStakeInfo, 15000)
    return () => clearInterval(timer)
  }, [getStakeInfo])

  return (
    <Grid item xs={4}>
      <Card>
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
      </Card>
    </Grid>
  )
}

export default GasFarmed
