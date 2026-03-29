import React, { useCallback, useEffect } from 'react'
import { getContract } from 'thirdweb'
import { useReadContract } from 'thirdweb/react'
import { stakingAddress } from 'contracts/address'
import { formatNumber } from 'utils'
import { useRecoilValue } from 'recoil'
import { smartAccountAddressStore, walletStore } from 'store/wallet.atom'
import useStaking from 'hooks/useStaking'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import { stakingClaimRewardsSwal, stakingInsufficientRewardsSwal, stakingRewardsClaimedSwal } from 'lib/swal'

import LinearProgress from '@mui/material/LinearProgress'
import { styled, alpha, keyframes, Theme } from '@mui/material/styles'

const MIN_REWARDS_CLAIM = '100000000000000000000'

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`

const FuelProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
    background: (theme: Theme) =>
      `linear-gradient(90deg, ${theme.palette.indigo.main} 0%, ${theme.palette.violet.main} 100%)`
  }
}))

const StatusDot = styled('div')<{ active?: boolean }>(({ theme, active }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.success.main : alpha(theme.palette.text.primary, 0.2),
  boxShadow: active ? `0 0 10px ${theme.palette.success.main}` : 'none',
  animation: active ? `${pulse} 2s infinite ease-in-out` : 'none'
}))

interface Props {
  getAirgBalance: () => void
}

const GasFarmed = ({ getAirgBalance }: Props) => {
  const smartAccountAddress = useRecoilValue(smartAccountAddressStore)
  const { twClient, twChain } = useRecoilValue(walletStore)

  const contract =
    twClient && twChain
      ? getContract({
          client: twClient,
          chain: twChain,
          address: stakingAddress
        })
      : undefined

  const { data: stakeInfo, refetch: getStakeInfo } = useReadContract({
    contract: contract!,
    method: 'function getStakeInfo(address _staker) view returns (uint256 _tokensStaked, uint256 _rewards)',
    params: [smartAccountAddress!]
  })

  const { claimRewards, isLoading: isClaiming } = useStaking()

  const stakedAmount = Number(stakeInfo?.[0] || 0) / 1e18
  const rewards = Number(stakeInfo?.[1] || 0) / 1e18
  const progress = Math.min((rewards / 100) * 100, 100)
  const canClaimMin = stakeInfo && stakeInfo[1] >= BigInt(MIN_REWARDS_CLAIM)

  const handleClaimRewards = useCallback(async () => {
    if (canClaimMin) {
      const { isConfirmed } = await stakingClaimRewardsSwal(Number(stakeInfo?.[1] || 0))
      if (isConfirmed) {
        await claimRewards(Number(stakeInfo?.[1] || 0).toString())
        stakingRewardsClaimedSwal()
        getStakeInfo()
        getAirgBalance()
      }
    } else {
      stakingInsufficientRewardsSwal()
    }
  }, [canClaimMin, stakeInfo, claimRewards, getStakeInfo, getAirgBalance])

  useEffect(() => {
    const timer = setInterval(getStakeInfo, 30000)
    return () => clearInterval(timer)
  }, [getStakeInfo])

  return (
    <Grid item xs={12} md={4}>
      <Paper variant='gasCard' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.6 }}>
            <LocalGasStationIcon fontSize='small' color='primary' />
            <Typography
              variant='subtitle2'
              fontWeight={800}
              sx={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}
            >
              Generado
            </Typography>
          </Box>
          <StatusDot active={Number(stakeInfo?.[0] || 0) > 0} title='Generando combustible...' />
        </Box>

        <Typography variant='caption' sx={{ opacity: 0.8, fontWeight: 600, mb: 2 }}>
          Generando actualmente{' '}
          <Box component='span' sx={{ color: 'success.main' }}>
            {formatNumber(stakedAmount * 100, 0)} Litros/día
          </Box>
        </Typography>

        <Typography
          variant='h2'
          fontWeight={900}
          sx={{
            my: 1,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            textShadow: (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          {formatNumber(rewards)}{' '}
          <Typography component='span' variant='h5' sx={{ opacity: 0.6, fontWeight: 700 }}>
            Liters
          </Typography>
        </Typography>

        <Box sx={{ mt: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant='caption' fontWeight={700} sx={{ opacity: 0.5 }}>
              Progreso de Recolección
            </Typography>
            <Typography variant='caption' fontWeight={800} color={canClaimMin ? 'secondary' : 'inherit'}>
              {canClaimMin ? 'LISTO' : `${progress.toFixed(0)}%`}
            </Typography>
          </Box>
          <FuelProgress variant='determinate' value={progress} />
        </Box>

        <Stack sx={{ mt: 'auto' }}>
          <Button disabled={isClaiming || !canClaimMin} onClick={handleClaimRewards} fullWidth variant='premium'>
            Recolectar Combustible
          </Button>
        </Stack>
      </Paper>
    </Grid>
  )
}

export default GasFarmed
