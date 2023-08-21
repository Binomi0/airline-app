import { Grid, Card, Box, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useContract } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { formatNumber } from 'utils'
import { coinTokenAddress, stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import useStaking from 'hooks/useStaking'
import useERC20 from 'hooks/useERC20'
import useTokenBalance from 'hooks/useTokenBalance'

const GasAvailable = () => {
  const { balance: airl } = useTokenBalance(coinTokenAddress)
  const { contract: staking, refetch } = useContract(stakingAddress)
  const { stake } = useStaking(staking)
  const { setAllowance } = useERC20()
  const [loading, setLoading] = useState(false)

  const handleStake = useCallback(
    async (amount: string) => {
      const _amount = ethers.utils.parseEther(amount)
      setLoading(true)
      if (await setAllowance(stakingAddress, _amount)) {
        await stake(_amount)
        refetch()
      }
      setLoading(false)
    },
    [setAllowance, stake, refetch]
  )

  return (
    <Grid item xs={4}>
      <Card>
        <Box p={1}>
          <Typography variant='subtitle1'>Available to deposit</Typography>
          <Typography variant='subtitle2' paragraph>
            {formatNumber(airl.toNumber())} AIRL
          </Typography>
          <GasForm
            max={airl.toString()}
            onClick={handleStake}
            loading={loading}
            label='Amount to Stake'
            buttonText='Add to Staking'
          />
        </Box>
      </Card>
    </Grid>
  )
}

export default GasAvailable
