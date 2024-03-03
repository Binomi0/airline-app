import { Grid, Card, CardContent, Stack, Typography, Paper } from '@mui/material'
import { NFT } from '@thirdweb-dev/react'
import React, { useCallback } from 'react'
import { getLicenseIdFromAttributes, getNFTAttributes } from 'utils'
import AircraftCardHeader from './AircraftCardHeader'
import AircraftActions from './AircraftActions'
import useAircraft from 'hooks/useAircraft'
import useAuth from 'hooks/useAuth'
import useLicense from 'hooks/useLicense'
import classes from './aircraft.module.css'

const AircraftItem: React.FC<{
  nft: NFT
  isClaiming: boolean
  // eslint-disable-next-line no-unused-vars
  onClaim: (refetch: () => void) => void
}> = ({ nft, isClaiming, onClaim }) => {
  const { user } = useAuth()
  const { hasAircraft, refetch: refetchAircraft } = useAircraft(nft.metadata.id)
  const { hasLicense, refetch: refetchLicense } = useLicense(getLicenseIdFromAttributes(getNFTAttributes(nft)))

  const refetch = useCallback(() => {
    refetchAircraft()
    refetchLicense()
  }, [refetchAircraft, refetchLicense])

  const handleClaim = useCallback(() => {
    onClaim(refetch)
  }, [onClaim, refetch])

  return (
    <Grid item xs={12} lg={6}>
      <Paper
        className={classes.paper}
        sx={
          {
            // borderRadius: '16px',
            // backgroundImage: 'linear-gradient(45deg, #000, #444);',
            // color: '#fff'
          }
        }
      >
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
            hasLicense={hasLicense}
            onClaim={handleClaim}
          />
        )}
      </Paper>
    </Grid>
  )
}

export default React.memo(AircraftItem)
