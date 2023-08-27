import { Grid, Card, Box, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { formatNumber } from 'utils'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import { ethers } from 'ethers'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useStaking from 'hooks/useStaking'
import Swal from 'sweetalert2'

const GasDeposited = () => {
  const { smartAccountAddress: address } = useAlchemyProviderContext()
  const { contract } = useContract(stakingAddress)
  const { withdraw, isLoading } = useStaking(contract)
  const { data: staking, refetch } = useContractRead(contract, 'stakers', [address])
  const maxAmount = (Number(staking?.amountStaked) / 1e18).toString()

  const handleUnStake = useCallback(
    async (unstakeAmount: string) => {
      if (staking.amountStaked.gte(ethers.utils.parseEther(unstakeAmount))) {
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
        }
      } else {
        Swal.fire({
          title: 'Maximun exceeded',
          text: 'Cannot withdraw more than deposited :)',
          icon: 'info'
        })
      }
    },
    [staking?.amountStaked, withdraw, refetch]
  )

  return (
    <Grid item xs={4}>
      <Card>
        <Box p={1}>
          <Typography variant='subtitle1'>Deposited</Typography>
          <Typography variant='subtitle2' paragraph>
            {staking ? formatNumber(Number(staking.amountStaked.toString()) / 1e18) : formatNumber()} AIRL
          </Typography>
          <GasForm
            max={maxAmount}
            onClick={handleUnStake}
            loading={isLoading}
            label='Amount to UnStake'
            buttonText='Remove from Staking'
          />
        </Box>
      </Card>
    </Grid>
  )
}

export default GasDeposited
