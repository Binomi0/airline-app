import { Grid, Card, Box, Typography, Stack, Button } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useStaking from 'hooks/useStaking'

const GasFarmed = () => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { contract } = useContract(stakingAddress)
  const { data: stakeInfo, refetch: getStakeInfo } = useContractRead(contract, 'getStakeInfo', [address])
  const { claimRewards, isLoading: isClaiming } = useStaking(contract)

  const handleClaimRewards = useCallback(async () => {
    const receipt = await claimRewards(stakeInfo?._rewards)
    console.log({ receipt })
    getStakeInfo()
  }, [claimRewards, getStakeInfo, stakeInfo?._rewards])

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
