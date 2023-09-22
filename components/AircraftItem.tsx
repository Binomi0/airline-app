import { Grid, Card, CardContent, Stack, Typography } from '@mui/material'
import { NFT } from '@thirdweb-dev/react'
import React, { useCallback } from 'react'
import { getNFTAttributes } from 'utils'
import AircraftCardHeader from './Aircraft/CardHeader'
import AircraftActions from './Aircraft/AircraftActions'
import useAircraft from 'hooks/useAircraft'
import useAuth from 'hooks/useAuth'

const AircraftItem: React.FC<{
  nft: NFT
  isClaiming: boolean
  // eslint-disable-next-line no-unused-vars
  onClaim: (refetch: () => void) => void
  hasLicense?: boolean
}> = ({ nft, isClaiming, onClaim, hasLicense }) => {
  const {user} = useAuth()
  const { hasAircraft, refetch } = useAircraft(nft.metadata.id)

  const handleClaim = useCallback(() => {
    onClaim(refetch)
  }, [onClaim, refetch])

  return (
    <Grid item xs={12} lg={6}>
      <Card>
        <AircraftCardHeader nft={nft} />

        <CardContent>
          {getNFTAttributes(nft).map((attribute) => (
            <Stack direction='row' justifyContent='space-between' key={attribute.trait_type}>
              <Typography>{attribute.trait_type}</Typography>
              <Typography variant='body2'>{attribute.value}</Typography>
            </Stack>
          ))}
        </CardContent>

        {user && <AircraftActions
          isClaiming={isClaiming}
          name={nft.metadata.name as string}
          hasAircraft={hasAircraft}
          hasLicense={hasLicense}
          onClaim={handleClaim}
        />}
      </Card>
    </Grid>
  )
}

export default React.memo(AircraftItem)
