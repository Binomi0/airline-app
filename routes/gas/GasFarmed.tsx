import { Grid, Card, Box, Typography, Stack, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useAddress, useBalance, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { rewardTokenAddress, stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'

const GasFarmed = () => {
  const address = useAddress()
  const { contract } = useContract(stakingAddress)
  const { data: stakeInfo, refetch: getStakeInfo } = useContractRead(contract, 'getStakeInfo', [address])
  const { mutateAsync: claimRewards, isLoading: isClaiming } = useContractWrite(contract, 'claimRewards')
  const { refetch } = useBalance(rewardTokenAddress)

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
            <Button
              color='info'
              disabled={isClaiming}
              size='small'
              variant='contained'
              onClick={async () => {
                await claimRewards({ args: [] })
                refetch()
              }}
            >
              Get Gas
            </Button>
          </Stack>
        </Box>
      </Card>
    </Grid>
  )
}

export default GasFarmed
