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
import Paper from '@mui/material/Paper'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

import LinearProgress from '@mui/material/LinearProgress'
import { styled, alpha } from '@mui/material/styles'

const WalletProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main
  }
}))

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

  const balance = Number(toEther(airl || 0n))

  return (
    <Grid item xs={12} md={4}>
      <Paper variant='gasCard' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.6 }}>
          <AccountBalanceWalletIcon fontSize='small' />
          <Typography variant='subtitle2' fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Disponible
          </Typography>
        </Box>
        <Typography variant='h3' fontWeight={900} sx={{ mb: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
          {formatNumber(balance)}{' '}
          <Typography component='span' variant='h6' sx={{ opacity: 0.5, fontWeight: 700 }}>
            AIRL
          </Typography>
        </Typography>

        <Box sx={{ mt: 1, mb: 3 }}>
          <Typography variant='caption' sx={{ opacity: 0.5, fontWeight: 700, mb: 0.5, display: 'block' }}>
            Balance en Wallet
          </Typography>
          <WalletProgress variant='determinate' value={balance > 0 ? 100 : 0} />
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <GasForm
            max={airl !== undefined ? toEther(airl).toString() : '0'}
            onClick={handleStake}
            loading={loading}
            label='Cantidad a Stakear'
            buttonText='Añadir al Staking'
          />
        </Box>
      </Paper>
    </Grid>
  )
}

export default GasAvailable
