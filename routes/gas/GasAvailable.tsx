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
import Swal from 'sweetalert2'

const GasAvailable = () => {
  const { balance: airl, refetch } = useTokenBalance(coinTokenAddress)
  const { contract: staking } = useContract(stakingAddress)
  const { stake } = useStaking(staking)
  const { setAllowance } = useERC20(coinTokenAddress)
  const [loading, setLoading] = useState(false)

  const handleStake = useCallback(
    async (amount: string) => {
      if (airl.isGreaterThanOrEqualTo(amount)) {
        setLoading(true)
        const { isConfirmed } = await Swal.fire({
          title: 'Staking AIRL tokens',
          text: 'Are you sure you want to Stake?',
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true
        })
        if (isConfirmed) {
          const _amount = ethers.utils.parseEther(amount)
          await setAllowance(stakingAddress)
          const receipt = await stake(_amount)
          console.log('Staking receipt: ', receipt)
          refetch()
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
    [airl, setAllowance, stake, refetch]
  )

  React.useEffect(() => {
    const timer = setInterval(refetch, 15000)
    return () => clearInterval(timer)
  }, [refetch])

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
