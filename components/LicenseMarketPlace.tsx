import { Box, Typography, Grid, LinearProgress } from '@mui/material'
import React from 'react'
import { useContract } from '@thirdweb-dev/react'
import { nftLicenseTokenAddress } from 'contracts/address'
import LicenseItem from './LicenseItem'
import useClaimNFT from 'hooks/useClaimNFT'
import { useLicenseProviderContext } from 'context/LicenseProvider/LicenseProvider.context'

const LicenseMarketPlace: React.FC = () => {
  const { contract } = useContract(nftLicenseTokenAddress)
  const { licenses, ownedLicenses: owned, isLoading, refetchLicenses } = useLicenseProviderContext()
  const { claimLicenseNFT, isClaiming } = useClaimNFT(contract)

  if (isLoading) return <LinearProgress />

  return (
    <Box my={4}>
      <Typography variant='h2'>Licenses</Typography>
      <Typography>Start with LAPL Light aviation pilot license</Typography>
      <Grid container spacing={2}>
        {licenses.map(
          (license, i) =>
            i < 4 && (
              <LicenseItem
                isClaiming={isClaiming}
                nft={license}
                refetchLicenses={refetchLicenses}
                claimLicenseNFT={claimLicenseNFT}
                key={license.metadata.id}
                owned={owned.some((n) => license.metadata.id === n.metadata.id)}
              />
            )
        )}
      </Grid>
    </Box>
  )
}

export default LicenseMarketPlace
