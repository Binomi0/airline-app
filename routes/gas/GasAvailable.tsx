import React, { useCallback, useState } from 'react'
import { toWei, toEther } from 'thirdweb'
import { formatNumber } from 'utils'
import { coinTokenAddress, stakingAddress } from 'contracts/address'
import GasForm from './components/GasForm'
import useStaking from 'hooks/useStaking'
import useERC20 from 'hooks/useERC20'
import { amountExceedBalanceSwal, handleStakeSwal, stakedSwal } from 'lib/swal'

import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import styles from 'styles/Gas.module.css'

interface Props {
  airl?: Readonly<bigint>
  getAirlBalance: () => void
  getStakingInfo: () => void
}

const GasAvailable = ({ airl, getAirlBalance, getStakingInfo }: Props) => {
  const { stake } = useStaking()
  const { setAllowance, getAllowance } = useERC20(coinTokenAddress)
  const [loading, setLoading] = useState(false)

  const handleStake = useCallback(
    async (amount: string) => {
      const parsedAmount = toWei(amount)
      if (airl !== undefined && airl >= parsedAmount) {
        setLoading(true)
        const { isConfirmed } = await handleStakeSwal(amount)
        if (isConfirmed) {
          const allowance = await getAllowance(stakingAddress)

          if (allowance === 0n) {
            await setAllowance(stakingAddress)
          }
          await stake(parsedAmount)
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
      <Box className={styles.glassCard}>
        <Typography
          variant='subtitle1'
          fontWeight={700}
          sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Disponible para Depósito
        </Typography>
        <Typography variant='h4' fontWeight={800} sx={{ my: 1 }}>
          {airl !== undefined ? formatNumber(Number(toEther(airl || 0n))) : formatNumber()}{' '}
          <span style={{ fontSize: '1rem', opacity: 0.5 }}>AIRL</span>
        </Typography>
        <GasForm
          max={airl !== undefined ? toEther(airl).toString() : '0'}
          onClick={handleStake}
          loading={loading}
          label='Cantidad a Stakear'
          buttonText='Añadir al Staking'
        />
      </Box>
    </Grid>
  )
}

export default GasAvailable
