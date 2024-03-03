import { Grid, Box, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { formatNumber } from 'utils'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import { ethers } from 'ethers'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useStaking from 'hooks/useStaking'
import Swal from 'sweetalert2'
import { useTokenProviderContext } from 'context/TokenProvider'
import GradientCard from 'components/GradientCard'

const GasDeposited = () => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { contract } = useContract(stakingAddress)
  const { withdraw, isLoading } = useStaking(contract)
  const { data: staking, refetch } = useContractRead(contract, 'stakers', [address])
  const maxAmount = (Number(staking?.amountStaked) / 1e18).toString()
  const { getBalances } = useTokenProviderContext()

  const handleUnStake = useCallback(
    async (unstakeAmount: string) => {
      if (staking?.amountStaked.gte(ethers.utils.parseEther(unstakeAmount))) {
        const { isConfirmed } = await Swal.fire({
          title: 'Unstaking AIRL token',
          text: `Are you sure you want to withdraw ${unstakeAmount} tokens?`,
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true
        })
        if (isConfirmed) {
          await withdraw(ethers.utils.parseEther(unstakeAmount))
          Swal.fire({
            title: 'UnStaked!',
            text: 'Funds already claimed from staking, hope your planes are full!',
            icon: 'success'
          })
          refetch()
          getBalances()
        }
      } else {
        Swal.fire({
          title: 'Maximun exceeded',
          text: 'Cannot withdraw more than deposited :)',
          icon: 'info'
        })
      }
    },
    [staking?.amountStaked, withdraw, refetch, getBalances]
  )

  return (
    <Grid item xs={12} md={4}>
      <GradientCard>
        <Box p={1}>
          <Typography variant='subtitle1'>Deposited</Typography>
          <Typography variant='subtitle2' paragraph>
            {staking ? formatNumber(Number(staking.amountStaked.toString()) / 1e18) : formatNumber()} AIRG
          </Typography>
          <GasForm
            max={maxAmount}
            onClick={handleUnStake}
            loading={isLoading}
            label='Amount to UnStake'
            buttonText='Remove from Staking'
          />
        </Box>
      </GradientCard>
    </Grid>
  )
}

export default GasDeposited
