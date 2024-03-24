import React, { useCallback, useEffect } from 'react'
import { useContract, useContractRead } from '@thirdweb-dev/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore } from 'store/wallet.atom'
import useStaking from 'hooks/useStaking'
import Swal from 'sweetalert2'
import GradientCard from 'components/GradientCard'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

const MIN_REWARDS_CLAIM = '100000000000000000000'

interface Props {
  getAirgBalance: () => void
}

const GasFarmed = ({ getAirgBalance }: Props) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { contract } = useContract(stakingAddress)
  const { data: stakeInfo, refetch: getStakeInfo } = useContractRead(contract, 'getStakeInfo', [smartAccountAddress])
  const { claimRewards, isLoading: isClaiming } = useStaking(contract)

  const handleClaimRewards = useCallback(async () => {
    if (stakeInfo?._rewards.gte(MIN_REWARDS_CLAIM)) {
      const { isConfirmed } = await Swal.fire({
        title: `Claim ${formatNumber(Number(stakeInfo?._rewards || 0) / 1e18)} AIRG?`,
        text: `You will get ${formatNumber(Number(stakeInfo?._rewards || 0) / 1e18)} AIRG fuel tokens`,
        icon: 'question',
        showCancelButton: true
      })
      if (!isConfirmed) return

      await claimRewards(Number(stakeInfo?._rewards || 0).toString())
      Swal.fire({
        title: 'Claimed Rewards!',
        text: 'Gas already collected',
        icon: 'success'
      })
      getStakeInfo()
      getAirgBalance()
    } else {
      Swal.fire({
        title: 'Unsufficient Rewards',
        text: 'You need to collect at least 100L in order to claim gas',
        icon: 'warning'
      })
    }
  }, [claimRewards, getStakeInfo, stakeInfo, getAirgBalance])

  useEffect(() => {
    const timer = setInterval(getStakeInfo, 30000)
    return () => clearInterval(timer)
  }, [getStakeInfo])

  return (
    <Grid item xs={12} md={4}>
      <Paper>
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
      </Paper>
    </Grid>
  )
}

export default GasFarmed
