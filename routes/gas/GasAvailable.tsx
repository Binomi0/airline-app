import { Grid, Box, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useContract } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { formatNumber } from 'utils'
import { coinTokenAddress, stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import useStaking from 'hooks/useStaking'
import useERC20 from 'hooks/useERC20'
import Swal from 'sweetalert2'
import { useTokenProviderContext } from 'context/TokenProvider'
import GradientCard from 'components/GradientCard'

const GasAvailable = () => {
  const { airl, getBalances } = useTokenProviderContext()
  const { contract: staking } = useContract(stakingAddress)
  const { stake } = useStaking(staking)
  const { setAllowance, getAllowance } = useERC20(coinTokenAddress)
  const [loading, setLoading] = useState(false)

  const handleStake = useCallback(
    async (amount: string) => {
      if (airl?.isGreaterThanOrEqualTo(amount)) {
        setLoading(true)
        const { isConfirmed } = await Swal.fire({
          title: `Stake ${amount} AIRL`,
          text: `Are you sure you want to stake ${amount} tokens?`,
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true
        })
        if (isConfirmed) {
          const _amount = ethers.utils.parseEther(amount)
          const allowance = await getAllowance(stakingAddress)
          if (allowance.isZero()) {
            await setAllowance(stakingAddress)
          }
          await stake(_amount)
          getBalances()
          setLoading(false)
        } else {
          setLoading(false)
        }
      } else {
        Swal.fire({
          title: 'Amount exceed balance',
          text: 'Cannot stake more tokens than current balance',
          icon: 'info'
        })
      }
    },
    [airl, getBalances, getAllowance, setAllowance, stake]
  )

  return (
    <Grid item xs={12} md={4}>
      <GradientCard>
        <Box p={1}>
          <Typography variant='subtitle1'>Available to deposit</Typography>
          <Typography variant='subtitle2' paragraph>
            {formatNumber(airl?.toNumber() || 0)} AIRL
          </Typography>
          <GasForm
            max={airl?.toString() || '0'}
            onClick={handleStake}
            loading={loading}
            label='Amount to Stake'
            buttonText='Add to Staking'
          />
        </Box>
      </GradientCard>
    </Grid>
  )
}

export default GasAvailable
