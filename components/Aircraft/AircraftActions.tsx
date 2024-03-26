import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'

const AircraftActions: React.FC<{
  // eslint-disable-next-line no-unused-vars
  onClaim: () => void
  isClaiming: boolean
  hasAircraft: boolean
  hasLicense?: boolean
  name?: string
}> = ({ onClaim, isClaiming, hasLicense, hasAircraft, name }) => {
  const router = useRouter()

  const handleClick = useCallback(
    () => (hasLicense ? onClaim() : router.push('/license')),
    [hasLicense, router, onClaim]
  )

  if (hasAircraft) return null
  return (
    <CardActions sx={{ px: 2 }}>
      {isClaiming && <LinearProgress />}
      <Button
        color={hasLicense ? 'success' : 'primary'}
        size='small'
        disabled={isClaiming}
        variant='contained'
        onClick={handleClick}
      >
        {isClaiming ? <CircularProgress size={14} /> : hasLicense ? `Claim ${name}` : 'Require licencia'}
      </Button>
    </CardActions>
  )
}

export default React.memo(AircraftActions)
