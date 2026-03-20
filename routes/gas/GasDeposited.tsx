import React, { useCallback } from 'react'
import { formatNumber } from 'utils'
import GasForm from './components/GasForm'
import { toWei } from 'thirdweb'
import useStaking from 'hooks/useStaking'
import { handleUnStakeSwal, maxWithdrawExceeded, unstakedSwal } from 'lib/swal'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import styles from 'styles/Gas.module.css'

interface Props {
  getAirlBalance: () => void
  staking?: readonly [bigint, bigint, bigint, bigint]
  getStakingInfo: () => void
}

const GasDeposited = ({ staking, getAirlBalance, getStakingInfo }: Props) => {
  const { withdraw, isLoading } = useStaking()
  const maxAmount = (Number(staking?.[0] || 0) / 1e18).toString()

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
      <Box className={styles.glassCard}>
        <Typography
          variant='subtitle1'
          fontWeight={700}
          sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Depositado
        </Typography>
        <Typography variant='h4' fontWeight={800} sx={{ my: 1 }}>
          {staking ? formatNumber(Number(staking[0].toString()) / 1e18) : formatNumber()}{' '}
          <span style={{ fontSize: '1rem', opacity: 0.5 }}>sAIRL</span>
        </Typography>
        <GasForm
          max={maxAmount}
          onClick={handleUnStake}
          loading={isLoading}
          label='Cantidad a Retirar'
          buttonText='Retirar del Staking'
        />
      </Box>
    </Grid>
  )
}

export default GasDeposited
