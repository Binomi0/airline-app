import { Grid, Card, Box, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useBalance, useContract, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { formatNumber } from 'utils'
import { coinTokenAddress, stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'

const GasAvailable = () => {
  const { data: airl } = useBalance(coinTokenAddress)
  const { contract: coin } = useContract(coinTokenAddress, 'token')
  const { contract: staking, refetch } = useContract(stakingAddress)
  const { mutateAsync: stake } = useContractWrite(staking, 'stake')
  const [loading, setLoading] = useState(false)

  const setAllowance = useCallback(
    async (amount: string) => {
      try {
        await coin?.erc20.setAllowance(stakingAddress, ethers.utils.parseEther(amount).toString())
        return true
      } catch (error) {
        return false
      }
    },
    [coin]
  )

  const handleStake = useCallback(
    async (amount: string) => {
      setLoading(true)
      if (await setAllowance(amount)) {
        await stake({
          args: [ethers.utils.parseEther(amount)]
        })
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
            {formatNumber(Number(airl?.displayValue))} AIRL
          </Typography>
          <GasForm
            max={airl?.displayValue || ''}
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
