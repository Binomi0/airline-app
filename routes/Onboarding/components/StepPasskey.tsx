import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import Alert from '@mui/material/Alert'

interface Props {
  onNext: () => void
  onBack: () => void
}

const StepPasskey: FC<Props> = ({ onNext, onBack }) => {
  return (
    <Box textAlign='center'>
      <Box mb={2} color='primary.main'>
        <FingerprintIcon sx={{ fontSize: 80 }} />
      </Box>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 600 }}>
        Secure with Passkeys
      </Typography>
      <Typography variant='body1' paragraph color='text.secondary'>
        We use Passkeys for seamless, passwordless login. Your wallet is securely encrypted and stored logically on your device.
      </Typography>
      
      <Box my={3}>
        <Alert severity='info' sx={{ textAlign: 'left' }}>
          <strong>Recommendation:</strong> It's highly recommended to add a backup Passkey on another device (e.g. your phone or another PC) later from your settings to avoid losing access to your account.
        </Alert>
      </Box>
      
      <Box mt={4} display='flex' justifyContent='space-between'>
        <Button onClick={onBack} variant='outlined' size='large'>
          Back
        </Button>
        <Button onClick={onNext} variant='contained' color='primary' size='large'>
          Got it
        </Button>
      </Box>
    </Box>
  )
}

export default StepPasskey
