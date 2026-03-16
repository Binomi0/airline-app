import React, { useCallback } from 'react'
import { formatNumber } from 'utils'
import { stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import { ethers } from 'ethers'
import useStaking from 'hooks/useStaking'
import GradientCard from 'components/GradientCard'
import { handleUnStakeSwal, maxWithdrawExceeded, unstakedSwal } from 'lib/swal'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

interface Props {
  getAirlBalance: () => void
  staking: any
  getStakingInfo: () => void
}

const GasDeposited = ({ staking, getAirlBalance, getStakingInfo }: Props) => {
  const { withdraw, isLoading } = useStaking()
  const maxAmount = (Number(staking?.[0] || 0) / 1e18).toString()

  const handleUnStake = useCallback(
    async (unstakeAmount: string) => {
      if (staking && staking[0] >= ethers.utils.parseEther(unstakeAmount).toBigInt()) {
        const { isConfirmed } = await handleUnStakeSwal(unstakeAmount)
        if (isConfirmed) {
          await withdraw(ethers.utils.parseEther(unstakeAmount))
          unstakedSwal()

          getStakingInfo()
          getAirlBalance()
        }
      } else {
        maxWithdrawExceeded()
      }
    },
    [staking?.amountStaked, withdraw, getStakingInfo, getAirlBalance]
  )

  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <Box p={1}>
          <Typography variant='subtitle1'>Deposited</Typography>
          <Typography variant='subtitle2' paragraph>
            {staking ? formatNumber(Number(staking[0].toString()) / 1e18) : formatNumber()} sAIRL
          </Typography>
          <GasForm
            max={maxAmount}
            onClick={handleUnStake}
            loading={isLoading}
            label='Amount to UnStake'
            buttonText='Remove from Staking'
          />
        </Box>
      </Paper>
    </Grid>
  )
}

export default GasDeposited
