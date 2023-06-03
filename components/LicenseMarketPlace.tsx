import { Box, Typography, Grid, Alert, AlertTitle, LinearProgress } from '@mui/material'
import React from 'react'
import { useContract, useNFTs, useOwnedNFTs, useUser } from '@thirdweb-dev/react'
import { nftLicenseTokenAddress } from 'contracts/address'
import LicenseItem from './LicenseItem'

const LicenseMarketPlace: React.FC = () => {
  const { user } = useUser()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data: nfts = [], isLoading, error } = useNFTs(contract)
  const { data: owned = [] } = useOwnedNFTs(contract, user?.address)

  if (isLoading) {
    return <LinearProgress />
  }

  if (error) {
    console.log('error', error)
    return (
      <Alert severity='error'>
        <AlertTitle>Ha ocurrido un error</AlertTitle>
      </Alert>
    )
  }

  return (
    <Box my={4}>
      <Typography variant='h2'>Licenses</Typography>
      <Typography>Start with LAPL Light aviation pilot license</Typography>
      <Grid container spacing={2}>
        {nfts.map((nft) => (
          <LicenseItem nft={nft} key={nft.metadata.id} owned={owned.some((n) => nft.metadata.id === n.metadata.id)} />
        ))}
      </Grid>
    </Box>
  )
}

export default LicenseMarketPlace
