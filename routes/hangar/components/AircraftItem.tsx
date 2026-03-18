import React, { useCallback } from 'react'
import { getNFTAttributes } from 'utils'
import AircraftCardHeader from './AircraftCardHeader'
import AircraftActions from './AircraftActions'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRecoilValue } from 'recoil'
import { userState } from 'store/user.atom'
import Paper from '@mui/material/Paper'
import { INft } from 'models/Nft'
import useAircraft from 'hooks/useAircraft'

interface Props {
  nft: INft
  isClaiming: boolean
  onClaim: (refetch: () => void) => void
}

const AircraftItem = ({ nft, isClaiming, onClaim }: Props) => {
  const user = useRecoilValue(userState)
  const { hasAircraft } = useAircraft(nft.id as string)

  const handleClaim = useCallback(() => {
    onClaim(() => {})
  }, [onClaim])

  return (
    <Grid item xs={12} lg={6}>
      <Paper sx={{ border: hasAircraft ? '3px solid green' : undefined, position: 'relative' }}>
        {hasAircraft && (
          <Box
            sx={{
              '&:before': {
                opacity: 0.1,
                fontSize: '64px',
                color: 'green',
                content: '"OWNED"',
                position: 'absolute',
                top: 80,
                left: 50,
                transform: 'rotate(345deg)'
              }
            }}
          />
        )}
        <AircraftCardHeader nft={nft} />

        <CardContent>
          {getNFTAttributes(nft).map((attribute) => (
            <Stack direction='row' justifyContent='space-between' key={attribute.trait_type}>
              <Typography>{attribute.trait_type}</Typography>
              <Typography variant='body2'>{attribute.value}</Typography>
            </Stack>
          ))}
        </CardContent>

        {user && (
          <AircraftActions
            isClaiming={isClaiming}
            name={nft.metadata.name as string}
            hasAircraft={hasAircraft}
            onClaim={handleClaim}
          />
        )}
      </Paper>
    </Grid>
  )
}

export default React.memo(AircraftItem)
