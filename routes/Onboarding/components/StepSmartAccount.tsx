import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

interface Props {
  onNext: () => void
  onBack: () => void
}

const StepSmartAccount: FC<Props> = ({ onNext, onBack }) => {
  return (
    <Box textAlign='center'>
      <Box mb={2} color='primary.main'>
        <AccountBalanceWalletIcon sx={{ fontSize: 80 }} />
      </Box>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 600 }}>
        Your Smart Account
      </Typography>
      <Typography variant='body1' paragraph color='text.secondary'>
        WeiFly uses decentralized <b>Smart Accounts</b> to ensure only you have access to your funds and assets.
      </Typography>
      <Typography variant='body2' paragraph color='text.secondary'>
        Unlike traditional platforms, this provides total security and true ownership of your hard-earned rewards. We{' '}
        <b>cannot</b> access your wallet!
      </Typography>

      <Box mt={6} display='flex' justifyContent='space-between'>
        <Button onClick={onBack} variant='outlined' size='large'>
          Back
        </Button>
        <Button onClick={onNext} variant='contained' color='primary' size='large'>
          Understood, Continue
        </Button>
      </Box>
    </Box>
  )
}

export default StepSmartAccount
