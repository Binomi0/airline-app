import { Box, Typography, Grid, Alert, AlertTitle, LinearProgress } from '@mui/material'
import React from 'react'
import { useContract, useNFTs, useOwnedNFTs } from '@thirdweb-dev/react'
import { nftLicenseTokenAddress } from 'contracts/address'
import LicenseItem from './LicenseItem'
import { useAlchemyProviderContext } from 'context/AlchemyProvider'
import useClaimNFT from 'hooks/useClaimNFT'

const LicenseMarketPlace: React.FC = () => {
  const { smartAccountAddress } = useAlchemyProviderContext()
  const { contract } = useContract(nftLicenseTokenAddress)
  const { data: nfts = [], isLoading, error } = useNFTs(contract)
  const { data: owned = [], refetch } = useOwnedNFTs(contract, smartAccountAddress)
  const { claimNFT, isClaiming } = useClaimNFT(contract)

  if (isLoading) {
    return <LinearProgress />
  }

  if (error) {
    console.error('error', error)
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
        {nfts.map(
          (nft, i) =>
            i < 4 && (
              <LicenseItem
                getLicenses={refetch}
                isClaiming={isClaiming}
                nft={nft}
                claimNFT={claimNFT}
                key={nft.metadata.id}
                owned={owned.some((n) => nft.metadata.id === n.metadata.id)}
              />
            )
        )}
      </Grid>
    </Box>
  )
}

export default LicenseMarketPlace
