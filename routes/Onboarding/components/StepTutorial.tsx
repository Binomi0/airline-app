import React, { FC, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

interface Props {
  onComplete: () => Promise<void>
  onBack: () => void
}

const StepTutorial: FC<Props> = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    setLoading(true)
    await onComplete()
    setLoading(false)
  }

  return (
    <Box textAlign='center'>
      <Box mb={2} color='success.main'>
        <FlightTakeoffIcon sx={{ fontSize: 80 }} />
      </Box>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 600 }}>
        Welcome to WeiFly
      </Typography>
      <Typography variant='body1' paragraph color='text.secondary'>
        You can earn <b>licenses</b> by completing flights and milestones. Use <b>AIRL</b> tokens to purchase new
        advanced aircraft in the Hangar.
      </Typography>
      <Typography variant='body2' paragraph color='text.secondary'>
        Remember: <b>AIRL</b> is the governance token to buy assets, while <b>AIRG</b> is the utility token earned
        purely through flying! Have safe flights!
      </Typography>

      <Box mt={6} display='flex' justifyContent='space-between'>
        <Button onClick={onBack} variant='outlined' size='large' disabled={loading}>
          Back
        </Button>
        <Button onClick={handleFinish} variant='contained' color='success' size='large' disabled={loading}>
          {loading ? <CircularProgress size={24} color='inherit' /> : 'Take off!'}
        </Button>
      </Box>
    </Box>
  )
}

export default StepTutorial
