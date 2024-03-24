import React, { useCallback, useState } from 'react'
import { useContract } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { formatNumber } from 'utils'
import { coinTokenAddress, stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import useStaking from 'hooks/useStaking'
import useERC20 from 'hooks/useERC20'
import GradientCard from 'components/GradientCard'
import { amountExceedBalanceSwal, handleStakeSwal, stakedSwal } from 'lib/swal'
import BigNumber from 'bignumber.js'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

interface Props {
  airl?: Readonly<BigNumber>
  getAirlBalance: () => void
  getStakingInfo: () => void
}

const GasAvailable = ({ airl, getAirlBalance, getStakingInfo }: Props) => {
  const { contract: staking } = useContract(stakingAddress)
  const { stake } = useStaking(staking)
  const { setAllowance, getAllowance } = useERC20(coinTokenAddress)
  const [loading, setLoading] = useState(false)

  const handleStake = useCallback(
    async (amount: string) => {
      if (airl?.isGreaterThanOrEqualTo(amount)) {
        setLoading(true)
        const { isConfirmed } = await handleStakeSwal(amount)
        if (isConfirmed) {
          const _amount = ethers.utils.parseEther(amount)
          const allowance = await getAllowance(stakingAddress)

          if (allowance.isZero()) {
            await setAllowance(stakingAddress)
          }
          await stake(_amount)
          stakedSwal()
          getAirlBalance()
          getStakingInfo()
        }
        setLoading(false)
      } else {
        amountExceedBalanceSwal()
      }
    },
    [airl, getAirlBalance, getAllowance, getStakingInfo, setAllowance, stake]
  )

  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <Box p={1}>
          <Typography variant='subtitle1'>Available to deposit</Typography>
          <Typography variant='subtitle2' paragraph>
            {airl ? formatNumber(Number(airl.toNumber() || 0)) : formatNumber()} AIRL
          </Typography>
          <GasForm
            max={airl?.toString() || '0'}
            onClick={handleStake}
            loading={loading}
            label='Amount to Stake'
            buttonText='Add to Staking'
          />
        </Box>
      </Paper>
    </Grid>
  )
}

export default GasAvailable
