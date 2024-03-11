import { Box, Typography, Grid, Card, CardHeader, CardContent, Stack } from '@mui/material'
import { MediaRenderer } from '@thirdweb-dev/react'
import React from 'react'
import { getNFTAttributes } from 'utils'
import { useAircraftProviderContext } from 'context/AircraftProvider/AircraftProvider.context'

const MyAircrafts = () => {
  const { ownedAircrafts } = useAircraftProviderContext()

  return ownedAircrafts.length > 0 ? (
    <Box my={4}>
      <Typography variant='h2'>My Aircrafts</Typography>
      <Grid container spacing={2}>
        {ownedAircrafts?.map((nft) => (
          <Grid item xs={12} lg={4} key={nft.metadata.id}>
            <Card>
              <MediaRenderer height='100%' width='100%' src={nft.metadata.image} />
              <CardHeader title={nft.metadata.name} subheader={nft.metadata.description} />
              <CardContent>
                {getNFTAttributes(nft).length > 0 && (
                  <>
                    <Stack direction='row' justifyContent='space-between'>
                      <Typography>Price</Typography>
                      <Typography variant='body2'>0.01</Typography>
                    </Stack>
                    {getNFTAttributes(nft).map((nft) => (
                      <Stack direction='row' justifyContent='space-between' key={nft.trait_type}>
                        <Typography>{nft.trait_type}</Typography>
                        <Typography variant='body2'>{nft.value}</Typography>
                      </Stack>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ) : (
    <></>
  )
}

export default MyAircrafts
