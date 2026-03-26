import React, { useCallback } from 'react'
import { formatNumber } from 'utils'
import GasForm from './components/GasForm'
import { toWei } from 'thirdweb'
import useStaking from 'hooks/useStaking'
import { handleUnStakeSwal, maxWithdrawExceeded, unstakedSwal } from 'lib/swal'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LockIcon from '@mui/icons-material/Lock'

import LinearProgress from '@mui/material/LinearProgress'
import { styled, alpha } from '@mui/material/styles'

const StorageProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.secondary.main
  }
}))

interface Props {
  getAirlBalance: () => void
  staking?: readonly [bigint, bigint, bigint, bigint]
  getStakingInfo: () => void
}

const GasDeposited = ({ staking, getAirlBalance, getStakingInfo }: Props) => {
  const { withdraw, isLoading } = useStaking()
  const stakedAmount = Number(staking?.[0] || 0) / 1e18
  const maxAmount = stakedAmount.toString()

  const handleUnStake = useCallback(
    async (unstakeAmount: string) => {
      if (staking && staking[0] >= toWei(unstakeAmount)) {
        const { isConfirmed } = await handleUnStakeSwal(unstakeAmount)
        if (isConfirmed) {
          await withdraw(toWei(unstakeAmount))
          unstakedSwal()

          getStakingInfo()
          getAirlBalance()
        }
      } else {
        maxWithdrawExceeded()
      }
    },
    [staking, withdraw, getStakingInfo, getAirlBalance]
  )

  return (
    <Grid item xs={12} md={4}>
      <Paper variant='gasCard' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.6 }}>
          <LockIcon fontSize='small' />
          <Typography
            variant='subtitle2'
            fontWeight={800}
            sx={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}
          >
            Depositado
          </Typography>
        </Box>
        <Typography
          variant='h3'
          fontWeight={900}
          sx={{
            mb: 1,
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            color: 'secondary.main'
          }}
        >
          {formatNumber(stakedAmount)}{' '}
          <Typography component='span' variant='h6' sx={{ opacity: 0.5, fontWeight: 700 }}>
            sAIRL
          </Typography>
        </Typography>

        <Box sx={{ mt: 1, mb: 3 }}>
          <Typography variant='caption' sx={{ opacity: 0.5, fontWeight: 700, mb: 0.5, display: 'block' }}>
            Estado de Almacenamiento
          </Typography>
          <StorageProgress variant='determinate' value={stakedAmount > 0 ? 100 : 0} />
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <GasForm
            max={maxAmount}
            onClick={handleUnStake}
            loading={isLoading}
            label='Cantidad a Retirar'
            buttonText='Retirar del Staking'
          />
        </Box>
      </Paper>
    </Grid>
  )
}

export default GasDeposited
