import { Box, Typography, Grid, Card, CardHeader, CardContent, Stack, Alert, AlertTitle } from '@mui/material'
import { MediaRenderer, useUser, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import React from 'react'
import { nftAircraftTokenAddress } from 'contracts/address'
import { getNFTAttributes } from 'utils'

const MyAircrafts = () => {
  const { user } = useUser()
  const { contract } = useContract(nftAircraftTokenAddress)
  const { data: nfts = [], error } = useOwnedNFTs(contract, user?.address)

  return nfts && nfts.length > 0 ? (
    <Box my={4}>
      {!!error && (
        <Alert severity='error'>
          <AlertTitle>Ha ocurrido un error</AlertTitle>
        </Alert>
      )}
      <Typography variant='h2'>My Aircrafts</Typography>
      <Grid container spacing={2}>
        {nfts?.map((nft) => (
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
